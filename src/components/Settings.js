import {
  StyleSheet,
  View,
  Linking,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { deleteConversations } from "../features/chat/chatSlice";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Setting from "./Setting";

// URLs
const GITHUB_URL = "https://github.com/jorgenlt/smartbot";
const PROJECTS_URL = "https://jorgenlt.no";

const Settings = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleDeleteConversations = () => {
    Alert.alert("Delete all conversations?", 'Choose "Delete" to confirm.', [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          dispatch(deleteConversations());
          Alert.alert("", "All conversations deleted.");
        },
      },
    ]);
  };

  return (
    <View style={styles.settingsWrapper}>
      <Setting
        onPress={() => navigation.navigate("Chat Settings")}
        iconName="rebase-edit"
        name="Change provider/model"
        IconComponent={MaterialIcons}
        submenu={true}
      />
      <Setting
        onPress={handleDeleteConversations}
        iconName="delete"
        name="Delete all conversations"
        IconComponent={MaterialIcons}
        submenu={false}
      />
      <Setting
        onPress={() => Linking.openURL(GITHUB_URL)}
        iconName="github"
        name="Source code"
        IconComponent={AntDesign}
        submenu={false}
      />
      <Setting
        onPress={() => Linking.openURL(PROJECTS_URL)}
        iconName="code"
        name="Other projects"
        IconComponent={MaterialIcons}
        submenu={false}
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  settingsWrapper: {
    flex: 1,
  },
});
