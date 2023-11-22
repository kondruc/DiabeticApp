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
  IconButton,
  Tooltip,
  useTheme,
} from "react-native-paper";
import AddCarbsModal from "../ui/addCarbsModel";
import { firebase } from "../config";
import { useIsFocused } from '@react-navigation/native';
import { bloodGlucoseBefore } from "../../DiabeticApp-backend/controller/userCarbsDataController";


const ViewFoodItem = ({ navigation, route }) => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const user = useSelector((state) => state.user);
  const { tag } = route?.params;
  const [objectId, setObjectId] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [totalCarbs, setTotalCarbs] = useState("");
  const [insulinDose, setInsulinDose] = useState(0);
  const [userCRR, setUserCRR] = useState(0);
  const [bloodGlucoseLevel, setBloodGlucoseLevel] = useState(0);
  const [targetBloodGlucose, setTargetBloodGlucose] = useState(0);
  const [bloodGlucoseLevelBeforeMeal, setBloodGlucoseLevelBeforeMeal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisibleBeforeMeal, setModalVisibleBeforeMeal] = useState(false);
  const [modalVisibleAfterMeal, setModalVisibleAfterMeal] = useState(false);
  const [userICR, setUserICR] = useState("");
  
  useEffect(() => {
      const fetchUserData = async () => {
        const user = firebase.auth().currentUser;

        if (user) {
          const userId = user.uid;
          const userProfRef = firebase
            .firestore()
            .collection("userProfile")
            .doc(userId);

          const userProf = await userProfRef.get();

          if (userProf.exists) {
            const userProfData = userProf.data();
            setTargetBloodGlucose(userProfData.targetBloodGlucose);
          } else {
            console.log("User profile data not found.");
          }
        } else {
          console.log("No user is currently logged in.");
        }
      };
      fetchUserData();
    });

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
            setTargetBloodGlucose(userProfData.targetBloodGlucose);
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
      .get("https://diabetesapp-backend.onrender.com/api/updateUserICR", {
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
        `https://diabetesapp-backend.onrender.com/api/getDataByMealType/Date?userId=${params.userId}&mealType=${params.mealType}`
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
        setTargetBloodGlucose(
          res?.data?.targetBloodGlucose ? res?.data?.targetBloodGlucose : 0
        )
        // setBloodGlucoseLevelBeforeMeal(
        //   res?.data?.bloodGlucoseLevelBeforeMeal ? res?.data?.bloodGlucoseLevelBeforeMeal : 0
        // );
        setUserCRR(res?.data?.userCRR);
        console.log("This is crr")
        console.log(res?.data?.userCRR);
        console.log("This is blood glucose before meal"+res?.data?.bloodGlucoseBeforeMeal);
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
        `https://diabetesapp-backend.onrender.com/api/addBloodGlucose`,
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
      userId: user?.user?.uid, //set user id because it is not saved
      mealType: tag,
      bloodGlucoseBeforeMeal: data,
    };
    setLoading(true);
    console.log(params.userId+params.mealType+params.bloodGlucoseBeforeMeal+"This the data we are saving for blood glucose")
    await axios
      .post(
        `https://diabetesapp-backend.onrender.com/api/addBloodGlucoseBeforeMeal`,
        params
      )
      .then((res) => {
        console.log("Xyz",res);
        // setBloodGlucoseLevelBeforeMeal(res?.data?.bloodGlucoseBeforeMeal ? res?.data?.bloodGlucoseBeforeMeal : 0);
        setLoading(false);
       navigation.goBack();
      })
      .catch((e) => {
        setLoading(false);
        console.log("Error : ", e);
      });
  };

  const getBloodGlucoseBeforeMeal = async () => {
    let params = {
      userId: user?.user?.uid,
      mealType: tag,
    };
    setLoading(true);
    await axios
      .get(
        `https://diabetesapp-backend.onrender.com/api/getBloodGlucoseBeforeMeal?userId=${params.userId}&mealType=${params.mealType}`
      )
      .then((res) => {
        setLoading(false);
        // setFoodItems(res?.data ? res?.data?.mealItems : []);
        // setTotalCarbs(res?.data ? res?.data?.totalCarbs : "");
        // setInsulinDose(res?.data ? res?.data?.insulinDose : 0);
        // setObjectId(res?.data ? res?.data?._id : null);
        // setBloodGlucoseLevel(
        //   res?.data?.bloodGlucoseLevel ? res?.data?.bloodGlucoseLevel : 0
        // );
        // setTargetBloodGlucose(
        //   res?.data?.targetBloodGlucose ? res?.data?.targetBloodGlucose : 0
        // )
        setBloodGlucoseLevelBeforeMeal(
          res?.data?.bloodGlucoseBeforeMeal ? res?.data?.bloodGlucoseBeforeMeal : 0
        );
        console.log("getting data"+ res);
        console.log("This is blood glucose before meal"+res?.data?.bloodGlucoseBeforeMeal);
        
      })
      .catch((e) => {
        setLoading(false);
        console.log("Error : ", e);
      });
  };


  // const addBloodGlucoseBeforeMeal = async (data) => {
  //   console.log("HER: ", user?.user?.uid, tag);
  //   await axios
  //     .put("https://diabetesapp-backend.onrender.com/api/addBloodGlucoseBeforeMeal", {
  //       params: {
  //         userId: user?.user?.uid,
  //         mealType: tag,
  //       },
  //     })
  //     .then((res) => {
  //       console.log("Res :", res);
  //       setBloodGlucoseLevelBeforeMeal(data);
  //     })
  //     .catch((err) => {
  //       console.log("Err :", err);
  //     });
  // };
  useEffect(() => {
    getUpdatedUserICR();
    getBloodGlucoseBeforeMeal();
    getFoodItems();
  
    
  }, []);

  const handleSaveBloodGlucose = (data) => {
    addBloodGlucose(data);
    setModalVisibleAfterMeal(false);
    setBloodGlucoseLevel(data); 
    console.log("target"+targetBloodGlucose+"blood glucose"+bloodGlucoseLevel);
  };

  const handleSaveBloodGlucoseBeforeMeal = (data) => {
    addBloodGlucoseBeforeMeal(data);
    setModalVisibleBeforeMeal(false);
    //setBloodGlucoseLevelBeforeMeal(data); 
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

  const getCorrectionFactor = () => {
    try {
        console.log("blood glucose level"+bloodGlucoseLevel+"target bg"+targetBloodGlucose+"userCRR"+userCRR);
         const x = ((bloodGlucoseLevel - targetBloodGlucose)/userCRR);
         return x;
        
      } catch (error) {
        console.log(error);
        throw error;
      }
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

              {foodItems.length > 0 &&(
                <>
                  <Text style={styles.message}>Food is already added. Check summary for more details.</Text>
                </>
               )}

              {bloodGlucoseLevelBeforeMeal === 0  && (
                      <>
                      <Button
                        mode="contained"
                        onPress={() => setModalVisibleBeforeMeal(true)}
                        style={styles.button}
                        
                      >
                        Add Blood Glucose Reading
                        {' '}
                        Before Meal
                      </Button>
                        
                      </>

                    )}
                    <AddCarbsModal
                      visible={modalVisibleBeforeMeal}
                      placeholder={"Enter Blood-glusoce reading Before Meal"}
                      onDismiss={() => setModalVisibleBeforeMeal(false)}
                      onSave={handleSaveBloodGlucoseBeforeMeal}
                    />
                    
              {foodItems.length <= 0 &&(
                <>
                  {/* <Text style={styles.message}>You have no Food Items!!</Text> */}
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
              {/* <Text style={styles.messageICR}>After food intake please press for your dose !!</Text>
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

          {totalCarbs > 0 ?
          (
          <Text variant="titleMedium">
            Total Carbs Consumed - {totalCarbs} g
          </Text>
          ): null}

          {insulinDose > 0 ? (
            <Text variant="titleMedium">
              Total Insulin Dose - {insulinDose} units

            </Text>
          ) : null}

          {bloodGlucoseLevelBeforeMeal ? (
            
            <View variant="titleMedium" style={{flexDirection: "row", alignItems: "center"}}>
              <Text 
              variant="titleMedium"
              style={{marginRight: 25 }}
              >
                Total Blood Glucose Level Before Meal - {bloodGlucoseLevelBeforeMeal} mmol/L
              </Text>
              
              <Tooltip title="Edit" leaveTouchDelay={1000}>
                <IconButton
                  icon="pencil"
                  onPress={() => setModalVisibleBeforeMeal(true)}
                  iconColor={theme.colors.primary}
                  size={15}
                  style={{margin:"-14px"}}
                />
              </Tooltip>
            </View>
          ) : null}
          <AddCarbsModal
                      visible={modalVisibleBeforeMeal}
                      placeholder={"Edit Blood-glusoce reading Before Meal"}
                      onDismiss={() => setModalVisibleBeforeMeal(false)}
                      onSave={handleSaveBloodGlucoseBeforeMeal}
          />
          
          
          {bloodGlucoseLevel > 0 ? (
            <View variant="titleMedium" style={{flexDirection: "row", alignItems: "center"}}>
            <Text 
            variant="titleMedium"
            style={{marginRight: 25 }}
            >
              Total Blood Glucose Level After Meal - {bloodGlucoseLevel} mmol/L
            </Text>
            
            <Tooltip title="Edit" leaveTouchDelay={1000}>
              <IconButton
                icon="pencil"
                onPress={() => setModalVisibleAfterMeal(true)}
                iconColor={theme.colors.primary}
                size={15}
                style={{margin:"-14px"}}
              />
            </Tooltip>
            <AddCarbsModal
                  visible={modalVisibleAfterMeal}
                  placeholder={"Edit Blood-glusoce reading After Meal"}
                  onDismiss={() => setModalVisibleAfterMeal(false)}
                  onSave={handleSaveBloodGlucose}
                />
          </View>
          ) : null}
            
          {bloodGlucoseLevel ? (
            <>
              {bloodGlucoseLevel > targetBloodGlucose ? (
                <Text variant="titleMedium">
                  Your correction dose - {getCorrectionFactor()} 
                </Text>
              ) : (
                <Text variant="titleMedium">
                  Your blood glucose is low - Take appropriate actions.
                </Text>
              )}
            </>
          ) : null}

          {bloodGlucoseLevel == 0 && foodItems?.length > 0 ? (
            
              <>
                <Button
                  mode="contained"
                  onPress={() => setModalVisibleAfterMeal(true)}
                  style={styles.button}
                >
                  Add Blood Glucose Reading After Meal
                </Button>
                <AddCarbsModal
                  visible={modalVisibleAfterMeal}
                  placeholder={"Enter Blood-glusoce reading After Meal"}
                  onDismiss={() => setModalVisibleAfterMeal(false)}
                  onSave={handleSaveBloodGlucose}
                />
                        
              </>
              
      
          ) : null}
          

        </View>
      ) : null}
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
    whiteSpace: 'normal',
    marginTop: 16,
    width: '70%',
    alignSelf: "center",
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