import * as dotenv from 'dotenv'; 
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Устанавливаем переменные окружения
dotenv.config();

// Получаем путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Путь к шаблону письма
const templatePath = path.join(__dirname, 'template.html');
let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

// Список портов для пробования
const ports: number[] = [25, 587, 465];

// Создание транспортера для отправки почты
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,  
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: true,  
  debug: true,   
});

// Отправка тестового письма
const sendTestEmail = async (): Promise<void> => {
  for (let i = 0; i < ports.length; i++) {
    const port = ports[i];
    try {
      console.log(`📝 Trying port: ${port}`);

      // Заменяем {{name}} на имя получателя
      const emailContent = htmlTemplate.replace('{{name}}', 'David');

      // Отправляем письмо
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM, 
        to: 'davidbadzgaradze@gmail.com',
        subject: 'Test email from SMTP server',
        html: emailContent,
      });

      console.log(`✅ Message sent on port ${port}: ${info.messageId}`);
      break; 
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`❌ Error sending email on port ${port}: ${err.message}`);
      } else {
        console.error(`❌ Error on port ${port}: Unknown error`);
      }
    }
  }
};

// Запускаем отправку тестового письма
sendTestEmail();
