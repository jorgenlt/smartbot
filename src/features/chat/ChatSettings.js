import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { colors } from "../../styles/colors";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const ChatSettings = () => {
  const dispatch = useDispatch();

  return (
    <View style={styles.settingsWrapper}>
      <Text>Change provider/model/key</Text>
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
