import { StyleSheet, Text, View, FlatList, Button } from 'react-native';

export function ExerciseList(props: { title: string }) {
  return (
    <View style={styles.container}>
        <Text style={styles.text0}>{props.title}</Text>
        <FlatList
            data={[{ key: 'A' }, { key: 'B' }, { key: 'C' }]}
            renderItem={({ item }) => (
            <Button title={item.key} onPress={() => {}} />
            )}
            keyExtractor={(item) => item.key}
        >
        </FlatList>
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
});