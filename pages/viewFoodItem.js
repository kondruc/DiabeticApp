import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  ActivityIndicator,
  Button,
  Divider,
  List,
  Text,
} from "react-native-paper";
import AddCarbsModal from "../ui/addCarbsModel";
import { firebase } from "../config";

const ViewFoodItem = ({ navigation, route }) => {
  const user = useSelector((state) => state.user);
  const { tag } = route?.params;
  const [objectId, setObjectId] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [totalCarbs, setTotalCarbs] = useState("");
  const [insulinDose, setInsulinDose] = useState(0);
  const [bloodGlucose, setBloodGlucose] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userICR, setUserICR] = useState("");

  const getUpdatedUserICR = async () => {
    console.log("HER: ", user?.user?.uid, tag);
    await axios
      .get("https://diabeticapp-backend.onrender.com/api/updateUserICR", {
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
        `https://diabeticapp-backend.onrender.com/api/getDataByMealType/Date?userId=${params.userId}&mealType=${params.mealType}`
      )
      .then((res) => {
        setLoading(false);
        setFoodItems(res?.data ? res?.data?.mealItems : []);
        setTotalCarbs(res?.data ? res?.data?.totalCarbs : "");
        setInsulinDose(res?.data ? res?.data?.insulinDose : 0);
        setObjectId(res?.data ? res?.data?._id : null);
        setBloodGlucose(
          res?.data?.bloodGlucoseLevel ? res?.data?.bloodGlucoseLevel : 0
        );
        console.log("Data:", res, res?.data ? res?.data?.mealItems : []);
      })
      .catch((e) => {
        setLoading(false);
        console.log("Error : ", e);
      });
  };

  const addGloodGlucose = async (data) => {
    let params = {
      _id: objectId,
      bloodGlucoseLevel: data,
    };
    setLoading(true);
    await axios
      .put(
        `https://diabeticapp-backend.onrender.com/api/addBloodGlucose`,
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
    addGloodGlucose(data);
    setModalVisible(false);
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
      {foodItems?.length > 0 ? (
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
              <Text style={styles.message}>You have no Food Items!!</Text>
              <Button
                mode="contained"
                onPress={onAddFood}
                style={styles.button}
              >
                Add Food Here
              </Button>
              <Text style={styles.messageICR}>Update Your ICR !!</Text>
              <Button
                mode="contained"
                onPress={updateUserICR}
                style={styles.button}
              >
                {userICR}
              </Button>
            </>
          )}
        </View>
      )}
      <Divider />
      {foodItems?.length > 0 ? (
        <View style={styles.view}>
          <Text variant="titleMedium">
            Total Carbs Consumed - {totalCarbs} g
          </Text>
          {insulinDose > 0 ? (
            <Text variant="titleMedium">
              Total Insulin Dose - {insulinDose} g
            </Text>
          ) : null}
          {bloodGlucose > 0 ? (
            <Text variant="titleMedium">
              Total Blood Glucose Level - {bloodGlucose} g
            </Text>
          ) : null}
        </View>
      ) : null}
      <AddCarbsModal
        visible={modalVisible}
        placeholder={"Enter Blood-glusoce reading"}
        onDismiss={() => setModalVisible(false)}
        onSave={handleSaveBloodGlucose}
      />
      {bloodGlucose == 0 && foodItems?.length > 0 ? (
        <View style={styles.addGlucose}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={{ fontSize: 20, color: "#1356ba" }}>
              Add Blood Glucose Reading
            </Text>
          </TouchableOpacity>
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
