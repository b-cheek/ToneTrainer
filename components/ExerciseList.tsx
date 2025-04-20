import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/constants/Styles';
import { ExerciseData, ExerciseDifficulties } from '@/constants/Exercises';
import DifficultyText from '@/components/DifficultyText';
import Storage from 'expo-sqlite/kv-store';
import { useIsFocused } from '@react-navigation/native';

const ExerciseList = (props: { name: string, exercises: { id: string, title: string, difficulty: ExerciseDifficulties }[] }) => {
  const [data, setData] = useState<Record<string, ExerciseData>>({});
  const [dataSet, setDataSet] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const serialized = await Storage.multiGet(props.exercises.map(ex => ex.id));
        setData(Object.fromEntries(serialized.map(
          ([ex, data]) => [ex, data === null ? { completed: 0, correct: 0 } : JSON.parse(data)]
        )));
        setDataSet(true);
      })();
    }

    return () => {
      setDataSet(false);
      setData({});
    }
  }, [isFocused]);

  return (
    <View style={styles.parent}>
      <Text style={globalStyles.text1}>{props.name}</Text>
      {props.exercises.map(item => (
        <Pressable onPress={() => router.push({
          pathname: '/exercises/[id]',
          params: { id : item.id }
        })} key={item.id} style={styles.exercise}>
          <Text>{item.title}</Text>
          <View style={styles.difficultyAndCompletion}>
            <DifficultyText difficulty={item.difficulty}/>
            <Text>{dataSet ? data[item.id].correct : "-"}/{dataSet ? data[item.id].completed : "-"} correct</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  parent: {
    flexGrow: 1,
    flexShrink: 1,
    gap: 10,
    width: '80%'
  },
  exercise: {
    ...globalStyles.column,
    backgroundColor: 'lightgray',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  difficultyAndCompletion: {
    ...globalStyles.row,
    justifyContent: 'space-between'
  }
});

export default ExerciseList;