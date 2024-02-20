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
import Contacts from 'react-native-contacts';
import {PermissionsAndroid} from 'react-native';

export default function App() {
  const sectionListRef = useRef(null);
  const scrollViewHeightRef = useRef(null);
  const scrollViewRef = useRef(null);

  const [contacts] = useState(data);
  const [prevLetter, setPrevLetter] = useState('');
  const [fetchedContactsData, setFetchContactsData] = useState([]);
  const [itemHeight, setItemHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [fetchSection, setFetchSection] = useState([]);
  const [letter, setLetter] = useState('');

  useEffect(() => {
    (async function requestContactsPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app needs access to your contacts.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Contacts permission granted');
          fetchContacts();
        } else {
          console.log('Contacts permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (letter) {
      handleLongPressMove();
    }
  }, [letter]);

  const fetchContacts = () => {
    try {
      Contacts.getAll().then(async fetchContacts => {
        // console.log('fetched', fetchContacts[10]);

        setFetchContactsData(fetchContacts);
      });
    } catch (error) {
      console.log(error);
    }
    console.log('end');
  };

  const groupedContacts = fetchedContactsData.reduce((acc, contact) => {
    let section;
    const displayName = contact.displayName;

    // Check if displayName is null or undefined
    if (displayName != null) {
      const firstChar = displayName.charAt(0);

      // Determine the section based on the first character
      if (firstChar !== '') {
        if (firstChar.match(/[A-Za-z]/)) {
          // If first character is an alphabetical character (A-Z or a-z)
          section = firstChar.toUpperCase();
        } else {
          // If first character is not an alphabetical character
          section = '#';
        }
      } else {
        // If first character is empty (null or empty string)
        section = '#';
      }
    } else {
      // If displayName is null or undefined, assign the section as '#'
      section = '#';
    }

    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(contact);
    return acc;
  }, {});

  const sections = Object.keys(groupedContacts)
    .sort()
    .map(key => ({
      title: key,
      data: groupedContacts[key],
    }));

  const handleLongPressMove = async () => {
    console.log('letter:', letter);
    // Normalize letter (e.g., convert to uppercase)
    const normalizedLetter = letter.toUpperCase().trim();
    console.log('normalizedLetter', normalizedLetter);
    // Find the index of the section with the matching title letter
    let sectionIndex = -1;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].title.toString() == normalizedLetter.toString()) {
        sectionIndex = i;
        break;
      }
    }

    // If section with the matching letter is found, calculate offset and scroll
    if (sectionIndex !== -1) {
      let offset = 0;
      for (let i = 0; i < sectionIndex; i++) {
        // Add the height of each section header
        offset += headerHeight - 20;
        // Add the height of each item in the section
        offset += sections[i].data.length * itemHeight;
      }
      // Add the height of section header of the current section
      offset += headerHeight + 20;

      scrollViewRef.current.scrollTo({y: offset, animated: true, index: 0});
    } else {
      console.warn(`Section with title '${normalizedLetter}' not found.`);
    }
  };

  console.log(sections.findIndex(section => section.title === 'K'));
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact List</Text>
      <View style={styles.content}>
        <ScrollView style={{flex: 1}} ref={scrollViewRef}>
          {sections.map((section, sectionIndex) => (
            <View key={sectionIndex}>
              <TouchableOpacity
                onPress={() => handleLongPressMove(section.title)}>
                <View
                  style={styles.sectionHeader}
                  onLayout={e => {
                    if (headerHeight === 0) {
                      setHeaderHeight(e.nativeEvent.layout.height);
                    }
                  }}>
                  <Text style={styles.sectionHeaderText}>{section.title}</Text>
                </View>
              </TouchableOpacity>
              {section.data.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  onPress={() => console.log('Clicked contact:', item)}>
                  <View
                    style={styles.contactItem}
                    onLayout={e => {
                      if (itemHeight === 0) {
                        setItemHeight(e.nativeEvent.layout.height);
                      }
                    }}>
                    <Text style={styles.contactName}>{item.displayName}</Text>
                    {item.phoneNumbers.map((phoneNumber, index) => (
                      <Text key={index} style={styles.contactNumber}>
                        {phoneNumber.number}
                      </Text>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        <View>
          <AlphabeticalList
            handleLongPressMove={handleLongPressMove}
            groupedContacts={groupedContacts}
            sections={sections}
            setLetter={setLetter}
            letter={letter}
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
