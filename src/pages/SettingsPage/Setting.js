import { StyleSheet, Text, View, Pressable, Switch } from "react-native";
import { colors } from "../../styles/colors";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const Setting = ({
  onPress,
  iconName,
  name,
  IconComponent,
  submenu,
  settingValue,
  switchButton,
  onSwitchButtonPress,
  switchValue,
}) => {
  const theme = useSelector((state) => state.chat.theme);

  const styles = useMemo(() => styling(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      android_ripple={
        switchButton
          ? {}
          : {
              color: colors[theme].sec,
              foreground: true,
            }
      }
      style={styles.setting}
    >
      <View style={styles.setting.name}>
        {IconComponent && (
          <View style={styles.setting.icon}>
            <IconComponent
              name={iconName}
              size={40}
              color={colors[theme].icon}
            />
          </View>
        )}
        <Text style={styles.setting.name.text}>{name}</Text>
      </View>
      {submenu && (
        <View>
          <AntDesign name="right" size={20} color={colors[theme].gray} />
        </View>
      )}
      {settingValue && (
        <View>
          <Text style={styles.setting.settingValue}>{settingValue}</Text>
        </View>
      )}
      {switchButton && (
        <View>
          <Switch
            trackColor={{ false: "#767577", true: colors[theme].secDarker }}
            thumbColor={
              switchValue ? colors[theme].white : colors[theme].lightGray
            }
            ios_backgroundColor="#3e3e3e"
            onValueChange={onSwitchButtonPress}
            value={switchValue}
          />
        </View>
      )}
    </Pressable>
  );
};

export default Setting;

const styling = (theme) =>
  StyleSheet.create({
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
        flexDirection: "row",
        alignItems: "center",
        text: {
          fontSize: 20,
          fontWeight: 600,
          fontWeight: "normal",
          color: colors[theme].text,
        },
      },
      settingValue: {
        color: colors[theme].gray,
      },
      icon: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
      },
    },
    pressableSubmenu: {
      fontSize: 20,
      color: colors[theme].gray,
    },
  });
