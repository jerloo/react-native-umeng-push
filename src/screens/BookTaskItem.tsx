import * as React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { PdaReadDataDto } from '../../apiclient/src/models';

interface Props {
  item: PdaReadDataDto;
}

export default function BookDataItem(props: Props) {
  return (
    <View style={styles.container}>
      <Text>{props.item.bookSortIndex}</Text>
      <View style={styles.rightContainer}>
        <View style={styles.rightTop}>
          <Text style={styles.title}>{props.item.custName}</Text>
          <Text style={styles.subTitle}>{props.item.bookCode}</Text>
        </View>
        <View style={styles.rightBottom}>
          <Image style={styles.iconLocation} />
          <Text style={styles.description}>{props.item.custAddress}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortIndex: {
    backgroundColor: '#E7F2FF',
    color: '#669FEE',
    fontSize: scaleSize(56),
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightTop: {},
  title: {
    fontSize: scaleSize(34),
    color: '#333333',
  },
  subTitle: {
    fontSize: scaleSize(30),
    color: '#333333',
  },
  rightBottom: {},
  description: {
    fontSize: scaleSize(26),
    color: '#666666',
  },
  iconLocation: {
    width: scaleSize(26),
    height: scaleSize(33),
  },
});
