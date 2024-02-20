import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';

const AlphabeticalList = ({
  handleLongPressMove,
  groupedContacts,
  setLetter,
  letter,
}) => {
  // const letters = Object.keys(groupedContacts).sort();
  const letters = [
    '#',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        const touchedLetter = getTouchedLetter(gestureState.y0);
        console.log('touchedLetter', touchedLetter);
        if (letter !== touchedLetter) {
          setLetter(touchedLetter);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        const touchedLetter = getTouchedLetter(gestureState.moveY);
        console.log('touchedLetter', touchedLetter);
        if (letter !== touchedLetter) {
          setLetter(touchedLetter);
        }
      },
      onPanResponderRelease: () => {
        setLetter('');
      },
    }),
  ).current;

  const getTouchedLetter = y => {
    const index = Math.floor(y / 50);
    return letters[index];
  };

  return (
    <View style={styles.container}>
      <View>
        {letters.map((letter, index) => (
          <View key={index} {...panResponder.panHandlers}>
            <Text style={styles.letter}>{letter}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AlphabeticalList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },
  letter: {
    fontSize: 20,
    marginVertical: 1,
  },
});
