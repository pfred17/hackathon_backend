const Session = require("../models/sessions.model");
const Subject = require("../models/subject.model");
const SessionMessage = require("../models/SessionMessage.model");
const { spawn } = require("child_process");

exports.createSession = async (req, res, next) => {
  try {
    const { _id, title, description, type, contentUrl, textContent, subject } = req.body;

    const newSession = new Session({
      _id,
      title,
      description,
      type,
      contentUrl,
      textContent,
      subject,
    });

    const savedSession = await newSession.save();
    res.status(201).json({
      message: "Tạo session thành công",
      data: savedSession,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find();
    
    // Lấy messages cho từng session
    const sessionsWithMessages = await Promise.all(
      sessions.map(async (session) => {
        const messages = await SessionMessage.find({
          sessionId: session._id,
          isDeleted: false
        })
          .populate("user", "name email avatar")
          .populate({
            path: "replyTo",
            populate: {
              path: "user",
              select: "name email avatar"
            }
          })
          .sort({ createdAt: 1 })
          .limit(50); // Giới hạn 50 messages mới nhất

        const sessionObj = session.toObject();
        sessionObj.sessionsMessages = messages;
        return sessionObj;
      })
    );

    res.status(200).json(sessionsWithMessages);
  } catch (error) {
    next(error);
  }
};

exports.getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id).populate("subject", "name");
    if (!session)
      return res.status(404).json({ message: "Không tìm thấy session" });
    
    // Lấy messages của session này
    const messages = await SessionMessage.find({
      sessionId: session._id,
      isDeleted: false
    })
      .populate("user", "name email avatar")
      .populate({
        path: "replyTo",
        populate: {
          path: "user",
          select: "name email avatar"
        }
      })
      .sort({ createdAt: 1 })
      .limit(100); // Giới hạn 100 messages

    const sessionObj = session.toObject();
    sessionObj.sessionsMessages = messages;
    
    res.status(200).json(sessionObj);
  } catch (error) {
    next(error);
  }
};

exports.updateSession = async (req, res, next) => {
  try {
    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("subject", "name");
    if (!updatedSession)
      return res
        .status(404)
        .json({ message: "Không tìm thấy session để cập nhật" });
    res.status(200).json({
      message: "Cập nhật session thành công",
      data: updatedSession,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const deletedSession = await Session.findByIdAndDelete(req.params.id);
    if (!deletedSession)
      return res.status(404).json({ message: "Không tìm thấy session để xóa" });
    res.status(200).json({ message: "Xóa session thành công" });
  } catch (error) {
    next(error);
  }
};

exports.bulkCreateSessions = async (req, res, next) => {
  try {
    const { sessions } = req.body; // Array of sessions from mockSessions

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return res.status(400).json({ message: "Vui lòng cung cấp mảng sessions hợp lệ" });
    }

    const createdSessions = [];
    const errors = [];

    for (const sessionData of sessions) {
      try {
        // Tìm hoặc tạo subject dựa trên tên
        let subject = await Subject.findOne({ name: sessionData.subject });
        
        if (!subject) {
          // Tạo subject mới nếu chưa tồn tại
          subject = new Subject({
            name: sessionData.subject,
            description: `Môn học: ${sessionData.subject}`,
            status: true,
          });
          await subject.save();
        }

        // Kiểm tra session đã tồn tại chưa
        const existingSession = await Session.findById(sessionData._id);
        if (existingSession) {
          errors.push({
            _id: sessionData._id,
            title: sessionData.title,
            error: "Session đã tồn tại",
          });
          continue;
        }

        // Tạo session mới
        const newSession = new Session({
          _id: sessionData._id,
          title: sessionData.title,
          description: sessionData.description || "",
          type: sessionData.type || "text",
          contentUrl: sessionData.contentUrl || "",
          textContent: sessionData.textContent || "",
          subject: subject._id,
          createdAt: sessionData.createdAt ? new Date(sessionData.createdAt) : new Date(),
        });

        const savedSession = await newSession.save();
        createdSessions.push(savedSession);
      } catch (error) {
        errors.push({
          _id: sessionData._id,
          title: sessionData.title,
          error: error.message,
        });
      }
    }

    res.status(201).json({
      message: `Tạo thành công ${createdSessions.length} sessions`,
      created: createdSessions.length,
      failed: errors.length,
      data: createdSessions,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// Đặt video URL và ngôn ngữ cho session
exports.setSessionVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contentUrl, language } = req.body;
    if (!contentUrl) {
      return res.status(400).json({ message: "Vui lòng cung cấp contentUrl" });
    }
    const update = { type: "video", contentUrl };
    if (language) update.language = language;
    const updated = await Session.findByIdAndUpdate(id, update, { new: true }).populate("subject", "name");
    if (!updated) return res.status(404).json({ message: "Không tìm thấy session" });
    res.status(200).json({ message: "Cập nhật video cho session", data: updated });
  } catch (error) {
    next(error);
  }
};

// Tạo phụ đề (SRT) từ audio upload và gắn vào session
exports.generateSubtitlesFromAudio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Không tìm thấy session" });
    if (!req.file) return res.status(400).json({ message: "Vui lòng upload file audio" });

    // Ngôn ngữ ưu tiên: từ body hoặc từ session
    const lang = (req.body.language || session.language || "vi").toLowerCase();

    const pythonProcess = spawn("python", [
      "../hackathon_backend/src/AI/app.py",
      req.file.path,
      lang,
    ]);

    let output = "";
    let errout = "";
    pythonProcess.stdout.on("data", (data) => { output += data.toString(); });
    pythonProcess.stderr.on("data", (data) => { errout += data.toString(); });
    pythonProcess.on("close", async (code) => {
      try {
        const result = JSON.parse(output);
        if (!result.success) {
          return res.status(500).json({ message: "Python error", error: result.error, stderr: errout });
        }
        const { text_input, srt } = result;
        const updated = await Session.findByIdAndUpdate(
          id,
          { textContent: text_input || session.textContent, subtitles: srt || session.subtitles },
          { new: true }
        ).populate("subject", "name");
        return res.status(200).json({ message: "Đã tạo phụ đề và gắn vào session", data: updated });
      } catch (e) {
        return res.status(500).json({ message: "Invalid JSON from Python", error: e.message, stderr: errout });
      }
    });
  } catch (error) {
    next(error);
  }
};
