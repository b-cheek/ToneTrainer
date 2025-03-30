import { Text, StyleSheet, TextStyle } from 'react-native';
import { ExerciseDifficulties } from '@/constants/Exercise';

const styles: Record<ExerciseDifficulties, TextStyle> = StyleSheet.create({
    Beginner: {
        color: 'green'
    },
    Intermediate: {
        color: 'yellow'
    },
    Advanced: {
        color: 'red'
    }
});

const DifficultyText = (props: { difficulty: ExerciseDifficulties }) => (
    <Text style={styles[props.difficulty]}>{props.difficulty}</Text>
);

export default DifficultyText;