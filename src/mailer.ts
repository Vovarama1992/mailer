import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

// Используем import.meta.url, чтобы получить путь к шаблону
const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../template.html');
const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

// Настройка транспортира
const transporter = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
});

// Функция для отправки письма
const sendTestEmail = async (): Promise<void> => {
  try {
    // Заменяем имя в шаблоне
    const emailContent = htmlTemplate.replace('{{name}}', 'David');

    // Отправляем письмо на два адреса
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'davidbadzgaradze@gmail.com, vovayhh9988@gmail.com', // Два адреса в поле "to"
      subject: 'Test email from Postfix',
      html: emailContent,
    });

    console.log(`✅ Message sent: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Failed to send email:`, err);
  }
};

sendTestEmail();