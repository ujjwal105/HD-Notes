const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === "production" || process.env.EMAIL_USER) {
    // Production or configured email service (Brevo SMTP)
    return nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Development fallback - use Ethereal Email for testing
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "ethereal.user@ethereal.email",
        pass: "ethereal.pass",
      },
    });
  }
};

const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@hdapp.com",
      to: email,
      subject: "Your HD App OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #367AFF; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Highway Delite</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #232323;">Hello ${name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Your OTP code for HD App is:
            </p>
            <div style="background-color: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; border: 2px solid #367AFF;">
              <h1 style="color: #367AFF; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">
              This OTP will expire in 10 minutes. Please do not share this code with anyone.
            </p>
            <p style="color: #666; font-size: 14px;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
          <div style="background-color: #232323; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 12px;">
              © 2024 HD App. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendOTPEmail };
