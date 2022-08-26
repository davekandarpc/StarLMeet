import {StyleSheet, Dimensions} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {colors} from '../../common/colors';
export const styles = StyleSheet.create({
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: colors.primaryTextColor,
      },
  itemCardContainer: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 2,
    marginRight: 2,
  },
  subCardView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.history_back,
    borderColor: colors.color_eeeeee,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle:{
      height:'100%', 
      width:'100%',
      borderRadius: 25
    },
    textStyle:{
        fontSize: 14,
        color: colors.black,
        fontWeight: 'bold',
        textTransform: 'capitalize',
      },
      subTextContainer:{
        marginTop: 4,
        borderWidth: 0,
        width: '85%',
      },
      subTextStyle:{
        color: colors.gray,
        fontSize: 12,
      },
      active:{
        height: 15,
        backgroundColor: colors.active,
        borderWidth: 0,
        width: 15,
        marginLeft: -26,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
      },
      inActive:{
        height: 15,
        backgroundColor: colors.gray,
        borderWidth: 0,
        width: 15,
        marginLeft: -26,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
      }

});