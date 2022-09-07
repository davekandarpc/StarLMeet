import * as React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";
import ChatScreen from "../screens/ChatScreen";
import MusicScreen from "../screens/MusicScreen";
import DemoLoginScreen from "../screens/CallingScreen/LoginScreen";
import VideoLoginScreen from "../screens/VideoCallScreen/LoginScreen";
import VideoCallScreen from "../screens/VideoCallScreen/CallScreen";
import VideoCallingScreen from "../screens/VideoCallScreen/CallingScreen";
import VideoContactsScreen from "../screens/VideoCallScreen/ContactsScreen";
import VideoIncomingCallScreen from "../screens/VideoCallScreen/IncomingCallScreen";

import { colors } from "../common/colors";
import MaterialIcon from "react-native-vector-icons/AntDesign";
import { navigationRef } from "./../utils/RootNavigation";
import notifee from "@notifee/react-native";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
function ChatStack() {
  return (
    <Stack.Navigator
      initialRouteName="Chat"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
function VideoChatStack() {
  return (
    <Stack.Navigator
      initialRouteName="VideoLoginScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="VideoLoginScreen"
        component={VideoLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoCallScreen"
        component={VideoCallScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoCallingScreen"
        component={VideoCallingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoContactsScreen"
        component={VideoContactsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoIncomingCallScreen"
        component={VideoIncomingCallScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
function TabStack() {
  return (
    <Tab.Navigator initialRouteName="HomeStack">
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: () => {
            return null;
          },
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcon
              name="contacts"
              size={20}
              color={focused ? "red" : "grey"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: () => {
            return null;
          },
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcon
              name="setting"
              size={20}
              color={focused ? "red" : "grey"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const handleAndroidOffAppInteraction = (response) => {
  console.log("in Navigation ", response);
};
const Navigaion = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Music"
          component={MusicScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tabStck"
          options={{ headerShown: false }}
          component={TabStack}
        />
        <Stack.Screen
          name="chatStack"
          options={{ headerShown: false }}
          component={ChatStack}
        />
        <Stack.Screen
          name="VideoChatStack"
          options={{ headerShown: false }}
          component={VideoChatStack}
        />
        <Stack.Screen
          name="VideoCallScreen"
          component={VideoCallScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoCallingScreen"
          component={VideoCallingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoContactsScreen"
          component={VideoContactsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoIncomingCallScreen"
          component={VideoIncomingCallScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigaion;
