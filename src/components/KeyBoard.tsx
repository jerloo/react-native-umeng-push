import * as React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { colorWhite } from '../styles';

interface Props {
  onNumberClick: (value: number) => void;
  onNextClick: () => void;
  onPreClick: () => void;
  onConfirmClick: () => void;
  onPhotoClick: () => void;
  onBackClick: () => void;
}

export default function KeyBoard(props: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.cell}
          onPress={() => props.onNumberClick(7)}>
          <Text style={styles.number}>7</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cell}
          onPress={() => props.onNumberClick(8)}>
          <Text style={styles.number}>8</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cell}
          onPress={() => props.onNumberClick(9)}>
          <Text style={styles.number}>9</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cell, { backgroundColor: '#D0D1D3' }]}
          onPress={props.onPhotoClick}>
          <Image
            style={styles.photo}
            source={require('../assets/qietu/chaobiaoluru/enter_icon_camera_normal.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.cell}
          onPress={() => props.onNumberClick(5)}>
          <Text style={styles.number}>5</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cell}
          onPress={() => props.onNumberClick(6)}>
          <Text style={styles.number}>6</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cell}
          onPress={() => props.onNumberClick(7)}>
          <Text style={styles.number}>7</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.cell, { backgroundColor: '#D0D1D3' }]}>
          <Text style={styles.pre}>上一户</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.cell}
          onPress={() => props.onNumberClick(1)}>
          <Text style={styles.number}>1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cell}
          onPress={() => props.onNumberClick(2)}>
          <Text style={styles.number}>2</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cell}
          onPress={() => props.onNumberClick(3)}>
          <Text style={styles.number}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cell, { backgroundColor: '#EAEBEE' }]}>
          <Text style={styles.next}>下一户</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.cell, { backgroundColor: '#D0D1D3' }]}>
          <Text style={styles.number}>打印</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cell}
          onPress={() => props.onNumberClick(0)}>
          <Text style={styles.number}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cell} onPress={props.onBackClick}>
          <Image
            style={styles.photo}
            resizeMode="contain"
            source={require('../assets/qietu/chaobiaoluru/enter_icon_back_normal.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cell, styles.confirm]}
          onPress={props.onConfirmClick}>
          <Text style={styles.confirmText}>确定</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6E6E6',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleSize(6),
  },
  cell: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    height: scaleSize(104),
    flex: 1,
    borderRadius: scaleSize(10),
    marginVertical: scaleSize(6),
    marginHorizontal: scaleSize(9),
  },
  number: {
    fontSize: scaleSize(40),
    color: '#666666',
    flex: 1,
    textAlign: 'center',
  },
  photo: {
    width: scaleSize(65),
    height: scaleSize(56),
  },
  confirm: {
    backgroundColor: '#4B90F2',
  },
  confirmText: {
    color: colorWhite,
    fontSize: scaleSize(34),
  },
  pre: {
    color: '#333333',
    fontSize: scaleSize(34),
  },
  next: {
    color: '#1876FF',
    fontSize: scaleSize(34),
  },
  print: {
    color: '#1876FF',
    fontSize: scaleSize(34),
  },
  vd: {
    width: scaleSize(6),
  },
});
