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
import Video from 'react-native-video';
import { AttachmentDbItem } from '../data/models';
import { isVideo } from '../utils/attachUtils';

interface Props {
  files: AttachmentDbItem[];
  onTakePhoto: () => void;
  onTakeVideo: () => void;
  onPhotoClick: (item: AttachmentDbItem) => void;
  onPhotoDeleteClick: (item: AttachmentDbItem) => void;
}

export default function Attachments({
  files,
  onTakePhoto,
  onTakeVideo,
  onPhotoClick,
  onPhotoDeleteClick,
}: Props) {
  const renderPhotoItem = (
    info: ListRenderItemInfo<AttachmentDbItem>,
    items: AttachmentDbItem[],
  ) => {
    return (
      <>
        {info.index < items.length ? (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => onPhotoClick(info.item)}>
              <Image
                style={styles.image}
                source={{ uri: info.item.filePath }}
              />
            </TouchableOpacity>
            {!info.item.uploaded ? (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onPhotoDeleteClick(info.item)}>
                <Image
                  style={styles.deleteIcon}
                  source={require('../assets/qietu/chaobiaoluru/enter_icon_idelete_normal.png')}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
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

  const renderVideoItem = (
    info: ListRenderItemInfo<AttachmentDbItem>,
    items: AttachmentDbItem[],
  ) => {
    return (
      <>
        {info.index < items.length ? (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => onPhotoClick(info.item)}>
              <Video
                style={styles.image}
                source={{ uri: info.item.filePath }}
              />
            </TouchableOpacity>
            {!info.item.uploaded ? (
              <TouchableOpacity
                onPress={() => onPhotoDeleteClick(info.item)}
                style={styles.deleteButton}>
                <Image
                  style={styles.deleteIcon}
                  source={require('../assets/qietu/chaobiaoluru/enter_icon_idelete_normal.png')}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.takeImageContainer}
            onPress={() => onTakeVideo()}>
            <Image
              style={styles.takeImage}
              source={require('../assets/qietu/chaobiaoluru/enter_icon_camera2_normal.png')}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderPhotosItems = () => {
    const items = files.filter(it => !(it.filePath || isVideo('' as string)));
    return (
      <FlatList<AttachmentDbItem>
        style={styles.items}
        data={[...items, { fileName: 'ADD' }]}
        numColumns={3}
        renderItem={item => renderPhotoItem(item, items)}
        keyExtractor={item =>
          item.filePath || `${item.custId}${item.readTimes}${item.billMonth}`
        }
      />
    );
  };

  const renderVideosItems = () => {
    const items = files.filter(it => it.filePath || isVideo('' as string));
    return (
      <FlatList<AttachmentDbItem>
        style={styles.items}
        data={[...items, { fileName: 'ADD' }]}
        numColumns={3}
        renderItem={item => renderVideoItem(item, items)}
        keyExtractor={item =>
          item.filePath || `${item.custId}${item.readTimes}${item.billMonth}`
        }
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

      {renderPhotosItems()}

      <Text style={styles.blockTitle}>视频</Text>

      {renderVideosItems()}
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
  deleteButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    paddingBottom: scaleSize(10),
    paddingStart: scaleSize(30),
  },
  deleteIcon: {
    width: scaleSize(40),
    height: scaleSize(35),
  },
  takeImage: {
    width: scaleSize(50),
    height: scaleSize(42),
  },
});
