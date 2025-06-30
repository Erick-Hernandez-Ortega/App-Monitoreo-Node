import {CronService} from "./cron/cron-service";
import {CheckService} from "../domain/use-cases/checks/check-service";
import {LogRepositoryImplementation} from "../infrastructure/repositories/log.repository";
import {FileSystemDatasource} from "../infrastructure/datasources/file-system.datasource";
import {EmailService} from "./email/email.service";
import {MongoLogDatasource} from "../infrastructure/datasources/mongo-log.datasource";

const fileSystemLogRepository: LogRepositoryImplementation = new LogRepositoryImplementation(new FileSystemDatasource());
const mongoDBLogRepository: LogRepositoryImplementation = new LogRepositoryImplementation(new MongoLogDatasource())
const emailService = new EmailService();

export class ServerApp {
    public static start(): void {
		CronService.createJob('*/5 * * * * *', (): void => {
            new CheckService(
                (): void => console.log('url is ok'),
                (error: string): void => console.error(error),
                mongoDBLogRepository,
            ).execute('https://www.google.com/')
        });
    }
}