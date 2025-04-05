const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  if (!to || !subject || !text) {
    throw new Error('Missing required email parameters');
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration is missing');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Life Bridge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${to}`);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", {
      to,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

module.exports = sendEmail;
