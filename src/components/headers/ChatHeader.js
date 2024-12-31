import { Text, StyleSheet, View } from "react-native";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { colors } from "../../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChatHeader = () => {
  const theme = useSelector((state) => state.chat.theme);
  const styles = useMemo(() => styling(theme), [theme]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Chat</Text>
      </View>
      <View>
        <Ionicons name="share-social" size={24} color="white" />
      </View>
    </View>
  );
};

export default ChatHeader;

const styling = (theme) =>
  StyleSheet.create({
    container: {
      height: 80,
      paddingTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
      backgroundColor: colors[theme].black,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    text: {
      color: colors[theme].white,
      fontSize: 20,
      fontWeight: "500",
    },
  });
