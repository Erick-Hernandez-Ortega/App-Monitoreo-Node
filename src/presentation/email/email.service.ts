import nodemailer from 'nodemailer';
import {envs} from "../../config/plugins/envs.plugin";
import {LogEntity, LogSeverityLevel} from "../../domain/entities/log.entity";

interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[];
}

interface Attachment {
    filename: string;
    path: string;
}

export class EmailService {
    private transporter = nodemailer.createTransport({
       service: envs.MAILER_SERVICE,
        auth: {
           user: envs.MAILER_MAIL,
            pass: envs.MAILER_SECRET_KEY,
        }
    });

    async sendEmail(options: SendMailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachments = [] } = options;

        try {
            await this.transporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments
            })

            const log = new LogEntity({
                level: LogSeverityLevel.low,
                message: 'Email send',
                origin: 'email.service.ts',
            })

            return true;
        } catch (error: any) {
            const log = new LogEntity({
                level: LogSeverityLevel.high,
                message: `Email not send ${error?.message}`,
                origin: 'email.service.ts',
            })
            return false;
        }
    }

    async sendEmailWithFileSystemLogs(to: string | string[]): Promise<boolean> {
        const subject: string = 'Logs del servidor';
        const htmlBody: string = `
            <h3>Logs del sistema</h3>
        `;
        const attachments: Attachment[] = [
            {filename: 'logs-all.log', path: './logs/logs-all.log'},
            {filename: 'logs-high.log', path: './logs/logs-high.log'},
            {filename: 'logs-medium.log', path: './logs/logs-medium.log'},
        ];

        return await this.sendEmail({
            to,
            subject,
            htmlBody,
            attachments
        });
    }
}