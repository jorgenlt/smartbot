import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { store, persistor } from "./src/app/store";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import ChatPage from "./src/pages/ChatPage/ChatPage";
import ConversationsPage from "./src/pages/ConversationsPage/ConversationsPage";
import Settings from "./src/pages/SettingsPage/SettingsPage";
import ChatSettings from "./src/pages/SettingsPage/ChatSettings";
import NewChat from "./src/features/chat/NewChat";
import ChatSettingsProvider from "./src/pages/SettingsPage/ChatSettingsProvider";
import { colors, navTheme } from "./src/styles/colors";

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
      <SettingsStack.Screen
        name="Mistral"
        component={ChatSettingsProvider}
        initialParams={{ name: "Mistral", provider: "mistral" }}
      ></SettingsStack.Screen>
    </SettingsStack.Navigator>
  );
};

const MainApp = () => {
  const theme = useSelector((state) => state.chat.theme);

  return (
    <>
      <StatusBar backgroundColor={colors[theme].statusBarBg} style="light" />
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <NavigationContainer theme={navTheme[theme]}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              headerStyle: {
                borderBottomWidth: 0.2,
              },
              tabBarShowLabel: true,
              tabBarStyle: {
                borderTopWidth: 0.2,
              },
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
              tabBarActiveTintColor: navTheme[theme].tabBarActiveTintColor,
              tabBarInactiveTintColor: navTheme[theme].tabBarInactiveTintColor,
            })}
          >
            <Tab.Screen name="Chat" component={ChatPage} />
            <Tab.Screen name="Conversations" component={ConversationsPage} />
            <Tab.Screen name="New Chat" component={NewChat} />
            <Tab.Screen name="Settings" component={SettingsStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;
