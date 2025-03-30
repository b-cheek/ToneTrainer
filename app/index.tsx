import { StrictMode } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ExerciseList from '@/components/ExerciseList';
import { categorizedExerciseData } from '@/constants/Exercises';
import { Stack } from 'expo-router';
import { globalStyles } from '@/constants/Styles';

export default function Index() {
  return (
    <StrictMode>
    <View style={styles.parent}>
      <Stack.Screen options={{ title: "Exercises" }}/>
      <ScrollView contentContainerStyle={styles.exerciseContainer}>
        {Object.entries(categorizedExerciseData).map(([category, exerciseData]) => (
          <ExerciseList key={category} name={category} exerciseData={exerciseData} />
        ))}
        <View style={styles.bottomMargin} />
      </ScrollView>
    </View>
    </StrictMode>
  );
}

const styles = StyleSheet.create({
  exerciseContainer: {
    ...globalStyles.column,
    alignItems: 'center'
  },
  parent: {
    height: '100%'
  },
  bottomMargin: {
    height: 20
  }
});