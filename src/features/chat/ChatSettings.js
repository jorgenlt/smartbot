import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { colors } from "../../styles/colors";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const ChatSettings = ({ navigation }) => {
  const keys = useSelector(state => state.chat.keys);

  const dispatch = useDispatch();

  const PressableSetting = ({onPress, iconName, text, IconComponent}) => (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: colors.sec,
        foreground: true,
      }}
      style={styles.pressable}
    >
      {/* <IconComponent name={iconName} size={40} color={colors.black} /> */}
      <Text style={styles.pressableText}>{text}</Text>
    </Pressable>
  );

  return (
    <View style={styles.settingsWrapper}>

      <PressableSetting 
        onPress={() => navigation.navigate("OpenAI")}
        text="OpenAI"
      />

      <PressableSetting 
        onPress={() => console.log("anthropic")}
        text="Anthropic"
      />

      <Text>OpenAI</Text>
      <Text>Key: {keys.openAi ? keys.openAi : "Key not set."}</Text>
      <Text>Anthropic</Text>
      <Text>Key: {keys.anthropic ? keys.anthropic : "Key not set."}</Text>
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
