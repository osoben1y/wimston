import mailer from "nodemailer";

export const transporter = async (email, title, otpCode) => {
  try {
    const transporter = mailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      secure: true,
    });

    const sendMail = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: title,
      text: otpCode,
    });

    console.log(sendMail);
  } catch (error) {
    console.error(`Error in sending email:`, error);
  }
};
