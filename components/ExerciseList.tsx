import { Text, View, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { globalStyles } from '@/constants/Styles';

const ExerciseList = (props: { name: string, exerciseData: { id: string, title: string }[] }) => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text1}>{props.name}</Text>
      <FlatList
          data={props.exerciseData}
          renderItem={({ item }) => (
          <Link href={{
            pathname: '/exercises/[id]',
            params: { id: item.id }
          }}>{item.title}</Link>
          )}
          keyExtractor={(item) => item.id}
      >
      </FlatList>
    </View>
  );
}

export default ExerciseList;