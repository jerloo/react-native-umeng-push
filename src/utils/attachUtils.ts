import dayjs from 'dayjs';
import db from '../data/database';
import { AttachmentDbItem } from '../data/models';
import { getSession } from './sesstionUtils';
import CosXmlReactNative, { COS_BUCKET_NAME } from './uploadUtils';
import * as uuid from 'uuid';
import center from '../data';
import DeviceInfo from 'react-native-device-info';
import { MobileFileDto } from '../../apiclient/src/models';
import { l } from './logUtils';

export const tryUploadAttachments = async (
  custId: number,
  billMonth: number,
  readTimes: number,
  files: AttachmentDbItem[],
) => {
  try {
    await uploadAttachments(custId, billMonth, readTimes, files);
  } catch (e) {
    l.error('尝试上传图片失败', e);
  }
};

export const uploadAttachments = async (
  custId: number,
  billMonth: number,
  readTimes: number,
  files: AttachmentDbItem[],
) => {
  const session = await getSession();
  const username = session?.userInfo.userName;
  const dtYearMonth = dayjs().format('YYYYMM');
  const objectName =
    'mobilereadapp/' +
    `${session?.tenantName}/${dtYearMonth}/${username}` +
    `/${dayjs().format('YYYY-MM-DD')}-${uuid.v4().toString().replace('-', '')}`;
  const filesToUpload = files.filter(it => !it.uploaded);
  l.info('待上传附件列表', filesToUpload);
  const requests = filesToUpload.map(it => {
    const uploadRequest = {
      bucket: `${COS_BUCKET_NAME}-1259078701`,
      object: objectName + it.filePath?.substring(it.filePath.lastIndexOf('/')),
      // 文件本地 Uri 或者 路径
      fileUri: 'file://' + it.filePath,
    };
    return uploadRequest;
  });
  const rsp = requests.map(it => CosXmlReactNative.upload(it));
  const results = await Promise.all(rsp);
  results.forEach((value, index) => {
    filesToUpload[index].url = value.Location;
  });
  await center.uploadAttachments({
    deviceCode: DeviceInfo.getUniqueId(),
    readingFiles: [
      {
        custId,
        billMonth,
        readTimes,
        files: filesToUpload.map(it => {
          const item: MobileFileDto = {
            fileName: it.fileName,
            filePath:
              'mobilereadapp/' +
              it.url?.substring(it.url?.indexOf(session?.tenantName || '')),
            fileSize: it.fileSize,
            fileSource: it.fileSource,
            fileBucket: COS_BUCKET_NAME,
          };
          return item;
        }),
      },
    ],
  });
  await db.updateAttachmentsUploaded(custId, filesToUpload);
};

export const isVideo = (path?: string) => {
  return path?.endsWith('.mp4') || path?.endsWith('.mov');
};
