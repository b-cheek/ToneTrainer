import { useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ExerciseList from '@/components/ExerciseList';
import { Categories } from '@/constants/Exercises';
import { Stack } from 'expo-router';
import { globalStyles } from '@/constants/Styles';
import { GlobalsContext } from '@/components/GlobalsProvider';
import AudioPlayer from '@/components/AudioPlayer';

export default function Index() {
  const globals = useContext(GlobalsContext);

  return (
    <View style={globalStyles.maxHeight}>
      <Stack.Screen options={{ title: globals.webviewLoaded ? "Exercises" : "Loading..." }} />
      {
        globals.loaded &&
        <AudioPlayer ref={globals.webviewRef} />
      }
      {
        globals.webviewLoaded &&
        <ScrollView contentContainerStyle={styles.exerciseContainer}>
          {Object.entries(Categories).map(([category, exercises]) => (
            <ExerciseList key={category} name={category} exercises={exercises} />
          ))}
          <View style={styles.bottomMargin} />
        </ScrollView>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseContainer: {
    ...globalStyles.column,
    alignItems: 'center'
  },
  bottomMargin: {
    height: 20
  }
});