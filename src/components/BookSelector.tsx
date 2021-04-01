import { Button, Checkbox } from '@ant-design/react-native';
import * as React from 'react';
import {
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  Text,
  View,
} from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { MeterBookDto } from '../../apiclient/src/models';

interface Props {
  items: MeterBookDto[];
  onSelected: (selecteds: MeterBookDto[]) => void;
}

export default function BookSelector(props: Props) {
  const [selectedItems, setSelectedItems] = React.useState<MeterBookDto[]>([]);

  React.useEffect(() => {
    setSelectedItems(
      props.items.map((it) => {
        it.selected = false;
        return it;
      }),
    );
  }, [props.items]);

  const renderItem = (info: ListRenderItemInfo<MeterBookDto>) => {
    return (
      <TouchableOpacity
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: scaleSize(10),
        }}
        onPress={() => {
          const items = selectedItems.map((it) => {
            if (it.bookName === info.item.bookName) {
              it.selected = !it.selected;
            }
            return it;
          });
          setSelectedItems(items);
        }}>
        <Checkbox checked={info.item.selected} />
        <Text style={{ marginStart: scaleSize(10), fontSize: scaleSize(30) }}>
          {info.item.bookName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList<MeterBookDto>
        data={props.items}
        renderItem={renderItem}
        keyExtractor={(it) => it.bookName}
      />
      <Button
        type="primary"
        onPress={() => {
          props.onSelected &&
            props.onSelected(selectedItems.filter((it) => it.selected));
        }}>
        确定
      </Button>
    </View>
  );
}
