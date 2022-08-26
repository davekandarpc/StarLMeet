import {StyleSheet, Dimensions} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {colors} from '../../common/colors';
export const styles = StyleSheet.create({

  textInputContainer: {
    fontSize: 14,
    color: colors.primaryTextColor,
    paddingHorizontal: 10,
  },
  searchBarContainer: {
    height: 50,
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'grey',
  },
  searchIconContainer: {
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:3
  },
});