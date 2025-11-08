const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const transcribeAudio = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("model", "whisper-1");

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    return response.data.text;
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    throw new Error("STT failed");
  }
};

module.exports = { transcribeAudio };
