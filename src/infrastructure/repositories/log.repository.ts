import {LogRepository} from "../../domain/repository/log.repository";
import {LogEntity, LogSeverityLevel} from "../../domain/entities/log.entity";
import {LogDatasource} from "../../domain/datasources/log.datasource";

export class LogRepositoryImplementation implements LogRepository {
    constructor(
       private readonly logDatasource: LogDatasource
    ) {}

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        return this.logDatasource.getLogs(severityLevel);
    }

    async saveLog(log: LogEntity): Promise<void> {
        await this.logDatasource.saveLog(log);
    }
}