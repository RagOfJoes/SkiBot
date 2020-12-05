import moment from "moment";

export class Logger {
  private readonly DATE_FORMAT_TITLE: string = "MM-DD-YYYY";
  private readonly DATE_FORMAT_MESSAGE: string = "MM-DD-YYYY(hh:mm A)";

  private static _instance: Logger;
  private logs: Array<string> = [];
  private lastDateLog: moment.Moment | undefined;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }

    return Logger._instance;
  }

  info(message: string) {
    const timestamp = moment();
    const timestampString = timestamp.format(this.DATE_FORMAT_MESSAGE);

    let formattedMessage = `${timestampString} [INFO]: ${message}`;

    if (!timestamp.isSame(this.lastDateLog, "day")) {
      this.lastDateLog = timestamp;

      const timestampTitle = timestamp.format(this.DATE_FORMAT_TITLE);
      formattedMessage = `${timestampTitle}\n\n${formattedMessage}`;
    }
    this.logs.push(formattedMessage);
    console.log(formattedMessage);
  }

  error(message: string) {
    const timestamp = moment();
    const timestampString = timestamp.format(this.DATE_FORMAT_MESSAGE);
    this.lastDateLog = timestamp;

    let formattedMessage = `${timestampString} [ERROR]: ${message}`;

    if (!timestamp.isSame(this.lastDateLog, "day")) {
      this.lastDateLog = timestamp;

      const timestampTitle = timestamp.format(this.DATE_FORMAT_TITLE);
      formattedMessage = `${timestampTitle}\n\n${formattedMessage}`;
    }
    this.logs.push(formattedMessage);
    console.log(formattedMessage);
  }

  getLogs() {
    return this.logs;
  }
}
