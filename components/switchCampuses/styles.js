import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  buttonLeft: {
    width: "30%",
    bottom: "90%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    overflow: "hidden",
    opacity: 0.6
  },
  buttonRight: {
    width: "30%",
    bottom: "90%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    overflow: "hidden",
    opacity: 0.6
  },
  container: {
    flexDirection: "row",
    position: "absolute",
    justifyContent: "center"
  },
  unPressed: {
    width: "30%",
    bottom: "70%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    overflow: "hidden"
  }
});

export default styles;
