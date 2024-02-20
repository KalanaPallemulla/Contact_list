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
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    // (async function getContactsFromStorage() {
    //   try {
    //     const value = await AsyncStorage.getItem('@Contacts');
    //     if (value !== null) {
    //       // We have data!!
    //       setFetchSection(value);
    //     }
    //   } catch (error) {
    //     // Error retrieving data
    //   }
    // })();
    fetchContacts();
  }, []);

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

  useEffect(() => {
    if (sections) {
      let data = [];

      sections.forEach(section => {
        const {title, data: sectionData} = section;
        data.push({[title]: sectionData});
      });
      setCotact;
    }
    // console.log('data', data);
  }, [sections]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => console.log('Clicked contact:', item)}>
        <View
          style={styles.contactItem}
          // onLayout={e =>
          //   console.log('item height', e.nativeEvent.layout.height)
          // }
        >
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
      <View
        style={styles.sectionHeader}
        // onLayout={e =>
        //   console.log('header height', e.nativeEvent.layout.height)
        // }
      >
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  // const handleLongPressMove = letter => {
  //   // Normalize letter (e.g., convert to uppercase)
  //   const normalizedLetter = letter.toUpperCase().trim();

  //   // Initialize sectionIndex
  //   let sectionIndex = 11;

  //   // Iterate over sections array
  //   // for (let i = 0; i < sections.length; i++) {
  //   //   if (sections[i].title === normalizedLetter) {
  //   //     sectionIndex = i;
  //   //     break; // Exit loop once the section is found
  //   //   }
  //   // }

  //   // If sectionIndex is found, scroll to that section
  //   if (sectionIndex !== -1 && sectionListRef.current) {
  //     sectionListRef.current.scrollToLocation({
  //       sectionIndex,
  //       itemIndex: 0, // Scroll to the first item in the section
  //       animated: true, // Optionally, you can enable animated scrolling
  //     });
  //   } else {
  //     console.warn(`Section with title '${normalizedLetter}' not found.`);
  //   }
  // };

  // console.log(sections);

  const handleLongPressMove = letter => {
    console.log('letter:', letter);
    // Normalize letter (e.g., convert to uppercase)
    const normalizedLetter = letter.toUpperCase().trim();

    // Find the index of the section with the matching title letter
    const sectionIndex = sections.findIndex(
      section => section.title === normalizedLetter,
    );

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
  console.log(sections);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact List</Text>
      <View style={styles.content}>
        {/* <SectionList
          ref={sectionListRef}
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.recordID}
          getItemLayout={(data, index) => ({
            length: 92, // specify the item height
            offset: 92 * index, // calculate offset based on index and item height
            index, // pass index to the layout
          })}
          virtualized={false}
        /> */}
        {/* {fetchedContactsData.map((item, index) => (
          <View key={index}>
            <Text>{item.givenName}</Text>
          </View>
        ))} */}
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
