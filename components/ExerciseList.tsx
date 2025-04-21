import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/constants/Styles';
import { ExerciseData, ExerciseDifficulties } from '@/constants/Exercises';
import DifficultyText from '@/components/DifficultyText';
import { loadDatabase, getExercises } from '@/utils/Database';
import { useIsFocused } from '@react-navigation/native';

const ExerciseList = (props: { name: string, exercises: { id: string, title: string, difficulty: ExerciseDifficulties }[] }) => {
  const [data, setData] = useState<Record<string, ExerciseData>>({});
  const [dataSet, setDataSet] = useState<boolean>(false);
  const [dataNull, setDataNull] = useState<boolean>(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const exercises = getExercises();
      if (exercises === null) {
        setDataNull(true);
        loadDatabase();
        setDataNull(false);
      } else {
        setData(exercises);
        setDataSet(true);
      }
    }
  }, [isFocused]);

  return (
    <View style={styles.parent}>
      {
        dataNull
        ? <Text>Exercise not found</Text>
        : <View>
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
      }
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