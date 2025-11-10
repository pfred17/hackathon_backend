const Lesson = require("../models/lession.model");
const Session = require("../models/sessions.model");
/**
 * Append resources (e.g., videos) to a lesson without overwriting existing ones.
 * Body: { resources: [{ type: 'video', url, language?: 'vi'|'en', title?: string }, ...] }
 */
exports.addResourcesToLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { resources } = req.body;

    if (!Array.isArray(resources) || resources.length === 0) {
      return res.status(400).json({ message: "Vui lòng cung cấp mảng resources hợp lệ" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Không tìm thấy bài học" });
    }

    const current = (lesson.resources || []).map(r => `${r.type}|${r.url}|${r.language || ''}`);
    const toAdd = [];
    for (const r of resources) {
      if (!r || !r.type || !r.url) continue;
      const key = `${r.type}|${r.url}|${r.language || ''}`;
      if (!current.includes(key)) {
        toAdd.push({
          type: r.type,
          url: r.url,
          language: r.language,
          title: r.title,
        });
      }
    }

    if (toAdd.length === 0) {
      return res.status(200).json({ message: "Không có tài nguyên mới để thêm", added: 0, data: lesson });
    }

    const updated = await Lesson.findByIdAndUpdate(
      lessonId,
      { $addToSet: { resources: { $each: toAdd } } },
      { new: true }
    )
      .populate("subject", "name")
      .populate("students", "name email")
      .populate({
        path: "sessions",
        populate: { path: "subject", select: "name" }
      });

    return res.status(200).json({ message: `Đã thêm ${toAdd.length} tài nguyên`, added: toAdd.length, data: updated });
  } catch (error) {
    next(error);
  }
};
exports.createLesson = async (req, res, next) => {
  try {
    const {
      title,
      description,
      subject,
      resources,
      students,
      assignments,
      status,
    } = req.body;

    const newLesson = new Lesson({
      title,
      description,
      subject,
      resources,
      students,
      assignments,
      status,
    });

    const savedLesson = await newLesson.save();
    res.status(201).json({
      message: "Tạo bài học thành công",
      data: savedLesson,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find()
      .populate("subject", "name")
      .populate("students", "name email")
      .populate({
        path: "sessions",
        populate: {
          path: "subject",
          select: "name"
        }
      });
    res.status(200).json(lessons);
  } catch (error) {
    next(error);
  }
};

exports.getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate("subject", "name")
      .populate("students", "name email")
      .populate({
        path: "sessions",
        populate: {
          path: "subject",
          select: "name"
        }
      });
    if (!lesson)
      return res.status(404).json({ message: "Không tìm thấy bài học" });
    res.status(200).json(lesson);
  } catch (error) {
    next(error);
  }
};

exports.updateLesson = async (req, res, next) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLesson)
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài học để cập nhật" });
    res.status(200).json({
      message: "Cập nhật bài học thành công",
      data: updatedLesson,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!deletedLesson)
      return res.status(404).json({ message: "Không tìm thấy bài học để xóa" });
    res.status(200).json({ message: "Xóa bài học thành công" });
  } catch (error) {
    next(error);
  }
};

exports.addSessionsToLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { sessionIds } = req.body; // Array of session IDs

    if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
      return res.status(400).json({ message: "Vui lòng cung cấp mảng sessionIds hợp lệ" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Không tìm thấy bài học" });
    }

    // Kiểm tra sessions có tồn tại không
    const existingSessions = await Session.find({ _id: { $in: sessionIds } });
    if (existingSessions.length !== sessionIds.length) {
      return res.status(400).json({ 
        message: "Một số sessions không tồn tại",
        found: existingSessions.length,
        requested: sessionIds.length
      });
    }

    // Thêm sessions vào lesson (tránh trùng lặp)
    const currentSessions = lesson.sessions.map(id => id.toString());
    const newSessions = sessionIds.filter(id => !currentSessions.includes(id));
    
    if (newSessions.length === 0) {
      return res.status(400).json({ message: "Tất cả sessions đã được thêm vào lesson" });
    }

    // Xử lý trường hợp lesson có "name" thay vì "title"
    const updateData = {
      $addToSet: { sessions: { $each: newSessions } }
    };
    
    // Nếu lesson có name nhưng không có title, set title từ name
    if (!lesson.title && lesson.name) {
      updateData.$set = { title: lesson.name };
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      updateData,
      { new: true, runValidators: false }
    );

    res.status(200).json({
      message: `Đã thêm ${newSessions.length} sessions vào bài học`,
      added: newSessions.length,
      skipped: sessionIds.length - newSessions.length,
      data: await Lesson.findById(lessonId)
        .populate("subject", "name")
        .populate("students", "name email")
        .populate({
          path: "sessions",
          populate: {
            path: "subject",
            select: "name"
          }
        }),
    });
  } catch (error) {
    next(error);
  }
};
