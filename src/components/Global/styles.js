import { StyleSheet, Dimensions } from "react-native";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import { colors } from "../../common/colors";
export const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: 50,
    width: 50,
    flex: 1,
  },
  loaderContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
