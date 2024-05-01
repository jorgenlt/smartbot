import {
  StyleSheet,
  View,
} from "react-native";
import Setting from "../../components/Setting";

const ChatSettings = ({ navigation }) => {
  return (
    <View style={styles.settingsWrapper}>
      <Setting
        onPress={() => navigation.navigate("OpenAI")}
        name="OpenAI"
        submenu={true}
      />
      <Setting
        onPress={() => navigation.navigate("Anthropic")}
        name="Anthropic"
        submenu={true}
      />
    </View>
  );
};

export default ChatSettings;

const styles = StyleSheet.create({
  settingsWrapper: {
    flex: 1,
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  pressableText: {
    fontSize: 20,
    fontWeight: 600,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
