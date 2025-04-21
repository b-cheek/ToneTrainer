import { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { Instruments } from '@/constants/Instruments';
import DraggableFlatList from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { globalStyles } from '@/constants/Styles';
import { development, sliderDisplayNames } from '@/constants/Values';

const ExerciseSettings = ({
  activeInstruments,
  difficultyRanges,
  sliderValues,
  staggered,
  showSheetMusic,
  onInstrumentsChange,
  onDifficultyChange,
  onSliderChange,
  onStaggeredChange,
  onShowSheetMusicChange
}: {
  activeInstruments: string[];
  difficultyRanges: Record<string, [number, number]>;
  sliderValues: Record<string, number>;
  staggered: boolean;
  showSheetMusic: boolean;
  onInstrumentsChange: (instruments: string[]) => void;
  onDifficultyChange: (key: string, value: number) => void;
  onSliderChange: (key: string, value: number) => void;
  onStaggeredChange: (value: boolean) => void;
  onShowSheetMusicChange: (value: boolean) => void;
}) => {
  const [pickerValue, setPickerValue] = useState<string>("piano"); // Default to piano
  return (
    <View>
      <GestureHandlerRootView style={{ flex: 1, maxHeight: 300, margin: 5, borderColor: 'grey', borderWidth: 1 }}>
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
                iconStyle={globalStyles.icon}
                onPress={() => {
                  // TODO: this deletes all insturments of same type, not just the one
                  const newInstruments = activeInstruments.filter((i) => i !== item);
                  onInstrumentsChange(newInstruments.length == 0 ? activeInstruments : newInstruments);
                }}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item + index.toString()}
          // TODO: fix flicker of old ordering after dragend
          onDragEnd={({ data }) => onInstrumentsChange(data.toReversed())} // Reverse back to original order after drag
        />
      </GestureHandlerRootView>
      {development && <Text>Active instruments: {activeInstruments}</Text>}
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

      <View style={styles.slidersContainer}>

        {(Object.keys(difficultyRanges) as Array<keyof typeof sliderDisplayNames>).map((key) => {
          // Take another look at this if added another inverted slider
          // TODO: set new exercise when difficulties are changed?
          // Calculate string that shows the slider value based on the range
          const sliderCalc = (
            range: [number, number],
            sliderValue: number
          ): string => {
              // Set slider value to range[0] if undefined
              if (sliderValue === undefined) sliderValue = (inverted) ? range[1] : range[0];
              return (inverted)
              ? (31 - sliderValue === range[0] ? `${range[0]}` : `${31 - sliderValue} - ${range[0]}`) // Inverted slider
              // ? (range[1] === 31 - sliderValue ? `${range[1]}` : `${range[1]} - ${31 - sliderValue}`) // Inverted slider
              : (range[0] === sliderValue ? `${range[0]}` : `${range[0]} - ${sliderValue}`); // Normal slider
          }
          const inverted = difficultyRanges[key][0] > difficultyRanges[key][1];
          const [min, max] = (inverted) ? difficultyRanges[key].toReversed() : difficultyRanges[key];
          return (
            <View key={key} style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text>{sliderDisplayNames[key]}: {sliderCalc(difficultyRanges[key], sliderValues[key])} {development && `value=${sliderValues[key]}, inverted=${inverted.toString()}`}</Text>
              {development && <Text>difficultyRanges: {difficultyRanges[key]}</Text>}
              <Slider
                style={{ width: 150, height: 40 }}
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
      <Text>Staggered</Text>
      <Switch
        onValueChange={onStaggeredChange}
        value={staggered}
      />
      <Text>Show sheet music</Text>
      <Switch
        onValueChange={onShowSheetMusicChange}
        value={showSheetMusic}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slidersContainer: {
    ...globalStyles.column,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  }
});

export default ExerciseSettings;