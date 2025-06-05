import {CronService} from "./cron/cron-service";
import {CheckService} from "../domain/use-cases/checks/check-service";

export class ServerApp {
    public static start(): void {
		CronService.createJob('*/5 * * * * *', (): void => {
            new CheckService(
                (): void => console.log('url is ok'),
                (error: string): void => console.error(error),
            ).execute('https://www.google.com/')
        });
    }
}