import fs from 'fs';
import path from 'path';

// Helper function to write performance data to a file
export function writePerformanceDataToFile(testName: string, timings: any) {
  const dir = path.join(__dirname, '..', 'testResults');
  const filePath = path.join(dir, `${testName}_performanceMetrics.json`);

  // Ensure the testResults directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Write the timings object to a file
  fs.writeFileSync(filePath, JSON.stringify(timings, null, 2));
}
