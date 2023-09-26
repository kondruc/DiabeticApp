import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Onboarding from "react-native-onboarding-swiper";
import { useSelector, useDispatch } from "react-redux";

const UserOnboardingScreen = ({ navigation }) => {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  console.log("Selector : ", userState);

  const renderFirstPage = () => (
    <View style={styles.pageContainer}>
      <Image source={require("../../assets/icon.png")} style={styles.image} />
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>
        Welcome to the first slide of the Onboarding Swiper.
      </Text>
      <TextInput
        label="Age"
        value={age}
        onChangeText={setAge}
        style={styles.input}
      />
      <TextInput
        label="Weight"
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
      />
      <TextInput
        label="Height"
        value={height}
        onChangeText={setHeight}
        style={styles.input}
      />
    </View>
  );

  return (
    <Onboarding
      pages={[
        {
          backgroundColor: "#a6e4d0",

          image: (
            <Image
              source={require("../../assets/icon.png")}
              style={styles.image}
            />
          ),

          title: "Welcome",
          subtitle: "Welcome to the first slide of the Onboarding Swiper.",
          Component: () => renderFirstPage,
        },
        {
          backgroundColor: "#fdeb93",

          image: (
            <Image
              source={require("../../assets/icon.png")}
              style={styles.image}
            />
          ),

          title: "Explore",
          subtitle: "This is the second slide of the Onboarding Swiper.",
        },
        {
          backgroundColor: "#e9bcbe",

          image: (
            <Image
              source={require("../../assets/icon.png")}
              style={styles.image}
            />
          ),

          title: "All Done",
          subtitle: "This is the Third slide of the Onboarding Swiper.",
        },
      ]}
      onDone={() => navigation.navigate("userInfo")}
      onSkip={() =>
        // dispatch({
        //   type: "UpdateUserFlag",
        //   payload: { ...userState, isFirstTimeLogin: false },
        // })
        navigation.navigate("userInfo")
      }
    />
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    width: "100%",
  },
});

export default UserOnboardingScreen;
