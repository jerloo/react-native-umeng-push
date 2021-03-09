import * as React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { PdaReadStateDto } from '../../apiclient/src/models';
import {
  getReadStateSettings,
  ReadStateStorage,
  setOffensReadStatesId,
} from '../utils/settingsUtils';
import StateButtonEx from './StateButtonEx';

interface Props {
  onSaved: () => void;
  onSelected: (item: PdaReadStateDto) => void;
  selectedState?: PdaReadStateDto;
}

export default function NewReadSettings(props: Props) {
  const [editing, setEditing] = React.useState(false);

  const [readStates, setReadStates] = React.useState<ReadStateStorage>();
  React.useEffect(() => {
    getReadStateSettings().then((r) => {
      if (r) {
        setReadStates(r);
      }
    });
  }, []);

  const moveFromOffen = async (item: PdaReadStateDto) => {
    if (!editing) {
      props.onSelected(item);
    } else {
      const offens = readStates?.offens.filter((it) => it.id !== item.id);
      const groups = readStates?.groups;
      groups?.forEach((it) => {
        if (it.id === item.parentId) {
          it.children.push(item);
        }
      });
      setReadStates({
        offens: offens || [],
        groups: groups || [],
      });
    }
  };

  const addToOffen = async (item: PdaReadStateDto) => {
    if (!editing) {
      props.onSelected(item);
    } else {
      const offens = readStates?.offens || [];
      offens.push(item);
      const groups = readStates?.groups || [];
      groups.forEach((it) => {
        if (it.id === item.parentId) {
          it.children = it.children.filter((i) => i.id !== item.id);
        }
      });
      setReadStates({ offens, groups });
    }
  };

  const save = async () => {
    console.log('save');
    await setOffensReadStatesId(readStates?.offens.map((it) => it.id) || []);
    props.onSaved && props.onSaved();
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
            selected={it.id === props.selectedState?.id}
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
                selected={it.id === props.selectedState?.id}
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
    minHeight: scaleSize(210),
  },
  groupBox: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: scaleSize(17),
    padding: scaleSize(12),
  },
});
