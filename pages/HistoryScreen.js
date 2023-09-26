import { Button, List, Text } from "react-native-paper";
import axios from "axios";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

const HistoryScreen = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const user = useSelector((state) => state.user);
  const [userDates, setUserDates] = useState([]);
  const [userMealData, setUserMealData] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log("User Id ::", user);
      const fetchUserDates = async () => {
        axios
          .get("https://diabeticapp-backend.onrender.com/api/userDates", {
            params: {
              userId: user?.user?.uid,
            },
          })
          .then((res) => {
            console.log("Dates :", res);
            setUserDates(res.data);
          })
          .catch((err) => {
            console.log("Err", err);
          });
      };
      fetchUserDates();
    }
  }, [isFocused, user]);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    console.log("Day ::", day);
    axios
      .get("https://diabeticapp-backend.onrender.com/api/getDataByDate", {
        params: {
          userId: user?.user?.uid,
          mealDate: day,
        },
      })
      .then((res) => {
        console.log("Data :", res);
        setUserMealData(res.data);
      })
      .catch((err) => {
        console.log("err :", err);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carbs Consumption History</Text>
      <List.Section>
        <List.Subheader>Select a day to view carbs consumption:</List.Subheader>
        {userDates.map((data) => (
          <List.Item
            key={data.mealDate}
            title={data.mealDate}
            onPress={() => handleDaySelect(data.mealDate)}
            style={selectedDay === data.mealDate && styles.selectedItem}
          />
        ))}
      </List.Section>
      <Text style={styles.selectedDayText}>Selected day: {selectedDay}</Text>
      {selectedDay &&
        userMealData.map(function (data, i) {
          return (
            <View style={styles.chartContainer} key={data._id}>
              <Text style={styles.selectedDayText}>
                {data?.mealType} : {data?.totalCarbs}
              </Text>
            </View>
          );
        })}
      <Button
        mode="contained"
        onPress={() => setSelectedDay(null)}
        style={styles.clearButton}
      >
        Clear Selection
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  selectedItem: {
    backgroundColor: "#F2F2F2",
  },
  selectedDayContainer: {
    marginTop: 16,
  },
  selectedDayText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  clearButton: {
    marginTop: 16,
  },
});

export default HistoryScreen;
