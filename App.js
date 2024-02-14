import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {data} from './helpers';
import AlphabeticalList from './components/AlphabeticalList';

export default function App() {
  const sectionListRef = useRef(null);
  const scrollViewHeightRef = useRef(null);

  const [contacts, setContacts] = useState(data);
  const [prevLetter, setPrevLetter] = useState('');

  const groupedContacts = contacts.reduce((acc, contact) => {
    const firstLetter = contact.displayName.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(contact);
    return acc;
  }, {});

  const sections = Object.keys(groupedContacts)
    .sort()
    .map(key => ({
      title: key,
      data: groupedContacts[key],
    }));

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => console.log('Clicked contact:', item)}>
        <View style={styles.contactItem}>
          <Text style={styles.contactName}>{item.displayName}</Text>
          {item.phoneNumbers.map((phoneNumber, index) => (
            <Text key={index} style={styles.contactNumber}>
              {phoneNumber.number}
            </Text>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({section: {title}}) => (
    <TouchableOpacity onPress={() => console.log('Clicked section:', title)}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  // const renderRightLetters = () => {
  //   // const letters = Array.from(Array(26), (_, i) =>
  //   //   String.fromCharCode(65 + i),
  //   // );
  //   const letters = Object.keys(groupedContacts).sort();
  //   return letters.map((letter, index) => (
  //     <TouchableOpacity
  //       key={index}
  //       onPress={() => {
  //         const sectionIndex = sections.findIndex(
  //           section => section.title === letter,
  //         );
  //         sectionListRef.current.scrollToLocation({
  //           sectionIndex,
  //           itemIndex: 0,
  //         });
  //       }}>
  //       <Text style={styles.rightLetter}>{letter}</Text>
  //     </TouchableOpacity>
  //   ));
  // };

  // const handleTouchMove = event => {
  //   const targetY = event.nativeEvent.locationY;
  //   const scrollViewHeight = scrollViewHeightRef.current;
  //   const sectionHeight = scrollViewHeight / 26; // Assuming 26 letters

  //   if (targetY >= 0 && targetY <= scrollViewHeight) {
  //     const index = Math.floor(targetY / sectionHeight);
  //     const letter = String.fromCharCode(65 + index);
  //     // console.log('letter', letter);
  //     const sectionIndex = sections.findIndex(
  //       section => section.title === letter,
  //     );
  //     sectionListRef.current.scrollToLocation({
  //       sectionIndex,
  //       itemIndex: 0,
  //     });
  //   } else {
  //     console.log('letter321');
  //   }
  // };

  const handleLongPressMove = letter => {
    if (letter != prevLetter) {
      setPrevLetter(letter);
      const sectionIndex = sections.findIndex(
        section => section.title === letter,
      );
      sectionListRef.current.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact List</Text>
      <View style={styles.content}>
        <SectionList
          ref={sectionListRef}
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.recordID}
        />

        <View>
          <AlphabeticalList
            handleLongPressMove={handleLongPressMove}
            groupedContacts={groupedContacts}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  contactItem: {
    marginBottom: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 16,
  },
  sectionHeader: {
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightLetters: {
    marginLeft: 10,
  },
  rightLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
