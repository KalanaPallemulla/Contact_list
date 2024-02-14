import React, {useRef, useState} from 'react';
import {StyleSheet, Text, View, PanResponder} from 'react-native';

const AlphabeticalList = ({handleLongPressMove, groupedContacts}) => {
  const letters = Object.keys(groupedContacts).sort();
  const [prevLetter, setPrevLetter] = useState('');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        const touchedLetter = getTouchedLetter(gestureState.y0);
        if (prevLetter !== touchedLetter) {
          setPrevLetter(touchedLetter);
          handleLongPressMove(touchedLetter);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        const touchedLetter = getTouchedLetter(gestureState.moveY);
        if (prevLetter !== touchedLetter) {
          setPrevLetter(touchedLetter);
          handleLongPressMove(touchedLetter);
        }
      },
      onPanResponderRelease: () => {
        setPrevLetter('');
      },
    }),
  ).current;

  const getTouchedLetter = y => {
    const index = Math.floor(y / 50);
    return letters[index];
  };

  return (
    <View style={styles.container}>
      <View {...panResponder.panHandlers}>
        {letters.map((letter, index) => (
          <View key={index}>
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
    backgroundColor: 'red',
  },
  letter: {
    fontSize: 20,
    marginVertical: 1,
  },
});
