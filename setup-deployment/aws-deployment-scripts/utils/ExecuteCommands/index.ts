import { execSync } from 'child_process';
import { logMessage } from '../logger';

/**
 * Executes a command and logs the output or error.
 * @param command The command to execute.
 * @param logFilePath The path to the log file.
 */
export const executeCommandWithLogging = (command: string, logFilePath: string) => {
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
};
