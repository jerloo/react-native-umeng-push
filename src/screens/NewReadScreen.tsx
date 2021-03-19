import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  scaleHeight as defaultScaleHeight,
  scaleSize,
} from 'react-native-responsive-design';
import { MobileFileDto, PdaReadDataDto } from '../../apiclient/src/models';
import { colorWhite } from '../styles';
import Tag from '../components/Tag';
import KeyBoard from '../components/KeyBoard';
import dayjs from 'dayjs';
import LocationButton from '../components/LocationButton';
import Attachments from '../components/Attachments';
import Modal from 'react-native-smart-modal';
import CommonTitleBarEx from '../components/titlebars/CommonTitleBarEx';
import NewReadSettings from '../components/NewReadSettings';
import { getReadStateSettings, ReadStateStorage } from '../utils/statesUtils';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import { MainStackParamList } from './routeParams';
import db from '../data/database';
import { Badge, Toast } from '@ant-design/react-native';
import center from '../data';
import { isMobileReadingCanCharge } from '../utils/systemSettingsUtils';
import {
  calcReadWater,
  judgeReadWater,
  WATER_HIGHER,
  WATER_LOWER,
} from '../utils/waterUtils';
import { Modal as AntModal } from '@ant-design/react-native';
import { meterState, recordState } from '../utils/stateConverter';
import Video from 'react-native-video';
import { AttachmentDbItem } from '../data/models';
import { tryUploadAttachments } from '../utils/attachUtils';

let scaleHeight = defaultScaleHeight;
scaleHeight = scaleSize;

export default function NewReadScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'NewRead'>>();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const player = React.useRef<Video>(null);

  const { data } = route.params;

  const [newData, setNewData] = useState<PdaReadDataDto>(data);
  const [attachmentsModalVisible, setAttachmentsModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState<MobileFileDto>();
  const [readStates, setReadStates] = React.useState<ReadStateStorage>();
  const [amount, setAmount] = useState(0);
  const [canCharge, setCanCharge] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentDbItem[]>([]);
  const [bookDataItems, setBookDataItems] = useState<PdaReadDataDto[]>([]);

  useEffect(() => {
    const fetchLocal = async () => {
      try {
        const { bookId } = data;
        const res = await center.offline.getBookDataByIds([bookId]);
        setBookDataItems(res);
      } catch (e) {
        Toast.fail(e.message);
      }
    };

    fetchLocal();
  }, [data]);

  useEffect(() => {
    db.getAttachments(data.custId, data.readTimes, data.billMonth).then((r) => {
      console.log('获取附件', r);
      setAttachments(r);
    });
  }, [data.billMonth, data.custId, data.readTimes]);

  useEffect(() => {
    isMobileReadingCanCharge().then((flag) => setCanCharge(flag));
  }, []);

  useEffect(() => {
    getReadStateSettings().then((r) => {
      if (r) {
        setReadStates(r);
        db.getBookDataDetails(data.custId, data.billMonth, data.readTimes).then(
          (details) => {
            if (details) {
              if (!details.readStateId) {
                const readState = r.items.find((it) => it.stateName === '正常');
                details.readStateId = readState?.id;
                setNewData(details);
              }
            }
          },
        );
      }
    });
  }, [data.readStateId, data.billMonth, data.custId, data.readTimes]);

  const setValue = (value: string) => {
    const valueData = { ...newData, reading: parseInt(value, 10) || undefined };
    setNewData({
      ...valueData,
      // readWater:
      //   value && value !== '' ? calcReadWater(valueData, readStateItems) : '',
      readDate: new Date(),
    });
    setAmount(0);
  };

  const preItem = async () => {
    if (newData.recordState !== 0) {
      const passed = await checkData();
      if (!passed) {
        return;
      }
    }
    const result = bookDataItems.filter(
      (it) => it.bookSortIndex < newData.bookSortIndex,
    );
    if (result.length > 0) {
      const readState = readStates?.items.find((it) => it.stateName === '正常');
      const r = result[result.length - 1];
      r.readStateId = readState?.id;
      setNewData(r);
    } else {
      Toast.info('当前已经是第一条数据');
    }
  };

  const nextItem = async (notSkip: boolean = true) => {
    if (notSkip) {
      const passed = await checkData();
      if (!passed) {
        return;
      }
    }
    const result = bookDataItems.filter(
      (it) => it.bookSortIndex > newData.bookSortIndex,
    );
    if (result.length > 0) {
      const readState = readStates?.items.find((it) => it.stateName === '正常');
      const r = result[0];
      r.readStateId = readState?.id;
      setNewData(r);
    } else {
      Toast.info('当前已经是最后一条数据');
    }
  };

  const checkData = async () => {
    return new Promise<boolean>(async (resolve, _reject) => {
      const water = calcReadWater(newData, readStates?.items || []);
      const result = judgeReadWater(water, newData, readStates?.items || []);
      console.log('nextItem', water, result);
      if (!result) {
        if (newData.recordState === 0) {
          newData.recordState = 1;
          newData.readWater = water;
          await db.updateReadData([newData]);
          await db.updateReadingNumberByBookId(newData.bookId);
          Toast.success('保存成功');
        }
        resolve(true);
      } else {
        if (result === WATER_HIGHER || result === WATER_LOWER) {
          AntModal.alert('重新选择', result, [
            {
              text: '否',
              onPress: async () => {
                newData.readWater = water;
                await db.updateReadData([newData]);
                await db.updateReadingNumberByBookId(newData.bookId);
                resolve(true);
              },
            },
            {
              text: '是',
              onPress: () => resolve(false),
            },
          ]);
        } else {
          AntModal.alert('提示', result, [
            {
              text: '确定',
              onPress: () => resolve(false),
            },
          ]);
        }
      }
    });
  };

  const saveData = async () => {
    console.log('saveData');
    if (!newData.reading) {
      Toast.fail('请先抄表');
      return;
    } else if (newData.reading > newData.rangeValue) {
      Toast.fail('本次抄码不能大于水表的量程');
      return;
    } else if (!newData.readStateId) {
      Toast.fail('请选择抄表状态');
      return;
    } else {
      const water = calcReadWater(newData, readStates?.items || []);
      const result = judgeReadWater(water, newData, readStates?.items || []);
      newData.recordState = 1;
      if (!result) {
        newData.readWater = water;
        newData.lastReadDate = new Date();
        newData.readDate = new Date();
        await db.updateReadData([newData]);
        await db.updateReadingNumberByBookId(newData.bookId);
        setNewData({ ...newData });
        Toast.success('保存成功');
        tryUploadAttachments(
          newData.custId,
          newData.billMonth,
          newData.readTimes,
          attachments,
        );
      } else {
        if (result === WATER_HIGHER || result === WATER_LOWER) {
          AntModal.alert('重新选择', result, [
            {
              text: '否',
              onPress: async () => {
                newData.readWater = water;
                newData.lastReadDate = new Date();
                newData.readDate = new Date();
                await db.updateReadData([newData]);
                await db.updateReadingNumberByBookId(newData.bookId);
                setNewData({ ...newData });
                tryUploadAttachments(
                  newData.custId,
                  newData.billMonth,
                  newData.readTimes,
                  attachments,
                );
              },
            },
            {
              text: '是',
              onPress: () => console.log('cancel'),
            },
          ]);
        } else {
          AntModal.alert('提示', result, [
            {
              text: '确定',
            },
          ]);
        }
      }
    }
  };

  const switchLighting = () => {};

  const addNewAttachment = async (result: AttachmentDbItem) => {
    result.bookId = newData.bookId;
    result.custId = newData.custId;
    result.readTimes = newData.readTimes;
    result.billMonth = newData.billMonth;
    await db.saveAttachments([result]);
    if (!attachments) {
      setAttachments([result]);
    } else if (attachments instanceof Array) {
      setAttachments([...attachments, result]);
    }
  };

  const onPhotoClick = (item: AttachmentDbItem) => {
    setCurrentPreviewFile(item);
    setPreviewModalVisible(true);
  };

  const onPhotoDeleteClick = async (item: AttachmentDbItem) => {
    await db.deleteAttachments(
      newData.custId,
      newData.readTimes,
      newData.billMonth,
    );
    const newAtts = attachments.filter((it) => it.filePath !== item.filePath);
    setAttachments(newAtts);
    setAttachmentsModalVisible(false);
  };

  const calcBudgetAmount = async () => {
    if (!newData.reading || !newData.readWater) {
      Toast.fail('请先抄表');
      return;
    }
    if (amount === 0) {
      const key = Toast.loading('计算中');
      try {
        const result = await center.calcBudgetAmount({
          custId: newData.custId,
          readDate: newData.readDate,
          readStateId: newData.readStateId,
          readWater: newData.readWater,
          reading: newData.reading,
        });
        setAmount(result);
      } catch (e) {
        Toast.fail(e.message);
      } finally {
        Toast.remove(key);
      }
    } else {
      navigation.navigate('Payment', {
        custId: newData.custId,
        custCode: newData.custCode || '',
      });
    }
  };

  const renderStateExtra = () => {
    return (
      <View style={styles.extra}>
        <View style={styles.extraRow}>
          <View style={styles.extraRowPart}>
            <Text style={styles.extraLabel}>上期抄码</Text>
            <Text style={[styles.extraValue, { color: '#333333' }]}>
              {newData.lastReading || 0}
            </Text>
          </View>
          <View style={styles.extraRowPart}>
            <Text style={styles.extraLabel}>上次水量</Text>
            <Text style={[styles.extraValue, { color: '#333333' }]}>
              {newData.lastReadWater || 0}
            </Text>
          </View>
        </View>
        <View style={[styles.extraRow]}>
          <View style={styles.extraRowPart}>
            <Text style={styles.extraLabel}>本期抄码</Text>
            <TextInput
              showSoftInputOnFocus={false}
              style={[
                styles.extraValue,
                {
                  flex: 1,
                  padding: 0,
                  margin: 0,
                },
              ]}
              defaultValue={(newData.reading || '').toString()}
              value={(newData.reading || '').toString()}
              autoFocus={true}
            />
          </View>

          <View style={styles.extraRowPart}>
            <Text style={styles.extraLabel}>本次水量</Text>
            <Text style={styles.extraValue}>{newData.readWater || ''}</Text>
          </View>
        </View>
        <View style={styles.extraRow}>
          <View style={styles.extraRowPart}>
            <Text style={styles.extraLabel}>上次抄表</Text>
            <Text style={[styles.extraValue, { color: '#666666' }]}>
              {dayjs(newData.lastReadDate).format('YYYY-MM-DD')}
            </Text>
          </View>

          <View style={[styles.extraRowPart, { justifyContent: 'flex-end' }]}>
            <TouchableOpacity
              style={styles.tableValueButton}
              onPress={() =>
                navigation.navigate('CustDetails', {
                  data: newData,
                })
              }>
              <Text style={styles.tableValueButtonText}>往期</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.extraRow}>
          <View style={styles.extraRowPart}>
            <Text style={styles.extraLabel}>预算金额</Text>
            <Text style={styles.extraValue}>{amount === 0 ? '' : amount}</Text>
          </View>

          <View style={[styles.extraRowPart, { justifyContent: 'flex-end' }]}>
            <TouchableOpacity
              style={styles.tableValueButton}
              onPress={calcBudgetAmount}>
              <Text style={styles.tableValueButtonText}>
                {amount === 0 ? '预算' : canCharge ? '收费' : '预算'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderPreviewModal = () => {
    return (
      <Modal
        visible={previewModalVisible && !!currentPreviewFile?.filePath}
        fullScreen
        horizontalLayout="right"
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ justifyContent: 'center', alignItems: 'center' }}
        onChange={setPreviewModalVisible}>
        {currentPreviewFile?.filePath?.endsWith('.mp4') ? (
          <Video
            source={{ uri: currentPreviewFile?.filePath }} // Can be a URL or a local file.
            ref={player} // Store reference
            // onBuffer={this.onBuffer} // Callback when remote video is buffering
            // onError={this.videoError} // Callback when video cannot be loaded
            style={{
              width: '100%',
              minHeight: 300,
              backgroundColor: 'black',
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
        ) : (
          <Image
            style={{
              width: '100%',
              minHeight: 300,
              backgroundColor: 'black',
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={{ uri: currentPreviewFile?.filePath }}
          />
        )}
      </Modal>
    );
  };

  const renderAttachmentsModal = () => {
    return (
      <Modal
        visible={attachmentsModalVisible}
        fullScreen
        horizontalLayout="right"
        animationIn="slideInRight"
        animationOut="slideOutRight"
        onChange={setAttachmentsModalVisible}>
        <View
          style={{
            width: scaleSize(509),
            backgroundColor: colorWhite,
            height: '100%',
            paddingTop: StatusBar.currentHeight,
          }}>
          <Attachments
            onPhotoClick={onPhotoClick}
            onPhotoDeleteClick={onPhotoDeleteClick}
            onTakePhoto={() => {
              setAttachmentsModalVisible(false);
              navigation.navigate('Camera', {
                callback: addNewAttachment,
              });
            }}
            files={attachments}
          />
        </View>
      </Modal>
    );
  };

  const renderSettingsModal = () => {
    return (
      <Modal
        visible={settingsModalVisible}
        fullScreen
        horizontalLayout="right"
        animationIn="slideInRight"
        animationOut="slideOutRight"
        onChange={setSettingsModalVisible}>
        <View style={styles.settingsModalContent}>
          <NewReadSettings
            readStates={readStates}
            selectedStateId={newData.readStateId}
            onSelected={(item) => {
              setSettingsModalVisible(false);
              console.log('readStateId', item.id);
              setNewData({ ...newData, readStateId: item.id });
            }}
            onSaved={(r) => {
              setSettingsModalVisible(false);
              setReadStates(r);
            }}
          />
        </View>
      </Modal>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.cornerContainer}
          onPress={() =>
            navigation.navigate('CustDetails', {
              data: newData,
            })
          }>
          <Text style={styles.corner}>用户详情</Text>
          <View style={styles.colorBlank} />
        </TouchableOpacity>
        <View style={styles.contentWrapper}>
          <View style={styles.contentTop}>
            <View style={styles.sortIndex}>
              <Text style={styles.sortIndexText}>{newData.bookSortIndex}</Text>
            </View>

            <View style={styles.contentTopBottom}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{newData.custName}</Text>
                <Text style={styles.subTitle}>({newData.custCode})</Text>
              </View>
              <View style={styles.contentTopDesc}>
                <Text style={styles.contentTopDescLabel}>水表信息：</Text>
                <Text style={styles.contentTopDescValue}>
                  {newData.steelMark}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.rightBottom}>
            <LocationButton address={newData.custAddress} />
            <Text style={styles.description}>{newData.custAddress}</Text>
          </View>
          <View style={styles.tags}>
            {newData.oweNumber > 0 ? (
              <Tag
                title="欠费"
                borderColor="#F5D28C"
                textColor="#EAAF38"
                style={{ marginEnd: scaleSize(16) }}
              />
            ) : null}
            <Tag
              title={recordState(newData.recordState)}
              borderColor="#C2C2C2"
              textColor="#666666"
              style={{ marginEnd: scaleSize(16) }}
            />
            <Tag
              title={meterState(newData.meterState)}
              borderColor="#B6CEFB"
              textColor="#63A3FC"
              style={{ marginEnd: scaleSize(16) }}
            />
          </View>
          {renderStateExtra()}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <View style={styles.mainContainer}>
        <SafeAreaView edges={['top']}>
          <CommonTitleBarEx
            title="抄表录入"
            titleColor={colorWhite}
            onBack={() => navigation.goBack()}
            onRight2Click={() => setAttachmentsModalVisible(true)}
            backIcon={require('../assets/qietu/cebenxiangqing/book_details_icon_back_normal.png')}
            // right2Icon={require('../assets/enter_icon_enclosure_normal_white.png')}
            right2IconView={() => (
              <TouchableOpacity
                onPress={() => setAttachmentsModalVisible(true)}>
                <Badge text={attachments.length}>
                  <View
                    style={{
                      width: scaleSize(50),
                      height: scaleSize(32),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={styles.titleBarBackButton}
                      source={require('../assets/enter_icon_enclosure_normal_white.png')}
                    />
                  </View>
                </Badge>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>

        <View style={styles.main}>
          <ScrollView>{renderContent()}</ScrollView>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.maskRow}>
              <View style={styles.maskLeft}>
                <Image
                  style={styles.maskIcon}
                  source={require('../assets/enter_icon_remarks_normal.png')}
                />
                <TextInput
                  style={styles.remark}
                  placeholder="点击添加备注(100字以内)"
                  placeholderTextColor="#999999"
                  onChangeText={(text) =>
                    setNewData({ ...newData, readRemark: text })
                  }
                  value={newData.readRemark}
                />
                <TouchableOpacity
                  style={styles.lightButton}
                  onPress={switchLighting}>
                  <Image
                    style={styles.maskIcon}
                    source={require('../assets/shoudiantong.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>

          <KeyBoard
            onBackClick={() => {
              if (newData.reading && newData.reading.toString().length !== 0) {
                setValue(
                  newData.reading
                    .toString()
                    .substring(0, newData.reading.toString().length - 1),
                );
              }
            }}
            onNumberClick={(n) => {
              setValue(`${newData.reading || ''}${n}`);
            }}
            onPhotoClick={() =>
              navigation.navigate('Camera', {
                callback: addNewAttachment,
              })
            }
            onConfirmClick={saveData}
            onNextClick={() => nextItem(true)}
            onPreClick={preItem}
            onSettingsOpen={() => setSettingsModalVisible(true)}
            readStates={readStates}
            selectStateId={newData.readStateId}
            onStateSelect={(item) => {
              console.log('onStateSelect', item);
              const valueData = {
                ...newData,
                readStateId: item.id,
                readDate: new Date(),
              };
              setNewData({
                ...valueData,
                readWater: calcReadWater(valueData, readStates?.items || []),
              });
            }}
          />
        </View>
      </View>
      {renderAttachmentsModal()}
      {renderSettingsModal()}
      {renderPreviewModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#3273E4',
  },
  topContainer: {
    paddingBottom: scaleSize(30),
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  main: {
    flex: 1,
    backgroundColor: '#3273E4',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    backgroundColor: colorWhite,
    marginHorizontal: scaleSize(30),
    marginTop: scaleHeight(12),
    display: 'flex',
    flexDirection: 'column',
    borderRadius: scaleSize(8),
    overflow: 'hidden',
  },
  title: {
    color: '#333333',
    fontSize: scaleSize(34),
    fontWeight: 'bold',
  },
  subTitle: {
    color: '#333333',
    fontSize: scaleSize(30),
    marginStart: scaleSize(17),
  },
  cornerContainer: {
    // backgroundColor: '#7AAFFD',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  colorBlank: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    backgroundColor: colorWhite,
    borderLeftWidth: scaleSize(0),
    borderBottomWidth: scaleSize(50),
    borderBottomColor: 'transparent',
    borderTopWidth: 0,
    borderTopColor: '#7AAFFD',
    borderRightColor: '#7AAFFD',
    borderRightWidth: scaleSize(40),
  },
  corner: {
    height: scaleSize(50),
    fontSize: scaleSize(24),
    color: colorWhite,
    backgroundColor: '#7AAFFD',
    paddingVertical: scaleHeight(8),
    paddingHorizontal: scaleSize(18),
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: scaleSize(30),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableLeft: {},
  rightBottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: scaleHeight(10),
  },
  description: {
    fontSize: scaleSize(26),
    color: '#666666',
    marginStart: scaleSize(15),
  },
  iconLocation: {
    width: scaleSize(26),
    height: scaleSize(33),
    marginTop: scaleHeight(5),
  },
  tags: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scaleHeight(24),
  },
  table: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableRight: {
    flex: 1,
  },
  tableLabel: {
    color: '#666666',
    fontSize: scaleSize(28),
    marginTop: scaleHeight(24),
    marginBottom: scaleHeight(6),
  },
  tableValue: {
    color: '#333333',
    fontSize: scaleSize(28),
    marginStart: scaleSize(30),
    marginTop: scaleHeight(24),
    marginBottom: scaleHeight(6),
  },
  tableValueRow: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableValueButton: {
    // marginTop: scaleSize(24),
    // marginBottom: scaleSize(6),
    alignSelf: 'flex-end',
  },
  tableValueButtonText: {
    fontSize: scaleSize(26),
    color: '#0680FD',
  },
  maskRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scaleHeight(17),
    paddingHorizontal: scaleSize(30),
    backgroundColor: '#F5F5F4',
  },
  maskLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  maskIcon: {
    width: scaleSize(35),
    height: scaleSize(40),
  },
  maskTitle: {
    fontSize: scaleSize(28),
    color: '#333333',
    marginStart: scaleSize(14),
  },
  maskContent: {
    fontSize: scaleSize(26),
    color: '#666666',
  },
  maskValue: {
    fontSize: scaleSize(40),
    color: '#333333',
    fontWeight: 'bold',
  },
  extra: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: scaleSize(0),
    padding: scaleSize(30),
    backgroundColor: '#F9F9F9',
    marginBottom: scaleSize(41),
  },
  extraRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scaleHeight(24),
    alignItems: 'center',
  },
  extraRowPart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  extraLabel: {
    color: '#666666',
    fontSize: scaleSize(28),
  },
  extraValue: {
    color: '#066DF1',
    fontSize: scaleSize(28),
    marginStart: scaleSize(12),
  },
  contentTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortIndex: {
    backgroundColor: '#F5F6FA',
    width: scaleSize(90),
    height: scaleSize(90),
    borderRadius: scaleSize(45),
    marginEnd: scaleSize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortIndexText: {
    fontSize: scaleSize(40),
    color: '#5384F9',
    fontWeight: 'bold',
  },
  contentTopBottom: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentTopDesc: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: scaleHeight(10),
  },
  contentTopDescLabel: {
    fontSize: scaleSize(24),
    color: '#999999',
  },
  contentTopDescValue: {
    fontSize: scaleSize(24),
    color: '#999999',
    fontWeight: 'bold',
  },
  remark: {
    backgroundColor: colorWhite,
    marginStart: scaleSize(16),
    height: scaleSize(60),
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleSize(18),
    flex: 1,
  },
  lightButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingStart: scaleSize(30),
  },
  settingsModalContent: {
    width: scaleSize(509),
    backgroundColor: colorWhite,
    height: '100%',
    paddingTop: StatusBar.currentHeight,
  },
  titleBarBackButton: {
    width: scaleSize(32),
    height: scaleSize(32),
    // alignSelf: 'flex-start',
  },
});
