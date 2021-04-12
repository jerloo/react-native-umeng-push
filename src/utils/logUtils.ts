import {
  logger,
  fileAsyncTransport,
  consoleTransport,
} from 'react-native-logs';
import RNFS from 'react-native-fs';
import dayjs from 'dayjs';
import { getSession } from './sesstionUtils';
import * as uuid from 'uuid';

// /handa/202101/zhangsa/2021-02-05-{uuid}.log.txt
export const currentLogFileName = `${dayjs().format('YYYY-MM-DD')}.log.txt`;
export const currentLogFileDir = RNFS.CachesDirectoryPath;
export const currentLogFilePath = currentLogFileDir + '/' + currentLogFileName;

export const getObjectKey = async () => {
  const session = await getSession();
  const username = session?.userInfo.userName;
  const dtYearMonth = dayjs().format('YYYYMM');
  // /handa/202101/zhangsa/2021-02-05-{uuid}.log.txt
  return `mobilereadapp/${
    session?.tenantName
  }/${dtYearMonth}/${username}/${dayjs().format(
    'YYYY-MM-DD',
  )}-${uuid.v4().toString().replace('-', '')}.log.txt`;
};

// RNFS.exists(currentLogFileDir).then((value) => {
//   if (!value) {
//     RNFS.mkdir(currentLogFileDir);
//   }
// });

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
    filePath: currentLogFileDir,
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
