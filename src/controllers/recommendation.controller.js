const OpenAI = require("openai");
const ChatHistory = require("../models/chathisory.model");
const Lesson = require("../models/lession.model");
const Score = require("../models/score.model");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getAIRecommendation = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.user; // lấy id từ token hoặc body test
    if (!userId) return res.status(400).json({ message: "Thiếu userId" });

    //  Lấy dữ liệu gần nhất của user
    const chats = await ChatHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
    const lessons = await Lesson.find().limit(10);
    const scores = await Score.find({ user: userId }).populate("lesson");

    //  Chuẩn bị dữ liệu gửi cho AI
    const userContext = `
    Lịch sử chat gần đây: ${chats.map(c => c.topic || c.messages?.at(-1)?.message).join(", ")}
    Tiến độ học: ${scores.map(s => `${s.lesson.title}(${s.score} điểm)`).join(", ")}
    Danh sách bài học có sẵn: ${lessons.map(l => l.title).join(", ")}
    `;

    // Gọi OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Bạn là trợ lý học tập thông minh giúp sinh viên chọn bài học tiếp theo." },
        { role: "seeker", content: userContext },
      ],
    });

    const suggestion = completion.choices[0].message.content;
    res.json({ suggestion });
  } catch (err) {
    next(err);
  }
};
