import { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { Instruments } from '@/constants/Instruments';
import DraggableFlatList from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { globalStyles } from '@/constants/Styles';
import { development, sliderDisplayNames, intervalDistances } from '@/constants/Values';

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
    <View style={globalStyles.maxWidth}>
      <GestureHandlerRootView style={{ height: 300, margin: 5, borderColor: 'grey', borderWidth: 1 }}>
        <DraggableFlatList
          // TODO: limit number of active instruments appropriately per the exercise
          // inverted={true} // For some reason, this cause all the text and buttons to be upside down
          data={[...activeInstruments.entries()].toReversed()}
          keyExtractor={([index, _]) => `${index}`}
          renderItem={({ item, drag, isActive }: { item: [number, string]; drag: () => void; isActive: boolean }) => {
            const [index, instrument] = item;
            return (
              <TouchableOpacity
                onLongPress={drag}
                disabled={isActive}
                style={{
                  padding: 10,
                  backgroundColor: isActive ? 'lightgray' : 'white',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Text>{Instruments[instrument].display_name}</Text>
                <FontAwesome.Button
                  name="trash-o"
                  size={24}
                  color="lightgray"
                  iconStyle={globalStyles.icon}
                  onPress={() => {
                    if (activeInstruments.length > 1) {
                      onInstrumentsChange(activeInstruments.toSpliced(index, 1));
                    }
                  }}
                />
              </TouchableOpacity>
            );
          }}
          // TODO: fix flicker of old ordering after dragend
          onDragEnd={({ data }) => onInstrumentsChange(data.map(([_, ins]) => ins).toReversed())} // Reverse back to original order after drag
        />
      </GestureHandlerRootView>
      {development && <Text>Active instruments: {activeInstruments}</Text>}
      <View style={styles.pickerRow}>
        <View style={{ flex: 1 }}>
          <Picker
            selectedValue={pickerValue}
            onValueChange={(itemValue) => {
              // Note that duplicate instruments are allowed
              setPickerValue(itemValue);
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
        </View>
        <View style={{ flex: 0.25 }}></View>
        <View>
          <FontAwesome.Button
            name="plus"
            size={24}
            color="lightgray"
            iconStyle={globalStyles.icon} onPress={() => onInstrumentsChange([...activeInstruments, pickerValue])}
          />
        </View>
      </View>

      <View style={styles.slidersContainer}>

        {(Object.keys(difficultyRanges) as Array<keyof typeof sliderDisplayNames>).map((key) => {
          // Take another look at this if added another inverted slider
          // TODO: set new exercise when difficulties are changed?
          // Calculate string that shows the slider value based on the range
          const sliderCalc = (
            key: string,
            range: [number, number],
            sliderValue: number
          ): string => {
              const inverted = difficultyRanges[key][0] > difficultyRanges[key][1];
              // Set slider value to range[0] if undefined
              if (sliderValue === undefined) sliderValue = (inverted) ? range[1] : range[0];
              let formatNumber;
              if (key == "range") {
                formatNumber = (num: number) => ((num + 8)/6).toFixed(2);
              }
              else if (key == "size") {
                formatNumber = (num: number) => intervalDistances[num] ? intervalDistances[num] : num;
              }
              else {
                formatNumber = (num: number) => num
              }

                
              return (inverted)
              ? (31 - sliderValue === range[0] ? `${formatNumber(range[0])}` : `${formatNumber(31 - sliderValue)} - ${formatNumber(range[0])}`) // Inverted slider
              // ? (range[1] === 31 - sliderValue ? `${range[1]}` : `${range[1]} - ${31 - sliderValue}`) // Inverted slider
              : (range[0] === sliderValue ? `${formatNumber(range[0])}` : `${formatNumber(range[0])} - ${formatNumber(sliderValue)}`); // Normal slider
          }
          const inverted = difficultyRanges[key][0] > difficultyRanges[key][1];
          const [min, max] = (inverted) ? difficultyRanges[key].toReversed() : difficultyRanges[key];
          return (
            <View key={key}>
              <View>
                <Text>{sliderDisplayNames[key]}: {sliderCalc(difficultyRanges[key], sliderValues[key])} {development && `value=${sliderValues[key]}, inverted=${inverted.toString()}`}</Text>
              </View>
              {development && <Text>difficultyRanges: {difficultyRanges[key]}</Text>}
              <Slider
                style={styles.slider}
                minimumValue={min}
                maximumValue={max}
                step={1}
                value={sliderValues[key]}
                onSlidingComplete={(value) => {
                  onSliderChange(key, value);
                  onDifficultyChange(key, (inverted ? max - value + 1 : value));
                }}
              />
            </View>
          );
        })}
        <View style={styles.pickerRow}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slidersContainer: {
    ...globalStyles.column,
    ...globalStyles.maxWidth,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  pickerRow: {
    ...globalStyles.row,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  slider: {
    marginTop: 5,
    marginBottom: 15
  }
});

export default ExerciseSettings;