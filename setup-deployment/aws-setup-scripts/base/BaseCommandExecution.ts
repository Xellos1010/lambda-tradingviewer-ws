import { execSync } from 'child_process';
import { logMessage } from '../../aws-deployment-scripts/utils/logger';

export abstract class BaseCommandExecution {
    protected executeCommandWithLogging(command: string, logFilePath: string): void {
        logMessage(logFilePath, `Executing command: ${command}`);
        try {
            const stdout = execSync(command, { stdio: 'pipe' }).toString();
            logMessage(logFilePath, `Successfully executed command: ${command}\nOutput: ${stdout}`);
        } catch (error) {
            if (error instanceof Error) {
                const stderr = (error as any).stderr?.toString() || '';
                const errorMessage = `Error executing command: ${command} - ${stderr || error.message}`;
                logMessage(logFilePath, errorMessage);
                console.error(errorMessage);
            } else {
                const genericErrorMessage = `Error executing command: ${command} - ${error}`;
                logMessage(logFilePath, genericErrorMessage);
                console.error(genericErrorMessage);
            }
        }
    }
}
