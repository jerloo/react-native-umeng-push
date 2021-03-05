import * as React from 'react';
import {
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { scaleSize } from 'react-native-responsive-design';
import { MobileFileDto } from '../../apiclient/src/models';

interface Props {
  files: MobileFileDto[];
}

export default function Attachments({ files }: Props) {
  const renderItem = (info: ListRenderItemInfo<MobileFileDto>) => {
    return <Image source={info.item.filePath} />;
  };

  const renderItems = () => {
    return (
      <FlatList<MobileFileDto>
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.filePath}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          style={styles.icon}
          source={require('../assets/qietu/chaobiaoluru/enter_icon_enclosure_normal.png')}
        />
        <Text style={styles.title}>附件</Text>
        <Text style={styles.subTitle}>（共{}个）</Text>
      </View>

      <Text style={styles.blockTitle}>图片</Text>

      {renderItems()}

      <Text style={styles.blockTitle}>视频</Text>

      {renderItems()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  top: {
    borderBottomColor: '#E1E8F4',
    borderBottomWidth: scaleSize(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: scaleSize(16),
    paddingTop: scaleSize(35),
  },
  icon: {
    width: scaleSize(37),
    height: scaleSize(39),
    marginStart: scaleSize(43),
    marginEnd: scaleSize(12),
  },
  title: {
    fontSize: scaleSize(38),
    color: '#333333',
  },
  subTitle: {
    fontSize: scaleSize(28),
    color: '#666666',
  },
  blockTitle: {
    fontSize: scaleSize(40),
    color: '#333333',
    marginTop: scaleSize(25),
    marginBottom: scaleSize(18),
    marginHorizontal: scaleSize(23),
  },
});
