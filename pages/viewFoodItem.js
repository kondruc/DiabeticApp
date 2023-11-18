import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  ActivityIndicator,
  Button,
  Divider,
  List,
  Text,
} from "react-native-paper";
import AddCarbsModal from "../ui/addCarbsModel";
import { firebase } from "../config";
import { useIsFocused } from '@react-navigation/native';


const ViewFoodItem = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const user = useSelector((state) => state.user);
  const { tag } = route?.params;
  const [objectId, setObjectId] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [totalCarbs, setTotalCarbs] = useState("");
  const [insulinDose, setInsulinDose] = useState(0);
  const [bloodGlucoseLevel, setBloodGlucoseLevel] = useState(0);
  const [bloodGlucoseLevelBeforeMeal, setBloodGlucoseLevelBeforeMeal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisibleBeforeMeal, setModalVisibleBeforeMeal] = useState(false);
  const [modalVisibleAfterMeal, setModalVisibleAfterMeal] = useState(false);
  const [userICR, setUserICR] = useState("");

  const [userStateData, setUserStateData] = useState({});
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
  const [showSummary, setShowSummary] = useState(false);


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

  const getUpdatedUserICR = async () => {
    console.log("HER: ", user?.user?.uid, tag);
    await axios
      .get("https://diabeticapp-backend-dt6j.onrender.com/api/updateUserICR", {
        params: {
          userId: user?.user?.uid,
          mealType: tag,
        },
      })
      .then((res) => {
        console.log("Res :", res);
        setUserICR(res.data);
      })
      .catch((err) => {
        console.log("Err :", err);
      });
  };

  const getFoodItems = async () => {
    let params = {
      userId: user?.user?.uid,
      mealType: tag,
    };
    setLoading(true);
    await axios
      .get(
        `https://diabeticapp-backend-dt6j.onrender.com/api/getDataByMealType/Date?userId=${params.userId}&mealType=${params.mealType}`
      )
      .then((res) => {
        setLoading(false);
        setFoodItems(res?.data ? res?.data?.mealItems : []);
        setTotalCarbs(res?.data ? res?.data?.totalCarbs : "");
        setInsulinDose(res?.data ? res?.data?.insulinDose : 0);
        setObjectId(res?.data ? res?.data?._id : null);
        setBloodGlucoseLevel(
          res?.data?.bloodGlucoseLevel ? res?.data?.bloodGlucoseLevel : 0
        );
        setBloodGlucoseLevelBeforeMeal(
          res?.data?.bloodGlucoseLevelBeforeMeal ? res?.data?.bloodGlucoseLevelBeforeMeal : 0
        );
        console.log("Data:", res, res?.data ? res?.data?.mealItems : []);
      })
      .catch((e) => {
        setLoading(false);
        console.log("Error : ", e);
      });
  };

  const addBloodGlucose = async (data) => {
    let params = {
      _id: objectId,
      bloodGlucoseLevel: data,
    };
    setLoading(true);
    await axios
      .put(
        `https://diabeticapp-backend-dt6j.onrender.com/api/addBloodGlucose`,
        params
      )
      .then((res) => {
        setLoading(false);
        navigation.goBack();
      })
      .catch((e) => {
        setLoading(false);
        console.log("Error : ", e);
      });
  };

  const addBloodGlucoseBeforeMeal = async (data) => {
    let params = {
      _id: objectId,
      bloodGlucoseLevelBeforeMeal: data,
    };
    setLoading(true);
    await axios
      .put(
        `https://diabeticapp-backend-dt6j.onrender.com/api/addBloodGlucoseBeforeMeal`,
        params
      )
      .then((res) => {
        setLoading(false);
        navigation.goBack();
      })
      .catch((e) => {
        setLoading(false);
        console.log("Error : ", e);
      });
  };

  useEffect(() => {
    getUpdatedUserICR();
    getFoodItems();
  }, []);

  const handleSaveBloodGlucose = (data) => {
    addBloodGlucose(data);
    setModalVisibleAfterMeal(false);
    setBloodGlucoseLevel(data); 
  };

  const handleSaveBloodGlucoseBeforeMeal = (data) => {
    addBloodGlucoseBeforeMeal(data);
    setModalVisibleBeforeMeal(false);
    setBloodGlucoseLevelBeforeMeal(data); 
  };

  const getCarbs = (item) => {
    let carbs = 0;
    carbs = item.foodNutrients.find((y) => {
      return y.number == 205;
    });
    return carbs ? carbs.amount : 0;
  };

  const onAddFood = () => {
    navigation.navigate("FoodSearch", {
      tag: tag,
    });
  };

  const updateUserICR = async () => {
    console.log("Update UserICR");
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = firebase
          .firestore()
          .collection("userProfile")
          .doc(userId);
        let data = {};
        if (tag == "Breakfast") {
          data = {
            bfICR: userICR,
          };
        } else if (tag == "Lunch") {
          data = {
            lhICR: userICR,
          };
        } else {
          data = {
            dnICR: userICR,
          };
        }
        await userDocRef.set(data, { merge: true });
        console.log("Data to Deliver:", data);
        alert("Updated successfully");
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const RightListView = ({ item }) => {
    return (
      <View>
        <Text>Quantity: {item?.count}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showSummary ? (
        <List.Section style={styles.listSection}>
          <List.Subheader>
            {" "}
            <Text style={styles.message}>Today's {tag}</Text>
          </List.Subheader>
          {foodItems?.map((item, index) => (
            <List.Item
              key={index}
              titleEllipsizeMode="tail"
              titleNumberOfLines={5}
              title={item.description}
              description={`Carbs: ${getCarbs(item)}`}
              right={() => <RightListView item={item} />}
            />
          ))}
        </List.Section>
      ) : (
        <View style={styles.emptyCartContainer}>
          {loading ? (
            <ActivityIndicator size="large" style={styles.activityIndicator} />
          ) : (
            <>

              {bloodGlucoseLevelBeforeMeal === 0 && foodItems?.length <= 0 && (
                      <View style={styles.addGlucose}>
                        <TouchableOpacity onPress={() => setModalVisibleBeforeMeal(true)}>
                          <Text style={{ fontSize: 20, color: "#1356ba" }}>
                            Add Blood Glucose Reading Before Meal
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <AddCarbsModal
                      visible={modalVisibleBeforeMeal}
                      placeholder={"Enter Blood-glusoce reading Before Meal"}
                      onDismiss={() => setModalVisible(false)}
                      onSave={handleSaveBloodGlucoseBeforeMeal}
                    />
                    {foodItems.length > 0 &&(
                      <>
                        <Text style={styles.message}>Food is already added. Check summary for more details.</Text>
                      </>
                    )}
              {foodItems.length <= 0 &&(
                <>
                  <Text style={styles.message}>You have no Food Items!!</Text>
                  <Button
                    mode="contained"
                    onPress={onAddFood}
                    style={styles.button}
                  >
                    Add Food Here
                  </Button>
                </>
              )}
              
              <Button
                mode="contained"
                onPress={() => setShowSummary(!showSummary)}
                style={styles.button}
              >
                Summary For Meal
              </Button>
              {/* <Text style={styles.messageICR}>Update Your ICR !!</Text>
              <Button
                mode="contained"
                onPress={updateUserICR}
                style={styles.button}
              >
                {userICR}
              </Button> */}
            </>
          )}
        </View>
      )}
      <Divider />
      {showSummary  ? (
        <View style={styles.view}>
          <Text variant="titleMedium">
            Your ICR as per the records - 
            {bfICR ? ` Breakfast ICR - ${bfICR}` : ''}
            {lhICR ? `, Lunch ICR - ${lhICR}` : ''}
            {dnICR ? `, Dinner ICR - ${dnICR}` : ''}
          </Text>
          <Text variant="titleMedium">
            Total Carbs Consumed - {totalCarbs} g
          </Text>
          {insulinDose > 0 ? (
            <Text variant="titleMedium">
              Total Insulin Dose - {insulinDose} g
            </Text>
          ) : null}
          {bloodGlucoseLevelBeforeMeal > 0 ? (
            <Text variant="titleMedium">
              Total Blood Glucose Level Before Meal - {bloodGlucoseLevelBeforeMeal} g
            </Text>
          ) : null}
          
          {bloodGlucoseLevel > 0 ? (
            <Text variant="titleMedium">
              Total Blood Glucose Level After Meal - {bloodGlucoseLevel} g
            </Text>
          ) : null}

        </View>
      ) : null}
      {/* {bloodGlucoseLevelBeforeMeal === 0 && foodItems?.length > 0 && (
        <View style={styles.addGlucose}>
          <TouchableOpacity onPress={() => setModalVisibleBeforeMeal(true)}>
            <Text style={{ fontSize: 20, color: "#1356ba" }}>
              Add Blood Glucose Reading Before Meal
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <AddCarbsModal
        visible={modalVisibleBeforeMeal}
        placeholder={"Enter Blood-glusoce reading Before Meal"}
        onDismiss={() => setModalVisible(false)}
        onSave={handleSaveBloodGlucoseBeforeMeal}
      /> */}
      
      {bloodGlucoseLevel == 0 && foodItems?.length > 0 ? (
        <View style={styles.addGlucose}>
          <TouchableOpacity onPress={() => setModalVisibleAfterMeal(true)}>
            <Text style={{ fontSize: 20, color: "#1356ba" }}>
              Add Blood Glucose Reading After Meal
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <AddCarbsModal
        visible={modalVisibleAfterMeal}
        placeholder={"Enter Blood-glusoce reading After Meal"}
        onDismiss={() => setModalVisible(false)}
        onSave={handleSaveBloodGlucose}
      />
      
      
    </View>
  );
};

export default ViewFoodItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyCartContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  message: {
    fontSize: 24,
    marginBottom: 16,
  },
  messageICR: {
    fontSize: 20,
    marginTop: 18,
    marginBottom: 10,
  },
  button: {
    marginTop: 16,
    width: "50%",
  },
  listSection: {
    marginBottom: 16,
  },
  buttonStyle: {
    position: "absolute",
    bottom: 16,
    left: 8,
    right: 8,
    padding: 16,
  },
  view: {
    padding: 16,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addGlucose: {
    justifyContent: "center",
    alignItems: "center",
  },
});