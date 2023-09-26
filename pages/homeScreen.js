import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import { firebase } from "../config";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ClearFoodCart } from "../redux/actions/actionTypes";
import ProgressBar from "react-native-progress/Bar";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [totalCarbs, setTotalCarbs] = useState([]);
  const [carbsConsumed, setCarbsConsumed] = useState(0);
  const totalCarbsGoal = 150;

  // Get the current date
  const currentDate = new Date();

  // Extract the individual components of the date
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const day = currentDate.getDate();

  // Format the date string
  const formattedDate = `${day}/${month}/${year}`;

  // This is called every time user's lands on Home Screen
  useFocusEffect(
    React.useCallback(() => {
      // Code to be executed when the screen gains focus
      const user = firebase.auth().currentUser;
      dispatch(ClearFoodCart());
      getCarbsDetails(user?.uid);
    }, [])
  );

  useEffect(() => {
    let count = 0;
    count = count + getTotalCarbsNum("Breakfast");
    getTotalCarbsNum("Lunch") + getTotalCarbsNum("Dinner");
    setCarbsConsumed(count);
  }, [totalCarbs]);

  const addFoodLog = (tag) => {
    navigation.navigate("ViewFoodItem", {
      tag: tag,
    });
  };

  const getCarbsDetails = async (user) => {
    let params = {
      userId: user ? user : "GNpgaWPeOGZBsSDxf23lrDnCGUt2", // static for now , fiberbase error
    };
    await axios
      .get(
        `https://diabeticapp-backend.onrender.com/api/homeScreenCarbDetails?userId=${params.userId}`
      )
      .then((res) => {
        console.log("Data:", res);
        setTotalCarbs(res.data?.length > 0 ? res?.data : []);
      })
      .catch((e) => {
        console.log("Error : ", e);
      });
  };

  useEffect(() => {
    const user = firebase.auth().currentUser;
    const fetchUserData = async () => {
      if (user) {
        const uid = user.uid;
        console.log("UIDD :", uid);
        const userDocRef = firebase.firestore().collection("users").doc(uid);
        const userProfRef = firebase
          .firestore()
          .collection("userProfile")
          .doc(uid);

        const userDoc = await userDocRef.get();
        const userProf = await userProfRef.get();

        if (userDoc.exists) {
          const user = { uid };
          dispatch({ type: "Login", payload: user });
          const userData = userDoc.data();
          dispatch({
            type: "userData",
            payload: { userData },
          });
        } else {
        }

        if (userProf.exists) {
          const userProfData = userProf.data();
          dispatch({
            type: "userProfileData",
            payload: { userProfData },
          });
        } else {
          console.log("User Prof data data not found.");
        }
      }
    };

    fetchUserData();
    getCarbsDetails(user?.uid);
  }, []);

  const getTotalCarbsNum = (tag) => {
    let carbs = totalCarbs?.find((x) => x.mealType == tag)?.totalCarbs;
    return Number(carbs > 0 ? carbs?.toFixed(2) : 0);
  };

  const getProgressBarPercentage = () => {
    return carbsConsumed > 0 && totalCarbsGoal > 0
      ? carbsConsumed / totalCarbsGoal
      : 0;
  };

  const progressColor = "#1356ba";
  const backgroundColor = "#454241";

  const MealButton = ({ mealType }) => {
    return (
      <Button
        mode="contained"
        onPress={() => addFoodLog(mealType)}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        <View>
          <Text style={styles.mealTypeText}>Add {mealType}</Text>
          <Text style={styles.carbsText}>
            Carbs Consumed - {getTotalCarbsNum(mealType)}g
          </Text>
        </View>
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>Today</Text>
      <Text style={styles.date}>{formattedDate}</Text>
      <View style={{ marginBottom: 20 }}>
        <ProgressBar
          progress={getProgressBarPercentage()}
          width={200}
          height={50}
          color={progressColor}
          unfilledColor={backgroundColor}
          borderWidth={0}
        />
        <Text
          style={{
            alignSelf: "center",
            padding: 5,
          }}
        >
          CARBS : {carbsConsumed}/{totalCarbsGoal}
        </Text>
      </View>
      <View style={styles.buttoncontainer}>
        <MealButton mealType="Breakfast" />
        <MealButton mealType="Lunch" />
        <MealButton mealType="Dinner" />
      </View>
      <View
        style={{
          position: "absolute",
          margin: 16,
          bottom: 100,
        }}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "10%",
    padding: 16,
    backgroundColor: "",
  },
  cycleContainer: {
    marginBottom: "10%",
  },
  cycle: {
    width: 200,
    height: 200,
    borderRadius: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cycleProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "#1e90ff",
    opacity: 0.7,
    transformOrigin: "center center",
  },
  cycleText: {
    fontSize: 18,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -9 }],
    color: "black",
  },
  breakfastButton: {
    backgroundColor: "#008b8b",
  },
  lunchButton: {
    backgroundColor: "#4CAF50",
  },
  dinnerButton: {
    backgroundColor: "#2f4f4f",
  },
  snackButton: {
    backgroundColor: "#6a5acd",
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  buttonContent: {
    flexDirection: "row",
    width: 250,
    height: 80,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  mealTypeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  carbsText: {
    fontSize: 14,
    color: "white",
  },
  buttoncontainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
  },
  dateText: {
    textDecorationLine: "underline",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    fontSize: 24,
    paddingBottom: 20,
    fontWeight: "bold",
    color: "#2196F3", // Customize the color to your preference
  },
});

export default HomeScreen;
