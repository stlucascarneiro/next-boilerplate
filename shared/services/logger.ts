interface ILog {
  label: string;
  message: string;
  object?: Record<string, unknown>;
}

export class Logger {
  private static format({ label, message }: ILog): string {
    return `[${label}] ${message}`;
  }

  private static write(method: "error" | "info" | "warn", log: ILog): void {
    const formattedLog = Logger.format(log);

    if (typeof log.object === "undefined") {
      console[method](formattedLog);

      return;
    }

    console[method](formattedLog, log.object);
  }

  public static info(log: ILog): void {
    Logger.write("info", log);
  }

  public static error(log: ILog): void {
    Logger.write("error", log);
  }

  public static warn(log: ILog): void {
    Logger.write("warn", log);
  }
}
