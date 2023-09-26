import { NavigationContainer } from "@react-navigation/native";
import {
  DrawerContentScrollView,
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { LightTheme } from "../../utils/theme";
import LoginScreen from "../../pages/loginScreen";
import HeaderLogo from "../../ui/headerLogo";
import { firebase } from "../../config";
import React, { useEffect, useState } from "react";
import signupScreen from "../../pages/signupScreen";
import { useSelector } from "react-redux";
import UserOnboardingScreen from "../../pages/onBoarding/userInfo";
import ProfileScreen from "../../pages/profileScreen";
import HistoryScreen from "../../pages/historyScreen";
import HomeNavigation from "./homeNavigation";
import GetUserDetails from "../../pages/onBoarding/getUserDetails";

const Drawer = createDrawerNavigator();

export default function NavigationStack() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const userState = useSelector((state) => state.user);

  function onAuthStateChanged(user) {
    setUser(user);
    if (isLoading) setIsLoading(false);
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return unsubscribe;
  }, [userState]);

  if (isLoading) {
    // Show a loading spinner or splash screen while checking the user's authentication status
    return null;
  }

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          onPress={() => {
            firebase.auth().signOut();
          }}
        />
      </DrawerContentScrollView>
    );
  };

  return (
    <>
      <NavigationContainer theme={LightTheme}>
        {user && user?.emailVerified ? (
          <>
            {userState?.user?.isFirstTimeLogin ? (
              <Drawer.Navigator>
                <Drawer.Screen
                  name="OnBoard"
                  component={UserOnboardingScreen}
                />
                <Drawer.Screen name="userInfo" component={GetUserDetails} />
              </Drawer.Navigator>
            ) : (
              <Drawer.Navigator
                initialRouteName={"Home"}
                drawerContent={(props) => <CustomDrawerContent {...props} />}
              >
                <Drawer.Screen
                  name="Home"
                  component={HomeNavigation}
                  options={{
                    headerShown: false,
                  }}
                />
                <Drawer.Screen name="History" component={HistoryScreen} />
                <Drawer.Screen name="Profile" component={ProfileScreen} />
              </Drawer.Navigator>
            )}
          </>
        ) : (
          <Drawer.Navigator>
            <Drawer.Screen name="Login" component={LoginScreen} />
            <Drawer.Screen name="Signup" component={signupScreen} />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </>
  );
}
