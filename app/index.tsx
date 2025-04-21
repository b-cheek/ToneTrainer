import { useContext } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import ExerciseList from '@/components/ExerciseList';
import { Categories } from '@/constants/Exercises';
import { Stack } from 'expo-router';
import { globalStyles } from '@/constants/Styles';
import { GlobalsContext } from '@/components/GlobalsProvider';

export default function Index() {
  const globals = useContext(GlobalsContext);

  return (
    <View style={styles.parent}>
      <Stack.Screen options={{ title: "Exercises" }}/>
      {
        globals.loaded
        ? <ScrollView contentContainerStyle={styles.exerciseContainer}>
            {Object.entries(Categories).map(([category, exercises]) => (
              <ExerciseList key={category} name={category} exercises={exercises} />
            ))}
            <View style={styles.bottomMargin} />
          </ScrollView>
        : <Text>Loading...</Text>
      }
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