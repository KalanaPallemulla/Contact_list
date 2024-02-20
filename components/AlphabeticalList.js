import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';

const AlphabeticalList = ({handleLongPressMove, groupedContacts}) => {
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

  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      const touchLocationY = evt.nativeEvent.locationY;
      const letterHeight = 20; // Adjust as needed
      const touchedLetterIndex = Math.floor(touchLocationY / letterHeight);
      setCurrentLetterIndex(touchedLetterIndex);
    },
  });

  const handleLongPress = () => {
    const pressedLetter = letters[currentLetterIndex];
    console.log('Pressed Letter:', pressedLetter);
    // You can perform any additional actions here with the pressed letter
  };

  return (
    <View>
      <View {...panResponder.panHandlers}>
        <TouchableWithoutFeedback
          onLongPress={handleLongPress}
          onPressOut={() => {
            console.log('Long Press Ended');
            // You can add more functionality here if needed
          }}>
          <View>
            {letters.map((letter, index) => (
              <Text
                key={index}
                style={{
                  fontWeight: index === currentLetterIndex ? 'bold' : 'normal',
                }}>
                {letter}
              </Text>
            ))}
          </View>
        </TouchableWithoutFeedback>
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
