// Đây là service demo, có thể thay bằng OpenAI Whisper hoặc Google Speech-to-Text
const transcribeAudio = async (filePath) => {
  // TODO: Thay bằng API thực tế, ví dụ:
  // const response = await openai.audio.transcriptions.create({
  //     file: fs.createReadStream(filePath),
  //     model: "whisper-1"
  // });

  // Demo: giả lập chuyển đổi
  return "Đây là văn bản chuyển đổi từ file audio (demo).";
};

module.exports = { transcribeAudio };
