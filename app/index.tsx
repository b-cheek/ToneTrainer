import { Text, View, FlatList, Button, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text0}>Exercises</Text>
      </View>
      <View style={styles.exerciseContainer}>
        <FlatList
          data={[{key: 'A'}, {key: 'B'}, {key: 'C'}]}
          renderItem={({item}) => <Button title={item.key} onPress={() => {}} />}
          keyExtractor={item => item.key}
        >
        </FlatList>
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
  },
});
