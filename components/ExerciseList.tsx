import { Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/constants/Styles';
import { ExerciseDifficulties } from '@/constants/Exercise';
import DifficultyText from '@/components/DifficultyText';

const ExerciseList = (props: { name: string, exerciseData: { id: string, title: string, difficulty: ExerciseDifficulties }[] }) => {
  return (
    <View style={styles.parent}>
      <Text style={globalStyles.text1}>{props.name}</Text>
      {props.exerciseData.map(item => (
        <Pressable onPress={() => router.push({
          pathname: '/exercises/[id]',
          params: { id : item.id }
        })} key={item.id} style={styles.exercise}>
          <Text>{item.title}</Text>
          <View style={styles.difficultyAndCompletion}>
            <DifficultyText difficulty={item.difficulty}/>
            <Text>0% completed</Text>
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