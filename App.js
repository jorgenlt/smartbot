import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'
import { store, persistor } from './src/app/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { StatusBar } from 'expo-status-bar'
import { Text, TouchableOpacity } from 'react-native'
import Chat from './src/features/chat/Chat'
import ChatList from './src/features/chat/ChatList'
import Settings from './src/components/Settings'
import NewChat from './src/features/chat/NewChat'
import { colors, navTheme } from './src/styles/colors'

// Navigation
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar 
        backgroundColor={colors.statusBarBackgroundColor} 
        barStyle={colors.statusBarColor} 
      />
      <PersistGate 
        loading={<Text>Loading...</Text>} 
        persistor={persistor} 
      >
        <NavigationContainer theme={navTheme} >
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarShowLabel: false,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'Chat') {
                  iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
                } else if (route.name === 'ChatList') {
                  iconName = focused ? 'list' : 'list-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                } else if (route.name === 'NewChat') {
                  iconName = focused ? 'add' : 'add-outline';
                }

                return <Ionicons name={iconName} size={size} color={colors.navIcons} />;
              },
              tabBarActiveTintColor: colors.tabBarActiveTintColor,
              tabBarInactiveTintColor: colors.tabBarInactiveTintColor,
            })}
          >
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="ChatList" component={ChatList} />
            <Tab.Screen name="NewChat" component={NewChat}/>
            <Tab.Screen name="Settings" component={Settings} />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
