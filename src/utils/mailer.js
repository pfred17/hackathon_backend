require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetPasswordEmail = async (to, token) => {
  const resetUrl = `http://localhost:5000/api/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `
      <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
      <p>Nhấn vào link bên dưới để đặt lại mật khẩu (có hiệu lực trong 15 phút):</p>
      <a href="${resetUrl}"><button>ĐẶT LẠI MẬT KHẨU</button></a>
    `,
  });
};

module.exports = { sendResetPasswordEmail };
