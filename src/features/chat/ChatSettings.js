import { StyleSheet, View, Alert } from "react-native";
import Setting from "../../components/Setting";
import { resetProviders } from "./chatSlice";
import { useDispatch } from "react-redux";

const ChatSettings = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleResetProviders = () => {
    Alert.alert(
      "Reset to default providers settings?",
      "This will delete saved keys and chosen provider/model.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: () => {
            dispatch(resetProviders());
            Alert.alert("", "Provider settings was set to default");
          },
        },
      ]
    );
  };

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
      <Setting
        onPress={() => navigation.navigate("Mistral")}
        name="Mistral"
        submenu={true}
      />
      <Setting onPress={handleResetProviders} name="Reset to default" />
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
