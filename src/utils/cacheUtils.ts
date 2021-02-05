import RNFS from 'react-native-fs';
import { currentLogFileDir } from './logUtils';

export const clearCache = async () => {
  const paths = await RNFS.readDir(currentLogFileDir);
  console.log('paths', paths);
  const ps = paths.map((filepath) => {
    return RNFS.unlink(filepath.path);
  });
  console.log('ps', ps);
  await Promise.all(ps.filter((value) => value !== null));
};
