import {EmailService} from "../../../presentation/email/email.service";
import {LogRepository} from "../../repository/log.repository";
import {LogEntity, LogSeverityLevel} from "../../entities/log.entity";

interface SendEmailLogsUseCase {
    execute: (to: string | string[]) => Promise<boolean>;
}

export class SendEmailLogs implements SendEmailLogsUseCase {
    constructor(
        private readonly emailService: EmailService,
        private readonly logRepository: LogRepository
    ) {}

    async execute(to: string | string[]): Promise<boolean> {
        
        try {
            const response: boolean = await this.emailService.sendEmailWithFileSystemLogs(to);

            if (!response) throw new Error('Error sending email logs');

            const log = new LogEntity({
                origin: 'Send email logs ts',
                message: `Log email send`,
                level: LogSeverityLevel.low
            });
            await this.logRepository.saveLog(log);

            return true;
        } catch (error: unknown) {
            const log = new LogEntity({
                origin: 'Send email logs ts',
                message: `${error}`,
                level: LogSeverityLevel.high
            });
            await this.logRepository.saveLog(log);
            return false;
        }
    }
}