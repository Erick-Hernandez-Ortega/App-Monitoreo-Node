import {LogDatasource} from "../../domain/datasources/log.datasource";
import {LogEntity, LogSeverityLevel} from "../../domain/entities/log.entity";
import {PrismaClient, SeverityLevel} from "../../generated/prisma";

const prismaClient = new PrismaClient();

const severityEnum = {
    low: SeverityLevel.LOW,
    medium: SeverityLevel.MEDIUM,
    high: SeverityLevel.HIGH,
}

export class PostgresLogDatasource implements LogDatasource {
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        const level: 'LOW' | 'MEDIUM' | 'HIGH' = severityEnum[severityLevel];
        const dbLogs = await prismaClient.logModel.findMany({
            where: { level }
        });

        return dbLogs.map((log) => LogEntity.fromObject(log));
    }

    async saveLog(log: LogEntity): Promise<void> {
        const level: 'LOW' | 'MEDIUM' | 'HIGH' = severityEnum[log.level];

        await prismaClient.logModel.create({
            data: {
                ...log,
                level
            }
        });
    }
}