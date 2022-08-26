import React, {useState} from 'react';
import {View,TextInput} from 'react-native';
import { styles } from "./styles";
import Icon from 'react-native-vector-icons/FontAwesome';

export const SearchBar = ({onGetText}) => {
  const [search, setSearch] = useState('');

  const onSearchTextChange=(text)=>{
    setSearch(text)
    onGetText(text)
  }

  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchIconContainer}>
        <Icon name="search" size={20} color="grey" />
      </View>
      <TextInput
        style={styles.textInputContainer}
        onChangeText={onSearchTextChange}
        placeholder="Search..."
        placeholderTextColor={'grey'}
        value={search}
      />
    </View>
  );
};
