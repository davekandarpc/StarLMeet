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
    marginHorizontal: 10,
    marginBottom: 5,
    fontSize: 14,
    borderRadius: 6,
    color: colors.primaryTextColor,
    paddingHorizontal: 10,
  },

  errorText: {
    marginHorizontal: 10,
    marginBottom: 10,
    color: "red",
  },

  button: {
    alignItems: "center",
    backgroundColor: colors.primaryColor,
    height: 50,
    marginBottom: 30,
    marginTop: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
  },

  buttonText: {
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
