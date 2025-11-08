const { callAIService } = require("../services/ai.service");

const getChatbotReply = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Vui lòng nhập câu hỏi." });
    }

    // Gọi service AI để nhận câu trả lời
    const answer = await callAIService(question);

    res.json({ reply: answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý câu hỏi." });
  }
};

module.exports = { getChatbotReply };
