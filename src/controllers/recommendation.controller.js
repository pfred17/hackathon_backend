const ChatHistory = require("../models/chathisory.model");
const Lesson = require("../models/lession.model");
const Score = require("../models/score.model");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // nhớ để key trong .env
});

exports.getAIRecommendation = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.user;
    if (!userId) return res.status(400).json({ message: "Thiếu userId" });

    // Lấy dữ liệu gần nhất
    const chats = await ChatHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
    const lessons = await Lesson.find().limit(10);
    const scores = await Score.find({ user: userId }).populate("lesson");

    const userContext = `
Lịch sử chat gần đây: ${chats.map(c => c.topic || c.messages?.at(-1)?.message).join(", ")}
Tiến độ học: ${scores.map(s => `${s.lesson.title}(${s.score} điểm)`).join(", ")}
Danh sách bài học có sẵn: ${lessons.map(l => l.title).join(", ")}
`;

    // Gọi OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // free tier
      messages: [
        { role: "system", content: "Bạn là trợ lý học tập thông minh giúp sinh viên chọn bài học tiếp theo." },
        { role: "user", content: `Dựa trên thông tin sau, gợi ý bài học tiếp theo cho sinh viên:\n${userContext}` },
      ],
    });

    const suggestion = completion.choices[0].message.content;
    res.json({ suggestion });

  } catch (err) {
    next(err);
  }
};
