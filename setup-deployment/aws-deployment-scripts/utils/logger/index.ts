import { appendFileSync, existsSync, unlinkSync, writeFileSync } from 'fs';

/**
 * Sets up the log file by creating or clearing the log file at the specified path.
 * @param logFilePath The path to the log file.
 */

export const setupLogFile = (logFilePath: string) => {
    if (existsSync(logFilePath)) {
        unlinkSync(logFilePath); // Delete the existing log file
    }
    writeFileSync(logFilePath, '', 'utf8'); // Create an empty log file
};
/**
 * Logs a message to the specified log file.
 * @param logFilePath The path to the log file.
 * @param message The message to log.
 */

export const logMessage = (logFilePath: string, message: string) => {
    if (existsSync(logFilePath)) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;
        appendFileSync(logFilePath, logEntry, 'utf8');
        console.log(logEntry); // Also print the message to the console
    }
    else {
        console.error("No Log Filepath is set");
    }
};

/**
 * Logs a message and throws an error.
 * @param logFilePath The path to the log file.
 * @param message The message to log and include in the error.
 */
export const logErrorAndThrow = (logFilePath: string, message: string) => {
    logMessage(logFilePath, message);
    throw new Error(message);
};