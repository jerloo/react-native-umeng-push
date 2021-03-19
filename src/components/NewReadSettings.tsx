import * as React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { PdaReadStateDto } from '../../apiclient/src/models';
import {
  addReadStateToOffen,
  getReadStateSettings,
  ReadStateStorage,
  removeReadStateFromOffen,
  saveReadStatesStorage,
} from '../utils/statesUtils';
import StateButtonEx from './StateButtonEx';

interface Props {
  onSaved: (readStates: ReadStateStorage) => void;
  onSelected: (item: PdaReadStateDto) => void;
  selectedStateId?: number;
  readStates?: ReadStateStorage;
}

export default function NewReadSettings(props: Props) {
  const [editing, setEditing] = React.useState(false);

  const [readStates, setReadStates] = React.useState<ReadStateStorage>();

  React.useEffect(() => {
    setReadStates(props.readStates);
  }, [props.readStates]);

  const moveFromOffen = async (item: PdaReadStateDto) => {
    if (!editing) {
      props.onSelected(item);
    } else {
      if (readStates) {
        const newStates = await removeReadStateFromOffen(item, readStates);
        setReadStates(newStates);
      }
    }
  };

  const addToOffen = async (item: PdaReadStateDto) => {
    if (!editing) {
      props.onSelected(item);
    } else {
      if (readStates) {
        const newStates = await addReadStateToOffen(item, readStates);
        setReadStates(newStates);
      }
    }
  };

  const save = async () => {
    if (readStates) {
      await saveReadStatesStorage(readStates);
      props.onSaved && props.onSaved(readStates);
    }
  };

  const reset = () => {
    getReadStateSettings().then((r) => {
      if (r) {
        setReadStates(r);
        setEditing(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          style={styles.icon}
          source={require('../assets/qietu/chaobiaoluru/enter_icon_intercalate_normal.png')}
        />
        <Text style={styles.title}>抄表状态设置</Text>
      </View>

      <View style={styles.oprows}>
        <Text style={styles.blockTitle}>常用状态</Text>
        {!editing ? (
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Image
              style={styles.icon}
              source={require('../assets/qietu/chaobiaoluru/enter_icon_sort_normal.png')}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.opButtons}>
            <TouchableOpacity style={styles.opButton} onPress={save}>
              <Text style={styles.opButtonTextSave}>保存</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.opButton} onPress={reset}>
              <Text style={styles.opButtonTextReset}>重置</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.offenBox}>
        {readStates?.offens.map((it) => (
          <StateButtonEx
            key={it.id}
            title={it.stateName}
            onClick={() => moveFromOffen(it)}
            icon={editing ? 'remove' : 'none'}
            selected={it.id === props.selectedStateId}
          />
        ))}
      </View>

      {readStates?.groups.map((it) => (
        <View key={it.id}>
          <Text style={styles.blockTitle}>{it.stateName}</Text>
          <View style={styles.groupBox}>
            {it.children.map((i) => (
              <StateButtonEx
                key={i.id}
                title={i.stateName}
                onClick={() => addToOffen(i)}
                icon={editing ? 'add' : 'none'}
                selected={it.id === props.selectedStateId}
              />
            ))}
          </View>
        </View>
      ))}
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
    width: scaleSize(40),
    height: scaleSize(40),
    marginStart: scaleSize(30),
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
  oprows: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingEnd: scaleSize(30),
  },
  opButtons: {
    display: 'flex',
    flexDirection: 'row',
  },
  opButton: {
    padding: scaleSize(10),
  },
  opButtonTextSave: {
    color: '#5384F9',
    fontSize: scaleSize(24),
  },
  opButtonTextReset: {
    color: '#999999',
    fontSize: scaleSize(24),
  },
  offenBox: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: scaleSize(17),
    padding: scaleSize(12),
    borderStyle: 'dashed',
    borderWidth: scaleSize(1),
    borderRadius: scaleSize(2),
    borderColor: '#DEDEDE',
    // minHeight: scaleSize(210),
    flexWrap: 'wrap',
  },
  groupBox: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: scaleSize(17),
    padding: scaleSize(12),
  },
});
