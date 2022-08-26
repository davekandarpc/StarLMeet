import {StyleSheet, Dimensions} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {colors} from '../../common/colors';
export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 25,
    borderWidth: 1,
    color: colors.primaryTextColor,
  },
});
