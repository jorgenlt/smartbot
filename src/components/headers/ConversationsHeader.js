import { Text, StyleSheet, View, Pressable } from "react-native";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { colors } from "../../styles/colors";
import { FontAwesome } from "@expo/vector-icons";

const ConversationsHeader = ({ title, onPress }) => {
  const theme = useSelector((state) => state.chat.theme);
  const styles = useMemo(() => styling(theme), [theme]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>{title}</Text>
      </View>
      <Pressable onPress={onPress}>
        <FontAwesome name="filter" size={24} color={colors[theme].white} />
      </Pressable>
    </View>
  );
};

export default ConversationsHeader;

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
