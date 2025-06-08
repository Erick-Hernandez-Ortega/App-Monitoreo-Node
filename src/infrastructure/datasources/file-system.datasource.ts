import {LogDatasource} from "../../domain/datasources/log.datasource";
import {LogEntity, LogSeverityLevel} from "../../domain/entities/log.entity";
import fs from 'fs';

export class FileSystemDatasource implements LogDatasource{
    private readonly logPath: 'logs/' = 'logs/';
    private readonly allLogsPath: 'logs/logs-all.log' = 'logs/logs-all.log';
    private readonly mediumLogsPath: 'logs/logs-medium.log' = 'logs/logs-medium.log';
    private readonly highLogsPath: 'logs/logs-high.log' = 'logs/logs-high.log';

    constructor() {
        this.createLogsFiles()
    }

    private createLogsFiles = (): void => {
        if (!fs.existsSync(this.logPath)) fs.mkdirSync(this.logPath);

        [
            this.allLogsPath,
            this.mediumLogsPath,
            this.highLogsPath,
        ].forEach(path => {
            if (fs.existsSync(path)) return;

            fs.writeFileSync(path, '');
        })
    }

    private getLogsFromFile = (path: string): LogEntity[] => {
          const content: string = fs.readFileSync(path, 'utf-8').toString();
          return content.split('\n').map(line => LogEntity.fromJson(line));
    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        switch (severityLevel) {
            case LogSeverityLevel.high:
                return this.getLogsFromFile(this.highLogsPath);
            case LogSeverityLevel.low:
                return this.getLogsFromFile(this.allLogsPath);
            case LogSeverityLevel.medium:
                return this.getLogsFromFile(this.mediumLogsPath);
            default:
                throw new Error(`Unsupported log severity level: ${severityLevel}`);
        }
    }

    async saveLog(newLog: LogEntity): Promise<void> {
        const logAsJson: string = `${JSON.stringify(newLog)}\n`;

        fs.appendFileSync(this.allLogsPath, logAsJson);

        if (newLog.level === LogSeverityLevel.low) return ;

        if (newLog.level === LogSeverityLevel.medium)
            return fs.appendFileSync(this.mediumLogsPath, logAsJson);

        return fs.appendFileSync(this.highLogsPath, logAsJson);
    }
}