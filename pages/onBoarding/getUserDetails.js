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
import { useSelector, useDispatch } from "react-redux";
import { firebase } from "../../config";
import { TimePickerModal } from "react-native-paper-dates";

const GetUserDetails = ({ navigation }) => {
  const userState = useSelector((state) => state.user);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
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

  useEffect(() => {}, []);

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
        dispatch({
          type: "UpdateUserFlag",
          payload: { ...userState, isFirstTimeLogin: false },
        });
        console.log("Data saved successfully.", data);
        alert("Updated successfully");
      } else {
        console.log("No user is currently logged in.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        {next ? (
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Enter Breakfast ICR"
              value={bfICR}
              style={styles.input}
              onChangeText={(e) => setBfICR(e)}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter Lunch ICR"
              value={lhICR}
              style={styles.input}
              onChangeText={(e) => setLhICR(e)}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter Dinner ICR"
              value={dnICR}
              style={styles.input}
              onChangeText={(e) => setDnICR(e)}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter Correction Ratio"
              value={crr}
              style={styles.input}
              onChangeText={(e) => setCRR(e)}
              keyboardType="numeric"
            />
            <Button mode="contained" style={styles.button} onPress={handleNext}>
              Back
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleSubmit}
              disabled={!bfICR || !lhICR || !dnICR || !crr}
            >
              Submit
            </Button>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Title style={styles.title}>
              Please Fill Out Below Information First
            </Title>
            <TextInput
              placeholder="Enter Weight"
              value={weight}
              style={styles.input}
              onChangeText={(e) => setWeight(e)}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter Height"
              value={height}
              style={styles.input}
              onChangeText={(e) => setHeight(e)}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter Age"
              value={age}
              style={styles.input}
              onChangeText={(e) => setAge(e)}
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
              disabled={
                !weight ||
                !height ||
                !age ||
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
    width: "100%",
    height: 50,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    color: "#a6e4d0",
  },
  buttonContaier: {
    paddingTop: 10,
    width: "100%",
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

export default GetUserDetails;
