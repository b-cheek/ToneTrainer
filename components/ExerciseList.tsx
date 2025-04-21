import { useContext } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/constants/Styles';
import { ExerciseDifficulties } from '@/constants/Exercises';
import DifficultyText from '@/components/DifficultyText';
import { DatabaseContext } from '@/components/DatabaseProvider';
import { useIsFocused } from '@react-navigation/native';

const ExerciseList = (props: {
  name: string,
  exercises: { id: string, title: string, difficulty: ExerciseDifficulties }[]
}) => {
  const database = useContext(DatabaseContext);
  // Something refuses to re-render this component when the context changes even when the dispatch obviously goes through.
  // Merely including this focus hook is enough to force a re-render upon navigating back to the homepage.
  const _ = useIsFocused();

  return (
    <View style={styles.parent}>
      <Text style={globalStyles.text1}>{props.name}</Text>
      {props.exercises.map(item => (
        <Pressable onPress={() => {
          router.push({
            pathname: '/exercises/[id]',
            params: { id : item.id }
          });
        }} key={item.id} style={styles.exercise}>
          <Text>{item.title}</Text>
          <View style={styles.difficultyAndCompletion}>
            <DifficultyText difficulty={item.difficulty}/>
            <Text>{database.exercises[item.id].correct}/{database.exercises[item.id].completed} correct</Text>
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