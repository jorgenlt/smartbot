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
import ProvidersSettings from "./src/pages/SettingsPage/ProvidersSettings";
import ConversationsSettings from "./src/pages/SettingsPage/ConversationsSettings";
import NewConversation from "./src/features/chat/NewConversation";
import ProviderSettings from "./src/pages/SettingsPage/ProviderSettings";
import { colors, navTheme } from "./src/styles/colors";

// Navigation
const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const ConversationsStack = createNativeStackNavigator();

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
        name="ProvidersSettings"
        component={ProvidersSettings}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        name="OpenAI"
        component={ProviderSettings}
        initialParams={{ name: "OpenAI", provider: "openAi" }}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        name="Anthropic"
        component={ProviderSettings}
        initialParams={{ name: "Anthropic", provider: "anthropic" }}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        name="Mistral"
        component={ProviderSettings}
        initialParams={{ name: "Mistral", provider: "mistral" }}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        name="ConversationsSettings"
        component={ConversationsSettings}
      ></SettingsStack.Screen>
    </SettingsStack.Navigator>
  );
};

const ConversationsStackScreen = () => {
  return (
    <ConversationsStack.Navigator screenOptions={{ headerShown: false }}>
      <ConversationsStack.Screen
        name="ConversationsPage"
        component={ConversationsPage}
      />
      <ConversationsStack.Screen name="ChatPage" component={ChatPage} />
    </ConversationsStack.Navigator>
  );
};

const MainApp = () => {
  const theme = useSelector((state) => state.chat.theme);

  const getIconName = (routeName, focused) => {
    const icons = {
      Chats: focused ? "chatbox-ellipses" : "chatbox-ellipses-outline",
      Settings: focused ? "settings" : "settings-outline",
      "New Chat": focused ? "add" : "add-outline",
    };
    return icons[routeName];
  };

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
                const iconName = getIconName(route.name, focused);
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: navTheme[theme].tabBarActiveTintColor,
              tabBarInactiveTintColor: navTheme[theme].tabBarInactiveTintColor,
            })}
          >
            <Tab.Screen name="Chats" component={ConversationsStackScreen} />
            <Tab.Screen name="New Chat" component={NewConversation} />
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
