import {LogRepository} from "../../repository/log.repository";
import {LogEntity, LogSeverityLevel} from "../../entities/log.entity";

interface CheckServiceUseCase {
    execute(url: string): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckService implements CheckServiceUseCase {
    constructor(
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback,
        private readonly logRepository: LogRepository
    ) {}

    async execute(url: string): Promise<boolean> {
        try {
            const req: Response = await fetch(url);

            if (!req.ok) {
                throw new Error(`${url} not ok`);
            }

            const log = new LogEntity({
                message: `Service ${url} working`,
                level: LogSeverityLevel.low,
                origin: 'check-service.ts',
            });
            await this.logRepository.saveLog(log);
            this.successCallback && this.successCallback();
            return true;
        } catch (error: any) {
            const errorMessage: string = `${url} is not ok. ${error}`;

            const log = new LogEntity({
                message: errorMessage,
                level: LogSeverityLevel.high,
                origin: 'check-service.ts',
            });
            await this.logRepository.saveLog(log);
            this.errorCallback && this.errorCallback(errorMessage)
            return false;
        }
    }
}