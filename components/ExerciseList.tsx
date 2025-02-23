import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Link } from 'expo-router';

export function ExerciseList(props: { title: string, exercises: { title: string, grouping: string }[] }) {
  return (
    <View style={styles.container}>
        <Text style={styles.text1}>{props.title}</Text>
        <FlatList
            data={props.exercises}
            renderItem={({ item }) => (
            <Link href={{
              pathname: '/exercises/[id]',
              params: { id: item.title }
            }}>{item.title}</Link>
            )}
            keyExtractor={(item) => item.title} // TODO: use a unique ID instead of the title?
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
  text1: {
    fontSize: 20,
    textDecorationLine: 'underline',
    marginTop: 20,
    marginBottom: 20,
  },
});