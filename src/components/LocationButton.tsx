import { Modal, Toast } from '@ant-design/react-native';
import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { openMap, queryInstalledMaps } from '../utils/mapUtils';

interface Props {
  address?: string;
  containerStyle?: ViewStyle;
}

export default function LocationButton(props: Props) {
  const [maps, setMaps] = React.useState<string[]>([]);
  React.useEffect(() => {
    queryInstalledMaps().then((r) => setMaps(r));
  }, []);

  return (
    <TouchableOpacity
      style={props.containerStyle}
      onPress={async () => {
        if (!props.address) {
          return;
        }
        if (maps.length === 0) {
          Toast.fail('未安装支持的地图应用');
          return;
        }
        Modal.operation(
          maps.map((it) => {
            return {
              text: it,
              onPress: () => {
                try {
                  props.address && openMap(it, props.address);
                } catch (e) {
                  Toast.fail(e.message);
                }
              },
            };
          }),
        );
      }}>
      <Image
        style={styles.iconLocation}
        source={require('../assets/qietu/cebenxiangqing/book_details_icon_address_normal.png')}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconLocation: {
    width: scaleSize(26),
    height: scaleSize(33),
    marginTop: scaleSize(5),
  },
});
