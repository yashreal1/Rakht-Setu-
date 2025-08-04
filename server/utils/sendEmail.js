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
      html: text.includes('http://localhost:3000/donate/') ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e11d48;">Blood Request Alert</h2>
          ${text.split('\n').map(line => 
            line.startsWith('http') ? 
            `<div style="text-align: center; margin: 20px 0;">
              <a href="${line}" style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Donate Blood Now
              </a>
            </div>` :
            `<p style="margin: 10px 0;">${line}</p>`
          ).join('')}
        </div>
      ` : undefined
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
