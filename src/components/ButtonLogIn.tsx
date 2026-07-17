import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../theme/Colors";

function ButtonLogIn() {
  return (
    <TouchableOpacity style={[styles.button]}>
      <Text>Login</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.greenSages,
    borderRadius: 8,
  },
});

export default ButtonLogIn;
