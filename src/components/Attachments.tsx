import * as React from 'react';
import {
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { MobileFileDto } from '../../apiclient/src/models';

interface Props {
  files: MobileFileDto[];
  onTakePhoto: () => void;
  onPhotoClick: (item: MobileFileDto) => void;
}

export default function Attachments({
  files,
  onTakePhoto,
  onPhotoClick,
}: Props) {
  const renderItem = (info: ListRenderItemInfo<MobileFileDto>) => {
    return (
      <>
        {info.index < files.length ? (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => onPhotoClick(info.item)}>
            <Image style={styles.image} source={{ uri: info.item.filePath }} />
            <Image
              style={styles.deleteIcon}
              source={require('../assets/qietu/chaobiaoluru/enter_icon_idelete_normal.png')}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.takeImageContainer}
            onPress={() => onTakePhoto()}>
            <Image
              style={styles.takeImage}
              source={require('../assets/qietu/chaobiaoluru/enter_icon_camera2_normal.png')}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderItems = () => {
    console.log(files);
    return (
      <FlatList<MobileFileDto>
        style={styles.items}
        data={[...files, { fileName: 'ADD' }]}
        numColumns={3}
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
        <Text style={styles.subTitle}>（共{files.length}个）</Text>
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
  image: {
    width: scaleSize(140),
    height: scaleSize(170),
    margin: scaleSize(10),
    borderRadius: scaleSize(4),
  },
  items: {
    marginHorizontal: scaleSize(20),
  },
  itemContainer: {},
  takeImageContainer: {
    width: scaleSize(140),
    height: scaleSize(170),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDECEC',
    borderRadius: scaleSize(4),
    margin: scaleSize(9),
  },
  deleteIcon: {
    position: 'absolute',
    width: scaleSize(29),
    height: scaleSize(27),
    right: 5,
    top: 5,
  },
  takeImage: {
    width: scaleSize(50),
    height: scaleSize(42),
  },
});
