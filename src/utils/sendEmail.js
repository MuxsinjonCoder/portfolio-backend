import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, verificationLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // user: "muxsinjon1610@gmail.com",
      // pass: "oywe vffh tprs qkhr",
    },
  });

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    <h2 style="color: #333;">Ro'yxatdan o'tishni tasdiqlang</h2>
    <p style="font-size: 16px; color: #555;">
      Assalomu alaykum,<br />
      Ro'yxatdan o'tishni yakunlash uchun quyidagi tugmani bosing:
    </p>
    <div style="text-align: center;">
      <a href="${verificationLink}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #268ACA; color: white; text-decoration: none; font-weight: bold; border-radius: 6px;">
        Tasdiqlash
      </a>
    </div>
    <p style="font-size: 14px; color: #999; margin-top: 20px;">
      Ushbu havola 3 daqiqa davomida amal qiladi.
    </p>
  </div>
`;

  const mailOptions = {
    // from: "muxsinjon1610@gmail.com",
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
