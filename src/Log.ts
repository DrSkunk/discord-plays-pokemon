/* eslint-disable @typescript-eslint/no-explicit-any */
class Log {
  public warn(...message: any) {
    // Yellow
    console.warn(
      '\x1b[33m%s',
      this.getTimestamp(),
      '- WARN -',
      ...message,
      '\x1b[0m'
    );
  }

  public error(...message: any) {
    // Red
    console.error(
      '\x1b[31m%s',
      this.getTimestamp(),
      '- ERROR -',
      ...message,
      '\x1b[0m'
    );
  }

  public info(...message: any) {
    // Blue
    console.info(
      '\x1b[36m%s',
      this.getTimestamp(),
      '- INFO -',
      ...message,
      '\x1b[0m'
    );
  }

  public log(...message: any) {
    console.log(this.getTimestamp(), '- LOG -', ...message);
  }

  public debug(...message: any) {
    // Magenta
    console.debug(
      '\x1b[35m%s',
      this.getTimestamp(),
      '- DEBUG -',
      ...message,
      '\x1b[0m'
    );
  }
  private getTimestamp() {
    return new Date().toISOString();
  }
}

const log = new Log();
export { log as Log };
