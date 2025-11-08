// Đây là service mô phỏng AI, có thể thay bằng OpenAI GPT
const callAIService = async (question) => {
  // TODO: Thay thế bằng API thực tế, ví dụ OpenAI GPT
  // Ví dụ: gửi request tới OpenAI và trả về câu trả lời
  return `AI trả lời cho câu hỏi: "${question}" (dạng demo).`;
};

module.exports = { callAIService };
