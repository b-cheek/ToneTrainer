import { View, ScrollView, StyleSheet } from 'react-native';
import ExerciseList from '@/components/ExerciseList';
import { Categories } from '@/constants/Exercises';
import { Stack } from 'expo-router';
import { globalStyles } from '@/constants/Styles';

export default function Index() {
  return (
    <View style={styles.parent}>
      <Stack.Screen options={{ title: "Exercises" }}/>
      <ScrollView contentContainerStyle={styles.exerciseContainer}>
        {Object.entries(Categories).map(([category, exercises]) => (
          <ExerciseList key={category} name={category} exercises={exercises} />
        ))}
        <View style={styles.bottomMargin} />
      </ScrollView>
    </View>
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