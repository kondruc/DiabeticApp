export function cleanSearchData(data) {
  //Function to find carb from Nutrients Array
  function getFoodCarb(nutri) {
    if (nutri?.length > 0) {
      const carb = nutri?.find((x) => x.nutrientId == 1005); // Carb Id is 1005
      return carb ? carb : {};
    }
    return {};
  }

  //Function to find Measurement Value
  function getFoodMeasurement(m) {
    if (m?.length > 0) {
      //filter the value where the measurement is provided
      const rem = m.filter(
        (x) => x.disseminationText != "Quantity not specified"
      );
      if (rem?.length > 0) {
        return rem[0]; //Getting first measurement value from given meaurement in above filtered array
      } else {
        const qns = m.filter(
          (x) => x.disseminationText == "Quantity not specified" // If no measurement is found
        );
        return qns[0];
      }
    }
    return {};
  }

  const getFoodList =
    data.foods?.length > 0 &&
    data.foods.map((item) => {
      return {
        description: item?.description,
        fdcId: item?.fdcId,
        foodCategory: item?.foodCategory,
        carbs: getFoodCarb(item?.foodNutrients),
        measurement: getFoodMeasurement(item?.foodMeasures),
      };
    });

  const foodList = {
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    foodSearchCriteria: data.foodSearchCriteria,
    totalHits: data.totalHits,
    foods: getFoodList,
  };

  return foodList;
}
