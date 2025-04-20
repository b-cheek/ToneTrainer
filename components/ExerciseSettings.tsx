import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { Instruments } from '@/constants/Instruments';
import DraggableFlatList from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

const ExerciseSettings = ({
  activeInstruments,
  difficultyRanges,
  sliderValues,
  onInstrumentsChange,
  onDifficultyChange,
  onSliderChange
}: {
  activeInstruments: string[];
  difficultyRanges: Record<string, [number, number]>;
  sliderValues: Record<string, number>;
  onInstrumentsChange: (instruments: string[]) => void;
  onDifficultyChange: (key: string, value: number) => void;
  onSliderChange: (key: string, value: number) => void;
}) => {
  const [pickerValue, setPickerValue] = useState<string>("piano"); // Default to piano
  return (
    <View>
      <Text>Instrument</Text>
      <GestureHandlerRootView style={{ flex: 1, padding: 20, maxHeight: 300 }}>
        <DraggableFlatList
          // TODO: limit number of active instruments appropriately per the exercise
          // inverted={true} // For some reason, this cause all the text and buttons to be upside down
          data={activeInstruments.toReversed()}
          renderItem={({ item, drag, isActive }: { item: string; drag: () => void; isActive: boolean }) => (
            <TouchableOpacity
              onLongPress={drag}
              disabled={isActive}
              style={{ padding: 10, backgroundColor: isActive ? 'lightgray' : 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Text>{Instruments[item].display_name}</Text>
              <FontAwesome.Button
                name="trash-o"
                size={24}
                color="black"
                onPress={() => {
                  // TODO: this deletes all insturments of same type, not just the one
                  const newInstruments = activeInstruments.filter((i) => i !== item);
                  onInstrumentsChange(newInstruments);
                }}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item + index.toString()}
          // TODO: fix flicker of old ordering after dragend
          onDragEnd={({ data }) => onInstrumentsChange(data.toReversed())} // Reverse back to original order after drag
        />
      </GestureHandlerRootView>
      <Text>Active instruments: {activeInstruments}</Text>
      <Picker
        selectedValue={pickerValue}
        onValueChange={(itemValue) => {
          // Note that duplicate instruments are allowed
          setPickerValue(itemValue);
          onInstrumentsChange([...activeInstruments, itemValue]);
        }}
      >
        {Object.entries(Instruments).map(([id, instrument]) => (
          <Picker.Item
            key={id}
            label={instrument.display_name}
            value={id}
            color="black"
          />
        ))}
      </Picker>

      {Object.keys(difficultyRanges).map((key) => {
        // Take another look at this if added another inverted slider
        // TODO: set new exercise when difficulties are changed?
        const inverted = difficultyRanges[key][0] > difficultyRanges[key][1];
        const [min, max] = (inverted) ? difficultyRanges[key].toReversed() : difficultyRanges[key];
        return (
          <View key={key}>
            <Text>{key} value={sliderValues[key]}, inverted={inverted.toString()}</Text>
            <Text>difficultyRanges: {difficultyRanges[key]}</Text>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={min}
              maximumValue={max}
              step={1}
              value={sliderValues[key] || min}
              onValueChange={(value) => {
                onSliderChange(key, value);
                onDifficultyChange(key, (inverted ? max - value + 1 : value));
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

export default ExerciseSettings;