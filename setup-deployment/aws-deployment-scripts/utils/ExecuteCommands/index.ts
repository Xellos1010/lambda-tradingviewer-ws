import { execSync, spawnSync } from 'child_process';
import { logMessage } from '../logger';

/**
 * Executes a command synchronously and logs the output.
 * @param command The command to execute.
 * @param logFilePath The path to the log file.
 */

export const executeCommand = (command: string, logFilePath?: string) => {
    try {
        logMessage(logFilePath || '', `Executing command: ${command}`);
        const result = execSync(command, { stdio: 'inherit' });
        logMessage(logFilePath || '', `Command executed successfully: ${command}`);
        return result.toString();
    } catch (error) {
        const errorMessage = `Error executing command: ${command}\n${error}`;
        logMessage(logFilePath || '', errorMessage);
        throw new Error(errorMessage);
    }
};
/**
 * Executes a command asynchronously and logs the output.
 * @param command The command to execute.
 * @param logFilePath The path to the log file.
 */

export const executeCommandAsync = (command: string, logFilePath?: string) => {
    return new Promise((resolve, reject) => {
        logMessage(logFilePath || '', `Executing command: ${command}`);
        const result = spawnSync(command, { shell: true, stdio: 'inherit' });

        if (result.error) {
            const errorMessage = `Error executing command: ${command}\n${result.error}`;
            logMessage(logFilePath || '', errorMessage);
            reject(new Error(errorMessage));
        } else {
            logMessage(logFilePath || '', `Command executed successfully: ${command}`);
            resolve(result.stdout ? result.stdout.toString() : '');
        }
    });
};
