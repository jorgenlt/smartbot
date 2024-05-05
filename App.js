import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { store, persistor } from "./src/app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import Chat from "./src/features/chat/Chat";
import Conversations from "./src/features/chat/Conversations";
import Settings from "./src/components/Settings";
import ChatSettings from "./src/features/chat/ChatSettings";
import NewChat from "./src/features/chat/NewChat";
import ChatSettingsProvider from "./src/features/chat/ChatSettingsProvider";
import { colors, navTheme, base } from "./src/styles/colors";

// Navigation
const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();

const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SettingsStack.Screen
        name="Main"
        component={Settings}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        name="Chat Settings"
        component={ChatSettings}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        name="OpenAI"
        component={ChatSettingsProvider}
        initialParams={{ name: "OpenAI", provider: "openAi" }}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        name="Anthropic"
        component={ChatSettingsProvider}
        initialParams={{ name: "Anthropic", provider: "anthropic" }}
      ></SettingsStack.Screen>
    </SettingsStack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar
        backgroundColor={base.statusBarBg}
        // barStyle='light-content'
        style="light"
      />
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <NavigationContainer theme={navTheme}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: true,
              tabBarShowLabel: true,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "Chat") {
                  iconName = focused
                    ? "chatbox-ellipses"
                    : "chatbox-ellipses-outline";
                } else if (route.name === "Conversations") {
                  iconName = focused ? "list" : "list-outline";
                } else if (route.name === "Settings") {
                  iconName = focused ? "settings" : "settings-outline";
                } else if (route.name === "New Chat") {
                  iconName = focused ? "add" : "add-outline";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: navTheme.tabBarActiveTintColor,
              tabBarInactiveTintColor: navTheme.tabBarInactiveTintColor,
            })}
          >
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="Conversations" component={Conversations} />
            <Tab.Screen name="New Chat" component={NewChat} />
            <Tab.Screen name="Settings" component={SettingsStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
