import { StyleSheet, Dimensions } from "react-native";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import { colors } from "../../common/colors";
export const styles = StyleSheet.create({
  mainContainer: {
    height: 90,
    flexDirection: "row",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 3,
    backgroundColor: colors.white,
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subTextContainer: {
    marginTop: 4,
    borderWidth: 0,
    width: "85%",
    flexDirection: "row",
  },
  subTextStyle: {
    color: colors.gray,
    fontSize: 12,
    marginLeft: 5,
  },
  active: {
    height: 15,
    backgroundColor: colors.active,
    borderWidth: 0,
    width: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  inActive: {
    height: 15,
    backgroundColor: colors.gray,
    borderWidth: 0,
    width: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
});
