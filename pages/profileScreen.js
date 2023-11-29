import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { TextInput, Button, Title, Subheading } from "react-native-paper";
import { useDispatch } from "react-redux";
import { firebase } from "../config";
import { TimePickerModal } from "react-native-paper-dates";
import { useIsFocused } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const ProfileScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  const [userStateData, setUserStateData] = useState({});
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [bloodGlucoseRange, setBloodGlucoseRange] = useState("");
  const [targetBloodGlucose, setTargetBloodGlucose] = useState("");
  const [breakfastStartHour, setBreakfastStartHour] = useState({});
  const [breakfastEndHour, setBreakfastEndHour] = useState({});
  const [lunchStartHour, setLunchStartHour] = useState({});
  const [lunchEndHour, setLunchEndHour] = useState({});
  const [dinnerStartHour, setDinnerStartHour] = useState({});
  const [dinnerEndHour, setDinnerEndHour] = useState({});
  const [bfICR, setBfICR] = useState("");
  const [lhICR, setLhICR] = useState("");
  const [dnICR, setDnICR] = useState("");
  const [crr, setCRR] = useState("");

  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [visibleBFS, setVisibleBFS] = useState(false);
  const [visibleBFE, setVisibleBFE] = useState(false);

  const [visibleLHS, setVisibleLHS] = useState(false);
  const [visibleLHE, setVisibleLHE] = useState(false);

  const [visibleDNS, setVisibleDNS] = useState(false);
  const [visibleDNE, setVisibleDNE] = useState(false);

  const onDismiss = React.useCallback(() => {
    setVisibleBFS(false);
    setVisibleLHS(false);
    setVisibleDNS(false);
    setVisibleBFE(false);
    setVisibleLHE(false);
    setVisibleDNE(false);
  }, [
    setVisibleBFS,
    setVisibleLHS,
    setVisibleDNS,
    setVisibleBFE,
    setVisibleLHE,
    setVisibleDNE,
  ]);

  const getMealAndTime = ({ hours, minutes }) => {
    console.log("Confirm Meal :", selectedMeal, selectedTime, hours, minutes);
    if (selectedMeal == "BF" && selectedTime == "start") {
      console.log("Into BF STAR");
      setBreakfastStartHour({ hours, minutes });
    } else if (selectedMeal == "BF" && selectedTime == "End") {
      setBreakfastEndHour({ hours, minutes });
    } else if (selectedMeal == "LH" && selectedTime == "start") {
      setLunchStartHour({ hours, minutes });
    } else if (selectedMeal == "LH" && selectedTime == "End") {
      setLunchEndHour({ hours, minutes });
    } else if (selectedMeal == "DN" && selectedTime == "start") {
      setDinnerStartHour({ hours, minutes });
    } else if (selectedMeal == "DN" && selectedTime == "End") {
      setDinnerEndHour({ hours, minutes });
    }
  };

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      if (selectedMeal === "BF" && selectedTime === "start") {
        setVisibleBFS(false);
      } else if (selectedMeal === "BF" && selectedTime === "End") {
        setVisibleBFE(false);
      } else if (selectedMeal === "LH" && selectedTime === "start") {
        setVisibleLHS(false);
      } else if (selectedMeal === "LH" && selectedTime === "End") {
        setVisibleLHE(false);
      } else if (selectedMeal === "DN" && selectedTime === "start") {
        setVisibleDNS(false);
      } else if (selectedMeal === "DN" && selectedTime === "End") {
        setVisibleDNE(false);
      }
      console.log("Yo :", selectedMeal);
      getMealAndTime({ hours, minutes });

      console.log({ hours, minutes });
    },
    [selectedMeal, selectedTime]
  );

  const handlePickerOpen = (e, v) => {
    console.log("Handle Open :", e, v);
    setSelectedMeal(e);
    setSelectedTime(v);
    if (e === "BF" && v === "start") {
      setVisibleBFS(true);
    } else if (e === "BF" && v === "End") {
      setVisibleBFE(true);
    } else if (e === "LH" && v === "start") {
      setVisibleLHS(true);
    } else if (e === "LH" && v === "End") {
      setVisibleLHE(true);
    } else if (e === "DN" && v === "start") {
      setVisibleDNS(true);
    } else if (e === "DN" && v === "End") {
      setVisibleDNE(true);
    }
  };
  console.log("Selec Meal :", selectedMeal, selectedTime);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      const fetchUserData = async () => {
        const user = firebase.auth().currentUser;

        if (user) {
          const userId = user.uid;
          const userDocRef = firebase
            .firestore()
            .collection("users")
            .doc(userId);
          const userProfRef = firebase
            .firestore()
            .collection("userProfile")
            .doc(userId);

          const userDoc = await userDocRef.get();
          const userProf = await userProfRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserStateData(userData);
            dispatch({
              type: "userData",
              payload: { userData },
            });
          } else {
            console.log("User data not found.");
          }

          if (userProf.exists) {
            const userProfData = userProf.data();
            setWeight(userProfData.weight);
            setHeight(userProfData.height);
            setAge(userProfData.age);
            setBloodGlucoseRange(userProfData.bloodGlucoseRange);
            setTargetBloodGlucose(userProfData.targetBloodGlucose);
            setBreakfastStartHour(userProfData.breakfastStartHour);
            setBreakfastEndHour(userProfData.breakfastEndHour);
            setLunchStartHour(userProfData.lunchStartHour);
            setLunchEndHour(userProfData.lunchEndHour);
            setDinnerStartHour(userProfData.dinnerStartHour);
            setDinnerEndHour(userProfData.dinnerEndHour);
            setBfICR(userProfData.bfICR);
            setLhICR(userProfData.lhICR);
            setDnICR(userProfData.dnICR);
            setCRR(userProfData.crr);
          } else {
            console.log("User profile data not found.");
          }
        } else {
          console.log("No user is currently logged in.");
        }
      };
      fetchUserData();
    }
  }, [isFocused]);

  const [next, setNext] = useState(false);
  const handleNext = () => {
    console.log("Next");
    setNext(!next);
  };

  const handleSubmit = async () => {
    try {
      const user = firebase.auth().currentUser;

      if (user) {
        const userId = user.uid;
        const userDocRef = firebase
          .firestore()
          .collection("userProfile")
          .doc(userId);

        const data = {
          weight,
          height,
          age,
          bloodGlucoseRange,
          targetBloodGlucose,
          breakfastStartHour,
          breakfastEndHour,
          lunchStartHour,
          lunchEndHour,
          dinnerStartHour,
          dinnerEndHour,
          bfICR,
          lhICR,
          dnICR,
          crr,
        };

        await userDocRef.set(data, { merge: true });
        console.log("Data to Deliver :", data);
        alert("Updated successfully");
        navigation.navigate("Home");
      } else {
        console.log("No user is currently logged in.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}>

    
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        {next ? (
          <View style={styles.formContainer}>
            <TextInput
              label="Enter Breakfast ICR"
              value={bfICR}
              style={styles.input}
              onChangeText={(e) => setBfICR(e)}
              keyboardType="numeric"
            />
            <TextInput
              label="Enter Lunch ICR"
              value={lhICR}
              style={styles.input}
              onChangeText={(e) => setLhICR(e)}
              keyboardType="numeric"
            />
            <TextInput
              label="Enter Dinner ICR"
              value={dnICR}
              style={styles.input}
              onChangeText={(e) => setDnICR(e)}
              keyboardType="numeric"
            />
            <TextInput
              label="Enter Correction Ratio"
              value={crr}
              style={styles.input}
              onChangeText={(e) => setCRR(e)}
              keyboardType="numeric"
            />
            <Button
              mode="contained"
              style={styles.button}
              contentStyle={styles.buttonContent}
              onPress={handleNext}
            >
              Back
            </Button>
            <View style={styles.buttonContaier}>
              <Button
                mode="contained"
                style={styles.button}
                onPress={handleSubmit}
                contentStyle={styles.buttonContent}
                disabled={!bfICR || !lhICR || !dnICR || !crr}
              >
                Submit
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Title
              style={styles.title}
            >{`${userStateData?.firstName} ${userStateData?.lastName}`}</Title>
            <Subheading style={styles.subheading}>
              {userStateData?.email}
            </Subheading>
            <TextInput
              label="Enter Weight (kg)"
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <TextInput
              label="Enter Height (cm)"
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
            <TextInput
              label="Enter Age"
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <TextInput
              label="Enter your blood glucose range(a-b)"
              style={styles.input}
              value={bloodGlucoseRange}
              onChangeText={setBloodGlucoseRange}
              keyboardType="text"
            />
            <TextInput
              label="Enter your target blood glucose"
              value={targetBloodGlucose}
              style={styles.input}
              onChangeText={(e) => setTargetBloodGlucose(e)}
              keyboardType="numeric"
            />
            <View style={styles.hoursContainer}>
              <View style={styles.hoursRow}>
                <View
                  style={{
                    justifyContent: "center",
                    flex: 1,
                    alignItems: "center",
                  }}
                ></View>
                <Button
                  onPress={() => handlePickerOpen("BF", "start")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Breakfast Start Hour
                </Button>
                <TimePickerModal
                  visible={visibleBFS}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={breakfastStartHour.hours}
                  minutes={breakfastStartHour.minutes}
                  use24HourClock="true"
                />
                <Button
                  onPress={() => handlePickerOpen("BF", "End")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Breakfast End Hour
                </Button>
                <TimePickerModal
                  visible={visibleBFE}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={breakfastEndHour.hours}
                  minutes={breakfastEndHour.minutes}
                  use24HourClock="true"
                />
              </View>
              <View style={styles.hoursRow}>
                <Button
                  onPress={() => handlePickerOpen("LH", "start")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Lunch Start Hour
                </Button>
                <TimePickerModal
                  visible={visibleLHS}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={lunchStartHour.hours}
                  minutes={lunchStartHour.minutes}
                  use24HourClock="true"
                />
                <Button
                  onPress={() => handlePickerOpen("LH", "End")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Lunch End Hour
                </Button>
                <TimePickerModal
                  visible={visibleLHE}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={lunchEndHour.hours}
                  minutes={lunchEndHour.minutes}
                  use24HourClock="true"
                />
              </View>
              <View style={styles.hoursRow}>
                <Button
                  onPress={() => handlePickerOpen("DN", "start")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Dinner Start Hour
                </Button>
                <TimePickerModal
                  visible={visibleDNS}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={dinnerStartHour.hours}
                  minutes={lunchEndHour.minutes}
                  use24HourClock="true"
                />
                <Button
                  onPress={() => handlePickerOpen("DN", "End")}
                  uppercase={false}
                  mode="outlined"
                  style={styles.halfWidthInput}
                >
                  Dinner End Hour
                </Button>
                <TimePickerModal
                  visible={visibleDNE}
                  onDismiss={onDismiss}
                  onConfirm={onConfirm}
                  hours={dinnerEndHour.hours}
                  minutes={dinnerEndHour.minutes}
                  use24HourClock="true"
                />
              </View>
            </View>
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleNext}
              contentStyle={styles.buttonContent}
              disabled={
                !weight ||
                !height ||
                !age ||
                !bloodGlucoseRange ||
                !targetBloodGlucose ||
                !breakfastStartHour ||
                !breakfastEndHour ||
                !lunchStartHour ||
                !lunchEndHour ||
                !dinnerStartHour ||
                !dinnerEndHour
              }
            >
              Next
            </Button>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>

    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    color: "#a6e4d0",
  },
  buttonContent: {
    height: 50,
    width: 340,
  },
  buttonContaier: {
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
  },
  subheading: {
    fontSize: 15,
    marginBottom: 32,
  },
  hoursContainer: {
    width: "100%",
  },
  hoursRow: {
    flexDirection: "row",
  },
  halfWidthInput: {
    width: "49%",
    marginBottom: 10,
    marginEnd: 10,
  },
});

export default ProfileScreen;
