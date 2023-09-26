import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Button,
  List,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { calculateCarbs, getInsultinDose } from "../utils/nutritionCalculation";
import { RemoveFoodItem } from "../redux/actions/actionTypes";
import { useEffect } from "react";
import { fetchFoodItemByIdAPI } from "../redux/actions/actions";
import axios from "axios";

const FoodCart = ({ navigation, route }) => {
  const { tag } = route?.params;
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log("User her:", user?.userProfInfo?.userProfData);
  const foodData = useSelector((state) => state.api);
  const foodItems = useSelector((state) => state.addFood);
  const totalCarbs =
    foodItems?.foodItems?.length > 0 ? calculateCarbs(foodItems?.foodItems) : 0;
  const insulinDose = getInsultinDose(totalCarbs, 10);

  useEffect(() => {
    if (foodData?.foodItem?.fdcId && foodData.success) {
      navigation.navigate("AddFood", {
        tag: tag,
        isDelete: true,
      });
    }
  }, [foodData]);

  const onSave = async () => {
    let userICR;

    if (tag == "Breakfast") {
      userICR = user?.userProfInfo?.userProfData.bfICR;
    } else if (tag == "Lunch") {
      userICR = user?.userProfInfo?.userProfData.lhICR;
    } else {
      userICR = user?.userProfInfo?.userProfData.dnICR;
    }
    console.log("icc :", userICR);
    let params = {
      userId: user?.user?.uid,
      mealItems: foodItems.foodItems,
      totalCarbs: totalCarbs,
      mealType: tag,
      insulinDose: insulinDose,
      userCRR: user?.userProfInfo?.userProfData.crr,
      userICR: userICR,
    };
    console.log("params:", params);
    await axios
      .post("https://diabeticapp-backend.onrender.com/api/submitData", params)
      .then(() => {
        console.log("Data submitted successfully.");
        navigation.navigate("HomeScreen");
      })
      .catch((e) => {
        console.log("Error : ", e);
      });
  };

  const getCarbs = (item) => {
    let carbs = 0;
    carbs = item.foodNutrients.find((y) => {
      return y.number == 205;
    });
    return carbs ? carbs.amount : 0;
  };
  const handleEditItem = (fdcId) => {
    // Handle edit action here
    const params = {
      format: "abridged",
      nutrients: "208,204,205,262,203,291,301,302,303,304,305,306,307,601,",
    };
    dispatch(fetchFoodItemByIdAPI(params, fdcId, tag));
  };

  const handleDeleteItem = (fdcId) => {
    // Handle delete action here
    const updatedArray = foodItems?.foodItems?.filter(
      (item) => item.fdcId !== fdcId
    );
    dispatch(RemoveFoodItem(updatedArray));
  };

  const EmptyCart = () => {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.message}>Your cart is empty!</Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go Back
        </Button>
      </View>
    );
  };

  const RightListView = ({ item }) => {
    return (
      <View>
        <Text>Quantity: {item?.count}</Text>
      </View>
    );
  };

  const Content = () => {
    return (
      <>
        <List.Section style={styles.listSection}>
          <List.Subheader>
            {" "}
            <Text style={styles.message}>My Food Cart</Text>
          </List.Subheader>
          {foodItems?.foodItems?.map((item, index) => (
            <View key={item.fdcId} style={{ flexDirection: "row" }}>
              <List.Item
                style={{ flex: 1 }}
                key={index}
                title={item.description}
                description={`Carbs: ${getCarbs(item)}`}
                right={() => <RightListView item={item} />}
              />
              <Tooltip title="Edit" leaveTouchDelay={1000}>
                <IconButton
                  icon="pencil"
                  onPress={() => handleEditItem(item.fdcId)}
                  iconColor={theme.colors.primary}
                />
              </Tooltip>
              <Tooltip title="Delete" leaveTouchDelay={1000}>
                <IconButton
                  icon="delete"
                  onPress={() => handleDeleteItem(item.fdcId)}
                  iconColor={theme.colors.error}
                />
              </Tooltip>
            </View>
          ))}
        </List.Section>

        <Divider />

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Total Carbs: {totalCarbs ? totalCarbs?.toFixed(2) : 0} g
          </Text>
          <Text style={styles.totalText}>
            Your Insulin Dose: {insulinDose ? insulinDose : 0} units
          </Text>
          <Button onPress={onSave} mode="contained" style={styles.saveButton}>
            Save
          </Button>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {foodItems?.foodItems?.length > 0 ? <Content /> : <EmptyCart />}
    </View>
  );
};

export default FoodCart;

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
  button: {
    marginTop: 16,
    width: "50%",
  },
  listSection: {
    marginBottom: 16,
  },
  totalContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
  },
  totalText: {
    fontSize: 18,
    paddingVertical: 4,
  },
  saveButton: {
    marginTop: 15,
    marginHorizontal: 16,
  },
});
