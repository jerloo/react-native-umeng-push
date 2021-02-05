import {
  logger,
  fileAsyncTransport,
  consoleTransport,
} from 'react-native-logs';
import RNFS from 'react-native-fs';

let today = new Date();
let month = today.getMonth() + 1;
let year = today.getFullYear();

export const currentLogFileName = `logs_${year}${month}.txt`;
export const currentLogFilePath =
  RNFS.DocumentDirectoryPath + '/' + currentLogFileName;
export const currentLogFileDir = RNFS.DocumentDirectoryPath;

const defaultConfig = {
  severity: 'debug',
  transport: (props: any) => {
    consoleTransport(props);
    fileAsyncTransport(props);
  },
  transportOptions: {
    FS: RNFS,
    fileLogName: currentLogFileName,
    fileName: currentLogFileName,
  },
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  async: true,
  printLevel: true,
  printDate: true,
  enabled: true,
};

export const l = logger.createLogger(defaultConfig);
