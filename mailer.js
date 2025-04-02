require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'davidbadzgaradze@gmail.com',
      subject: 'Test email from SMTP server',
      html: '<h2>Hello David!</h2><p>This is a test email from our new SMTP server.</p>',
    });

    console.log(`✅ Message sent: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Error sending email: ${err.message}`);
  }
};

sendTestEmail();