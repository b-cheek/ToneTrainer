import { Text, View, FlatList, Button, StyleSheet } from 'react-native';
import ExerciseList from '@/components/ExerciseList';
import { Exercises, ExerciseGroupings } from '@/constants/Exercises';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text0}>Exercises</Text>
      <View style={styles.exerciseContainer}>
        <ExerciseList title="Beginner" exercises={Exercises.filter(ex => ex.grouping==ExerciseGroupings.Beginner)} />
        <ExerciseList title="Intermediate" exercises={Exercises.filter(ex => ex.grouping==ExerciseGroupings.Intermediate)} />
        <ExerciseList title="Advanced" exercises={Exercises.filter(ex => ex.grouping==ExerciseGroupings.Advanced)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text0: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  exerciseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15
  },
});
