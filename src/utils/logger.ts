// Logger utility class for logging messages in the application
export class Logger {
  // Logs an informational message to the console
  static info(message: string) {
    console.log(`[INFO] ${message}`);
  }

  // Logs an error message to the console
  static error(message: string) {
    console.error(`[ERROR] ${message}`);
  }
}