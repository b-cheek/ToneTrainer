import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { instrumentNames } from '@/constants/Values';

const ExerciseSettings = ({
  instrument,
  difficultyRanges,
  sliderValues,
  onInstrumentChange,
  onDifficultyChange,
  onSliderChange
}: {
  instrument: string;
  difficultyRanges: Record<string, [number, number]>;
  sliderValues: Record<string, number>;
  onInstrumentChange: (instrument: string) => void;
  onDifficultyChange: (key: string, value: number) => void;
  onSliderChange: (key: string, value: number) => void;
}) => {
    Object.entries(difficultyRanges).reduce((acc, [key, value]) => {
      acc[key] = value[0];
      return acc;
    }
    , {} as Record<string, number>);
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

      {Object.keys(difficultyRanges).map((key) => {
        // Take another look at this if added another inverted slider
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