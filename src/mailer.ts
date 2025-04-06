import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

// Путь к шаблону
const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../template.html');
const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

// Путь к баннеру
const pathToBanner = path.join(path.dirname(new URL(import.meta.url).pathname), '../images/banner.jpg');

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

const sendTestEmail = async () => {
  try {
    // Подстановка переменных в шаблон
    const emailContent = htmlTemplate.replace('{{name}}', 'David')
                                    .replace('{{subject}}', 'Тестовое письмо от Postfix')
                                    .replace('{{offer_details}}', 'Получите 100 бесплатных спинов!');

    // Отправка письма
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: 'davidbadzgaradze@gmail.com, vovayhh9988@gmail.com, duta1101@gmail.com, test-46i49qpqw@srv1.mail-tester.com',
        subject: 'Test email from Postfix',
        html: emailContent,
        attachments: [
          {
            filename: 'banner.jpg', // Имя файла
            path: pathToBanner, // Путь к файлу на сервере
            cid: 'bannerImage' // Этот cid должен совпадать с ссылкой в HTML
          }
        ]
    });

    console.log(`✅ Message sent: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Failed to send email:`, err);
  }
};

sendTestEmail();