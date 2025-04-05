import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), 'template.html');
const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

// Настройка транспорта
const transporter = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 25,
  secure: false,  // Не используем SSL, так как это локальный сервер
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
});

// Функция для отправки тестового письма
const sendTestEmail = async (): Promise<void> => {
  try {
    // Заменяем шаблон {{name}} на значение "David"
    const emailContent = htmlTemplate.replace('{{name}}', 'David');

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM, // Адрес отправителя из .env
      to: 'davidbadzgaradze@gmail.com', // Получатель
      subject: 'Test email from Postfix', // Тема письма
      html: emailContent, // Тело письма с подставленным значением
    });

    console.log(`✅ Message sent: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Failed to send email:`, err);
  }
};

// Отправляем письмо
sendTestEmail();