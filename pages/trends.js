import { Button, List, Text } from "react-native-paper";
import axios from "axios";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    LineChart
  } from "react-native-chart-kit";
  import { Dimensions } from "react-native";
import { parse } from "react-native-svg";
const screenWidth = Dimensions.get("window").width;

const Trends = () => {
  const user = useSelector((state) => state.user);

  const [userDates, setUserDates] = useState([]);
  const [dataForTrends, setDataForTrends] = useState([]);
  const [tag, setTag] = useState("Breakfast");
  const [userMealData, setUserMealData] = useState([]);
  const isFocused = useIsFocused();


  useEffect(() => {
    if (isFocused) {
      // Fetch userDates
      axios
        .get("https://diabeticapp-backend-dt6j.onrender.com/api/userDates", {
          params: {
            userId: user?.user?.uid,
          },
        })
        .then((res) => {
          console.log("Dates:", res);
          setUserDates(res.data);
  
          // Calculate mealDate here
          const currentDate = new Date();
          const day = String(currentDate.getDate()).padStart(2, "0");
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          const year = currentDate.getFullYear();
          const mealDate = `${day}/${month}/${year}`;
  
          // Now you can fetch dataForTrends using mealDate
          axios
            .get("https://diabeticapp-backend-dt6j.onrender.com/api/getDataByDate", {
              params: {
                userId: user?.user?.uid,
                mealDate: mealDate,
              },
            })
            .then((dataRes) => {
              console.log("Data for Trends:", dataRes);
              setUserMealData(dataRes.data);
            })
            .catch((err) => {
              console.log("Error fetching data for Trends:", err);
            });
        })
        .catch((err) => {
          console.log("Error fetching user dates:", err);
        });
    }
  }, [isFocused, user]);



  // const handleDaySelect = (day) => {
  //   setSelectedDay(day);
  //   console.log("Day ::", day);
  //   axios
  //     .get("https://diabeticapp-backend-dt6j.onrender.com/api/getDataByDate", {
  //       params: {
  //         userId: user?.user?.uid,
  //         mealDate: day,
  //       },
  //     })
  //     .then((res) => {
  //       console.log("Data :", res);
  //       setUserMealData(res.data);
  //     })
  //     .catch((err) => {
  //       console.log("err :", err);
  //     });
  // };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(19, 86, 186, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

//   const graphData = {
//     labels: userDates.map((data) => data.mealDate),
//     datasets: [
//         {O
//             data: userMealData.map((data) => data.mealType=="Breakfast".totalCarbs),
//             color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Define your color here

//         },
//     ],
//   }
const graphData = {
  labels: userDates.map((data) => data.mealDate),
  datasets: [
    {
      data: userDates.map((date) => {
        const matchingData = userMealData.find(
          (item) => item.mealDate === date.mealDate && item.mealType === "Breakfast"
        );

        if (matchingData) {
          return parseFloat(matchingData.totalCarbs);
        } else {
          // Handle the case where no data is found (e.g., use a default value)
          return 0;
        }
      }),
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

  return (
    <View style={styles.container}>
        
      <Text style={styles.title}>Carbs Consumption History</Text>
      
      <LineChart
        data={graphData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        />
      
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

export default Trends;