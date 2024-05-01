import { StyleSheet, Text, View, Pressable } from "react-native";
import { colors } from "../styles/colors";
import { AntDesign } from "@expo/vector-icons";

const Setting = ({
  onPress,
  iconName,
  name,
  IconComponent,
  submenu,
  settingValue,
}) => {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: colors.sec,
        foreground: true,
      }}
      style={styles.setting}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {IconComponent && (
          <IconComponent name={iconName} size={40} color={colors.black} />
        )}
        <Text style={styles.setting.name}>{name}</Text>
      </View>
      {submenu && (
        <View>
          <AntDesign name="right" size={20} color={colors.gray} />
        </View>
      )}
      {settingValue && (
        <View>
          <Text style={styles.setting.settingValue}>{settingValue}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default Setting;

const styles = StyleSheet.create({
  settingsWrapper: {
    flex: 1,
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    name: {
      fontSize: 20,
      fontWeight: 600,
      marginLeft: 20,
      fontWeight: "normal",
    },
    settingValue: {
      color: colors.gray,
    },
  },
  pressableSubmenu: {
    fontSize: 20,
    color: colors.gray,
  },
});
