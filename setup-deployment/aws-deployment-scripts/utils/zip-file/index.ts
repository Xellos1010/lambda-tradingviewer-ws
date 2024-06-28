import { join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';
import { getStageConfig } from '../StageConfig';
import os from 'os';
import { logMessage } from '../logger';

export const compressProjectFiles = (directoryToZip: string) => {
    const stageConfig = getStageConfig();
    const { ZIP_FILE, LOG_FILE } = stageConfig;
    const zipFilePath = join(process.cwd(), ZIP_FILE);
    const distDir = join(process.cwd(), directoryToZip);

    // Ensure the dist directory exists
    if (!existsSync(distDir)) {
        logMessage(LOG_FILE, `Creating directory: ${distDir}`);
        mkdirSync(distDir, { recursive: true });
    }

    // Check if ZIP_FILE exists and delete it if it does
    if (existsSync(zipFilePath)) {
        logMessage(LOG_FILE, `Deleting existing ZIP file: ${zipFilePath}`);
        try {
            unlinkSync(zipFilePath);
            logMessage(LOG_FILE, `Deleted ZIP file: ${zipFilePath}`);
        } catch (error) {
            logMessage(LOG_FILE, `Failed to delete ZIP file: ${zipFilePath}`);
            console.error('Failed to delete ZIP file:', error);
            process.exit(1);
        }
    }

    // Determine the zip command based on the operating system
    let zipCommand;

    if (os.platform() === 'win32') {
        // Check if 7z is available
        try {
            execSync('7z', { stdio: 'ignore' });
            zipCommand = `7z a "${zipFilePath}" * -r`;
        } catch {
            // If 7z is not available, use PowerShell Compress-Archive
            zipCommand = `powershell Compress-Archive -Path "${distDir}\\*" -DestinationPath "${zipFilePath}"`;
        }
    } else {
        // Use the default zip command on Mac
        zipCommand = `zip -r "${zipFilePath}" .`;
    }

    // Compress files
    logMessage(LOG_FILE, 'Compressing project files into ZIP...');
    try {
        execSync(zipCommand, { cwd: distDir });
        logMessage(LOG_FILE, 'Compression complete.');
    } catch (error) {
        logMessage(LOG_FILE, 'Compression failed. Check output in the log file for details.');
        console.error('Compression failed. Check output in the log file for details.', error);
        process.exit(1);
    }
};
