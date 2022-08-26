import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";
import ChatScreen from "../screens/ChatScreen";
import DemoLoginScreen from "../screens/CallingScreen/LoginScreen";
import DemoCallScreen from "../screens/CallingScreen/CallScreen";
import { colors } from "../common/colors";
import MaterialIcon from "react-native-vector-icons/AntDesign";

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
const Navigaion = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
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
          name="callScreenLoginDemo"
          options={{ headerShown: false }}
          component={DemoLoginScreen}
        />
        <Stack.Screen
          name="callScreenDemo"
          options={{ headerShown: false }}
          component={DemoCallScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigaion;
