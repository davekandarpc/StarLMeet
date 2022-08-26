import { StyleSheet, Dimensions } from "react-native";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import { colors } from "../../common/colors";
export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
  },
  textInputContainer: {
    height: 50,
    borderColor: "grey",
    borderWidth: 1,
    margin: 10,
    fontSize: 14,
    borderRadius: 6,
    color: colors.primaryTextColor,
    paddingHorizontal: 10,
  },
  button: {
    marginBottom: 30,
    alignItems: "center",
    backgroundColor: colors.primaryColor,
    marginTop: 45,
    borderRadius: 10,
  },
  buttonText: {
    padding: 20,
    color: "white",
    fontSize: 18,
  },
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
