import * as React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scaleHeight, scaleSize } from 'react-native-responsive-design';
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
import {
  getReadStateSettings,
  getReadStateSettingsItems,
  ReadStateStorage,
} from '../utils/settingsUtils';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { MainStackParamList } from './routeParams';
import db from '../data/database';
import { Toast } from '@ant-design/react-native';
import center from '../data';

export default function NewReadScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'NewRead'>>();
  const navigation = useNavigation();

  const { data } = route.params;

  const [newData, setNewData] = useState<PdaReadDataDto>(data);
  const [attachmentsModalVisible, setAttachmentsModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState<MobileFileDto>();
  const [readStates, setReadStates] = React.useState<ReadStateStorage>();
  const [amount, setAmount] = useState(0);

  React.useEffect(() => {
    try {
      data.terminalFiles =
        (JSON.parse(data.terminalFiles as string) as MobileFileDto[]) || [];
      setNewData(data);
    } catch (e) {}

    console.log('列表传过来', data);
  }, [data]);

  React.useEffect(() => {
    getReadStateSettings().then((r) => {
      if (r) {
        setReadStates(r);
        db.getBookDataDetails(
          route.params.data.custId,
          route.params.data.billMonth,
          route.params.data.readTimes,
        ).then((details) => {
          if (details) {
            console.log('数据库获取', details);

            if (!details.readStateId) {
              getReadStateSettingsItems().then((items) => {
                const readState = items.find((it) => it.stateName === '正常');
                details.readStateId = readState?.id;
                setNewData(details);
              });
            } else {
              getReadStateSettingsItems().then((items) => {
                const readState = items.find(
                  (it) => it.id === details.readStateId,
                );
                details.readStateId = readState?.id;
                setNewData(details);
              });
            }
          }
        });
      }
    });
  }, [
    data.readStateId,
    route.params.data.billMonth,
    route.params.data.custId,
    route.params.data.readTimes,
  ]);

  const setValue = (value: string) => {
    setNewData({
      ...newData,
      reading: parseInt(value, 10) || undefined,
      readWater: newData.reading - newData.lastReading || undefined,
      readDate: new Date(),
    });
  };

  const saveData = async () => {
    await db.updateReadData([newData]);
    Toast.success('保存成功');
  };

  const openLighting = () => {};

  const addNewAttachment = (result: MobileFileDto) => {
    console.log(result);
    if (!newData.terminalFiles) {
      newData.terminalFiles = [result];
    } else if (newData.terminalFiles instanceof Array) {
      newData.terminalFiles.push(result);
    }
  };

  const onPhotoClick = (item: MobileFileDto) => {
    setCurrentPreviewFile(item);
    setPreviewModalVisible(true);
  };

  const onPhotoDeleteClick = (item: MobileFileDto) => {
    newData.terminalFiles = (newData.terminalFiles as MobileFileDto[]).filter(
      (it) => it.filePath !== item.filePath,
    );
    setNewData({ ...newData });
    setAttachmentsModalVisible(false);
  };

  const calcBudgetAmount = async () => {
    if (!newData.reading) {
      Toast.fail('请先抄表');
      return;
    }
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
  };

  const renderStateExtra = () => {
    return (
      <View style={styles.extra}>
        <View style={styles.extraRow}>
          <View style={styles.extraRowPart}>
            <Text style={styles.extraLabel}>上期抄码</Text>
            <Text style={[styles.extraValue, { color: '#333333' }]}>
              {newData.lastReading}
            </Text>
          </View>
          <View style={styles.extraRowPart}>
            <Text style={styles.extraLabel}>上次水量</Text>
            <Text style={[styles.extraValue, { color: '#333333' }]}>
              {newData.lastReadWater}
            </Text>
          </View>
        </View>
        <View style={styles.extraRow}>
          <View style={styles.extraRowPart}>
            <Text style={styles.extraLabel}>本期抄码</Text>
            <Text style={styles.extraValue}>{newData.reading || ''}</Text>
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
                  custId: newData.custId,
                  title: `${newData.bookCode}(${newData.custId})`,
                })
              }>
              <Text style={styles.tableValueButtonText}>往期</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.extraRow}>
          <View style={styles.extraRowPart}>
            <Text style={styles.extraLabel}>预算金额</Text>
            <Text style={styles.extraValue}>{amount}</Text>
          </View>

          <View style={[styles.extraRowPart, { justifyContent: 'flex-end' }]}>
            <TouchableOpacity
              style={styles.tableValueButton}
              onPress={calcBudgetAmount}>
              <Text style={styles.tableValueButtonText}>预算</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const recordState = (n: number) => {
    if (n === 0) {
      return '未抄';
    } else if (n === 1) {
      return '已抄';
    } else if (n === 2) {
      return '已复核';
    } else if (n === 3) {
      return '已开账';
    }
    return '';
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
            files={newData.terminalFiles}
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
            selectedStateId={newData.readStateId}
            onSelected={(item) => {
              setSettingsModalVisible(false);
              console.log('readStateId', item.id);
              setNewData({ ...newData, readStateId: item.id });
            }}
            onSaved={() => {
              setSettingsModalVisible(false);
              getReadStateSettings().then((r) => {
                if (r) {
                  setReadStates(r);
                }
              });
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
              custId: newData.custId,
              title: `${newData.bookCode}(${newData.custId})`,
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
                <Text style={styles.title}>{newData.bookCode}</Text>
                <Text style={styles.subTitle}>({newData.custId})</Text>
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
            <LocationButton />
            <Text style={styles.description}>{newData.custAddress}</Text>
          </View>
          <View style={styles.tags}>
            <Tag title="欠费" borderColor="#F5D28C" textColor="#EAAF38" />
            <Tag
              title={recordState(newData.recordState)}
              borderColor="#C2C2C2"
              textColor="#666666"
              style={{ marginStart: scaleSize(16) }}
            />
            <Tag
              title="换表"
              borderColor="#B6CEFB"
              textColor="#63A3FC"
              style={{ marginStart: scaleSize(16) }}
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

      <SafeAreaView style={styles.mainContainer}>
        <CommonTitleBarEx
          title="抄表录入"
          titleColor={colorWhite}
          onBack={() => navigation.goBack()}
          onRight2Click={() => setAttachmentsModalVisible(true)}
          backIcon={require('../assets/qietu/cebenxiangqing/book_details_icon_back_normal.png')}
          right2Icon={require('../assets/enter_icon_enclosure_normal_white.png')}
        />
        <View style={styles.main}>
          <ScrollView>{renderContent()}</ScrollView>

          <View style={styles.maskRow}>
            <View style={styles.maskLeft}>
              <Image
                style={styles.maskIcon}
                source={require('../assets/enter_icon_remarks_normal.png')}
              />
              <TextInput
                style={styles.remark}
                placeholder="点击添加备注(100字以内)"
                onChangeText={(text) =>
                  setNewData({ ...newData, readRemark: text })
                }
                value={newData.readRemark}
              />
              <TouchableOpacity
                style={styles.lightButton}
                onPress={openLighting}>
                <Image
                  style={styles.maskIcon}
                  source={require('../assets/shoudiantong.png')}
                />
              </TouchableOpacity>
            </View>
          </View>

          {newData.recordState === 0 || newData.recordState === 1 ? (
            <KeyBoard
              onBackClick={() => {
                if (
                  newData.reading &&
                  newData.reading.toString().length !== 0
                ) {
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
              onNextClick={() => {}}
              onPreClick={() => {}}
              onSettingsOpen={() => setSettingsModalVisible(true)}
              readStates={readStates}
              selectStateId={newData.readStateId}
              onStateSelect={(item) => {
                setNewData({ ...newData, readStateId: item.id });
              }}
            />
          ) : null}
        </View>
      </SafeAreaView>
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
  },
  extraRowPart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
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
});
