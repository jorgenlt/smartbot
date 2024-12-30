import { Text, StyleSheet, View } from "react-native";
import { colors } from "../../styles/colors";

const Header = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>ChatHeader</Text>
      </View>
      <View>
        <Text style={styles.text}>Share</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 80,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 10,
    width: "100%",
    backgroundColor: colors.light.black,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
