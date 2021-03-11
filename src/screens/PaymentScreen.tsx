import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { CommonTitleBar } from '../components/titlebars/CommonTitleBar';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { colorWhite } from '../styles';
import { PdaChargeListDto } from '../../apiclient/src/models';
import { sum } from '../utils/sumUtils';
import PaymentItem from '../components/PaymentItem';
import center from '../data';
import { MainStackParamList } from './routeParams';
import CircleCheckBox from '../components/CircleCheckBox';
import { getMobileReadingChargeWay } from '../utils/systemSettingsUtils';
import Modal from 'react-native-smart-modal';
import { Toast } from '@ant-design/react-native';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParamList, 'Payment'>>();

  const [paymentBills, setPaymentBills] = useState<PdaChargeListDto[]>();
  const [payWay, setPayWay] = useState<string>();
  const [ways, setWays] = useState<string[]>();
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>();
  const [cashRealValue, setCashRealValue] = useState<number>();

  useEffect(() => {
    center
      .getArrearageChargeList({ custId: route.params.custId })
      .then((items) => {
        setPaymentBills(items);
      });
  }, [route.params.custId]);

  useEffect(() => {
    getMobileReadingChargeWay().then((items) => {
      console.log('getMobileReadingChargeWay', items);
      setWays(items || []);
    });
  }, []);

  const onPayButtonClick = async () => {
    if (payWay === '1') {
      setPaymentVisible(true);
    } else if (payWay === '2') {
      const result = await center.getWechatQrCodeUrl(route.params.custCode);
      setQrCodeUrl(result);
      setPaymentVisible(true);
    } else if (payWay === '3') {
      const result = await center.getAlipayQrCodeUrl(route.params.custCode);
      setQrCodeUrl(result);
      setPaymentVisible(true);
    } else {
      Toast.fail('请先选择付费方式');
    }
  };

  const onCashConfirm = async () => {
    const key = Toast.loading('收款中');
    try {
      await center.getCashPaymentDetails({
        actualMoney: cashRealValue,
        chargeWay: '1',
        custCode: route.params.custCode,
      });
      setPaymentVisible(false);
    } catch (e) {
      Toast.fail(e.message);
    } finally {
      Toast.remove(key);
    }
  };

  const renderPayWay = (info: ListRenderItemInfo<string>) => {
    return (
      <TouchableOpacity
        style={styles.paywayRow}
        onPress={() => setPayWay(info.item)}>
        <View style={styles.paywayRowLeft}>
          <Image
            source={require('../assets/qietu/shoufei/charge_icon_cash_normal.png')}
            style={styles.paywayIcon}
          />
          <Text style={styles.paywayTitle}>现金</Text>
        </View>
        <CircleCheckBox
          checked={payWay === info.item}
          onClick={() => setPayWay(info.item)}
        />
      </TouchableOpacity>
    );
  };

  const renderCashContent = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          alignSelf: 'center',
          paddingTop: scaleSize(179),
          width: '100%',
          paddingHorizontal: scaleSize(41),
        }}>
        <Text style={{ color: '#333333', fontSize: scaleSize(28) }}>
          应缴金额
        </Text>
        <Text
          style={{
            color: '#666666',
            fontSize: scaleSize(28),
            marginTop: scaleSize(12),
            paddingVertical: scaleSize(4),
            paddingHorizontal: scaleSize(18),
            backgroundColor: '#EBEBEB',
            borderRadius: scaleSize(5),
            borderWidth: scaleSize(1),
            borderColor: '#B2B2B2',
          }}>
          48.00
        </Text>
        <Text
          style={{
            color: '#333333',
            fontSize: scaleSize(28),
            marginTop: scaleSize(24),
          }}>
          实收金额
        </Text>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: scaleSize(12),
            paddingVertical: scaleSize(4),
            paddingHorizontal: scaleSize(18),
            borderRadius: scaleSize(5),
            borderWidth: scaleSize(1),
            borderColor: '#B2B2B2',
          }}>
          <TextInput
            onChangeText={(text) => {
              if (text) {
                setCashRealValue(parseFloat(text));
              }
            }}
            value={cashRealValue ? cashRealValue.toString() : ''}
            style={{ color: '#EE2E1E', fontSize: scaleSize(28), padding: 0 }}
          />
          <Image style={{ width: scaleSize(20), height: scaleSize(20) }} />
        </View>

        <TouchableOpacity
          onPress={onCashConfirm}
          style={{
            backgroundColor: '#4888E3',
            marginTop: scaleSize(60),
            paddingHorizontal: scaleSize(134),
            paddingVertical: scaleSize(6),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: scaleSize(27),
          }}>
          <Text
            style={{
              fontSize: scaleSize(26),
              color: colorWhite,
            }}>
            确定
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQrcode = () => {
    return (
      <View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Image
          source={{ uri: qrCodeUrl }}
          style={{
            backgroundColor: '#CCCCCC',
            width: scaleSize(240),
            height: scaleSize(240),
            marginTop: scaleSize(179),
          }}
        />
        <Text
          style={{
            fontSize: scaleSize(34),
            color: '#333333',
            marginTop: scaleSize(24),
            fontWeight: 'bold',
          }}>
          支付宝支付码
        </Text>
      </View>
    );
  };

  const renderPaymentModal = () => {
    return (
      <Modal
        visible={paymentVisible}
        fullScreen
        horizontalLayout="right"
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ justifyContent: 'center', alignItems: 'center' }}
        onChange={setPaymentVisible}>
        <View
          style={{
            width: scaleSize(443),
            height: scaleSize(546),
            alignSelf: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <View style={styles.modalWrapper}>
            <Image
              style={{
                width: scaleSize(443),
                height: scaleSize(546),
              }}
              resizeMode="contain"
              source={require('../assets/qietu/shoufei/charge_picture_normal.png')}
            />
            {payWay === '1' ? renderCashContent() : renderQrcode()}
          </View>

          <TouchableOpacity onPress={() => setPaymentVisible(false)}>
            <Image
              style={{
                width: scaleSize(60),
                height: scaleSize(60),
                marginTop: scaleSize(40),
              }}
              source={require('../assets/qietu/shoufei/charge_icon_close_normal.png')}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <CommonTitleBar title="收费" onBack={() => navigation.goBack()} />

      <ScrollView>
        <View>
          <View style={styles.content}>
            <View style={styles.contentLeft}>
              <View style={styles.summary}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>文化花园1期</Text>
                  <Text style={styles.subTitle}>(029302221)</Text>
                </View>

                <View style={styles.numbers}>
                  <View style={styles.numberCol}>
                    <Text style={styles.numberLabel}>预存余额</Text>
                    <Text style={styles.numberValue}>0</Text>
                  </View>
                  <View style={styles.numberCol}>
                    <Text style={styles.numberLabel}>合计金额</Text>
                    <Text style={styles.numberValue}>
                      {sum(paymentBills?.map((it) => it.extendedAmount) || [])}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.contentRight} />
          </View>

          <View style={styles.items}>
            {paymentBills?.map((item) => (
              <PaymentItem key={item.feeId} data={item} />
            ))}
          </View>

          <View style={styles.total}>
            <Text style={styles.totalTitle}>应缴总金额</Text>
            <Text style={styles.totalValue}>¥48.00</Text>
          </View>

          <View style={styles.payways}>
            <FlatList<string>
              data={ways}
              renderItem={renderPayWay}
              keyExtractor={(i) => i}
              ItemSeparatorComponent={() => <View style={styles.paywayLine} />}
            />
          </View>

          <TouchableOpacity style={styles.payButton} onPress={onPayButtonClick}>
            <Text style={styles.payButtonText}>去收费</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderPaymentModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    padding: scaleSize(30),
    display: 'flex',
    flexDirection: 'row',
  },
  contentLeft: {
    flex: 1,
  },
  contentRight: {},
  summary: {
    backgroundColor: '#096BF3',
    borderRadius: scaleSize(8),
    padding: scaleSize(30),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: scaleSize(40),
    color: colorWhite,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: scaleSize(34),
    color: colorWhite,
    marginStart: scaleSize(8),
  },
  numbers: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: scaleSize(24),
  },
  numberCol: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  numberLabel: {
    fontSize: scaleSize(28),
    color: colorWhite,
  },
  numberValue: {
    fontSize: scaleSize(56),
    color: colorWhite,
    fontWeight: 'bold',
    marginTop: scaleSize(8),
  },
  card: {
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(21),
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
  },
  total: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colorWhite,
    borderRadius: scaleSize(8),
    marginHorizontal: scaleSize(30),
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(21),
    marginTop: scaleSize(18),
  },
  totalTitle: {
    fontSize: scaleSize(36),
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    color: '#F0655A',
    fontWeight: 'bold',
    fontSize: scaleSize(36),
  },
  payways: {
    marginTop: scaleSize(18),
    paddingHorizontal: scaleSize(34),
    paddingVertical: scaleSize(30),
    borderRadius: scaleSize(8),
    backgroundColor: colorWhite,
    marginHorizontal: scaleSize(30),
  },
  paywayRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paywayIcon: {
    width: scaleSize(50),
    height: scaleSize(50),
  },
  paywayLine: {
    height: scaleSize(1),
    backgroundColor: '#DEDEDE',
    marginVertical: scaleSize(18),
  },
  paywayRowLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paywayTitle: {
    fontSize: scaleSize(34),
    color: '#333333',
    marginStart: scaleSize(18),
  },
  payButton: {
    marginHorizontal: scaleSize(74),
    marginVertical: scaleSize(60),
    backgroundColor: '#5397F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(10),
    paddingVertical: scaleSize(19),
  },
  payButtonText: {
    fontSize: scaleSize(40),
    color: colorWhite,
  },
  modalWrapper: {},
});
