import * as dotenv from 'dotenv'; 
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const templatePath = path.join(__dirname, 'template.html');
let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

const ports: number[] = [25, 587, 465];

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

const sendTestEmail = async (): Promise<void> => {
  for (let i = 0; i < ports.length; i++) {
    const port = ports[i];
    try {
      console.log(`📝 Trying port: ${port}`);
      
      const emailContent = htmlTemplate.replace('{{name}}', 'David');

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

sendTestEmail();
