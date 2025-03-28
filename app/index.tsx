import { View, StyleSheet } from 'react-native';
import ExerciseList from '@/components/ExerciseList';
import { categorizedExerciseData } from '@/constants/Exercises';
import { globalStyles } from '@/constants/Styles';
import { Stack } from 'expo-router';

export default function Index() {
  return (
    <View style={globalStyles.container}>
      <Stack.Screen options={{ title: "Exercises" }}/>
      <View style={styles.exerciseContainer}>
        {Object.entries(categorizedExerciseData).map(([category, exerciseData]) => {
          return <ExerciseList name={category} exerciseData={exerciseData} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15
  },
});