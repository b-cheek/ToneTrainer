import { Text, View,  StyleSheet, Button } from 'react-native';

export default function Index() {
  return (
      <View style={styles.container}>
        <Text style={styles.text}>Exercises</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
  },
});
