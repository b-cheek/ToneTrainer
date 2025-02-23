import { Text, View, FlatList, Button, StyleSheet } from 'react-native';
import { ExerciseList } from '@/components/ExerciseList';

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.exerciseContainer}>
        <ExerciseList title="Beginner" />
        <ExerciseList title="Intermediate" />
        <ExerciseList title="Adcanced" />
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
