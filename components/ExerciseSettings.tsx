import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { instrumentNames } from '@/constants/Values';

const ExerciseSettings = ({
  instrument,
  difficultyRanges,
  onInstrumentChange,
  onDifficultyChange,
}: {
  instrument: string;
  difficultyRanges: Record<string, [number, number]>;
  onInstrumentChange: (instrument: string) => void;
  onDifficultyChange: (key: string, value: number) => void;
}) => {
  return (
    <View>
      <Text>Instrument</Text>
      <Picker
        selectedValue={instrument}
        onValueChange={onInstrumentChange}
      >
        {instrumentNames.map(({ display, internal }) => (
          <Picker.Item
            key={internal}
            label={display}
            value={internal}
            color="black"
          />
        ))}
      </Picker>

      {Object.keys(difficultyRanges).map((key) => (
        <View key={key}>
          <Text>{key}</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={0} // Consider making this a controlled value for consistent UI state
            onValueChange={(value) => {
              const range = difficultyRanges[key];
              const newValue = Math.round(
                value * range[1] + (1 - value) * range[0]
              );
              onDifficultyChange(key, newValue);
            }}
          />
        </View>
      ))}
    </View>
  );
};

export default ExerciseSettings;