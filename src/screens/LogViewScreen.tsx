import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import { currentLogFilePath } from '../utils/logUtils';
import { scaleSize } from 'react-native-responsive-design';
import { Button, Toast } from '@ant-design/react-native';
import Clipboard from '@react-native-community/clipboard';

export default function LogViewScreen() {
  const [logContent, setLogContent] = React.useState('');

  React.useEffect(() => {
    RNFS.readFile(currentLogFilePath).then((r) => {
      setLogContent(r);
    });
  }, []);

  const renderItem = (info: ListRenderItemInfo<string>) => {
    return (
      <Text numberOfLines={1} style={{ overflow: 'scroll' }}>
        {info.item}
      </Text>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <FlatList<string>
          style={{ padding: scaleSize(30), flex: 1 }}
          data={logContent.split('\n')}
          keyExtractor={(it) => it}
          renderItem={renderItem}
        />
        <Button
          onPress={() => {
            Clipboard.setString(logContent);
            Toast.info('已复制到剪切板');
          }}>
          复制到剪切板
        </Button>
      </View>
    </SafeAreaView>
  );
}
