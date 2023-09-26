import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Searchbar,
  List,
  ActivityIndicator,
  IconButton,
  useTheme,
  Text,
  Divider,
  FAB,
} from "react-native-paper";
import {
  fetchFoodSearchAPI,
  clearFoodSearchResults,
  fetchFoodItemByIdAPI,
} from "../redux/actions/actions";
import { useDispatch, useSelector } from "react-redux";

const FoodSearch = ({ navigation, route }) => {
  const theme = useTheme();
  const { tag } = route?.params;
  const dispatch = useDispatch();
  const foodSearchData = useSelector((state) => state.api);
  const [searchFlag, setSearchFlag] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    clearSearch();
  }, []);

  useEffect(() => {
    if (foodSearchData?.foodSearch?.foods?.length > 0) {
      setTotalPages(foodSearchData?.foodSearch?.totalPages);
      setData(foodSearchData?.foodSearch?.foods);
    }
    if (foodSearchData?.foodItem?.fdcId && foodSearchData.success) {
      navigateToFoodItem();
    }
  }, [foodSearchData]);

  useEffect(() => {
    if (currentPage > 0) {
      getSearchResult(currentPage);
    }
  }, [searchFlag]);

  const onChangeSearch = (query) => setSearchQuery(query);

  const onSearch = () => {
    if (searchQuery == "") {
      clearSearch();
    } else {
    }
    setTotalPages(null);
    setData([]);
    setCurrentPage(1);
    setSearchFlag(!searchFlag);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSearchFlag(!searchFlag);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSearchFlag(!searchFlag);
    }
  };

  const navigateToFoodItem = () => {
    navigation.navigate("AddFood", {
      tag: tag,
    });
  };

  const getSearchResult = (page) => {
    const params = {
      query: searchQuery,
      dataType: "Survey (FNDDS)",
      pageSize: 25,
      pageNumber: page,
      sortBy: "dataType.keyword",
      sortOrder: "asc",
    };
    dispatch(fetchFoodSearchAPI(params));
  };

  const onFoodItem = (item) => {
    const params = {
      format: "abridged",
      nutrients: "208,204,205,262,203,291,301,302,303,304,305,306,307,601,",
    };
    dispatch(fetchFoodItemByIdAPI(params, item?.fdcId, tag));
  };

  const clearSearch = () => {
    dispatch(clearFoodSearchResults());
    setTotalPages(null);
    setData([]);
    setCurrentPage(0);
  };

  const LeftListView = ({ item }) => {
    return (
      <View style={styles.leftListContainer}>
        <Text variant="bodyMedium">
          Carbs: {item?.carbs?.value}
          {item?.carbs?.unitName}
        </Text>
        {/* <Text variant="bodyMedium">
          {item?.measurement?.disseminationText}-{item?.measurement?.gramWeight}
        </Text> */}
      </View>
    );
  };

  const onCartPress = () => {
    navigation.navigate("FoodCart", { tag: tag });
  };

  return (
    <View style={styles.container(theme)}>
      <Searchbar
        placeholder="Search Food Item"
        onChangeText={onChangeSearch}
        onIconPress={onSearch}
        onSubmitEditing={onSearch}
        onClearIconPress={clearSearch}
        value={searchQuery}
        elevation={5}
        style={{ marginBottom: 10 }}
      />
      {foodSearchData?.loading ? (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      ) : (
        <ScrollView style={styles.scrollViewContainer}>
          <List.Section>
            {foodSearchData?.foodSearch?.totalHits ? (
              <List.Subheader>
                Your Search Results - {foodSearchData?.foodSearch?.totalHits}
              </List.Subheader>
            ) : null}
            {data?.map((item) => (
              <View key={item.fdcId}>
                <List.Item
                  onPress={() => onFoodItem(item)}
                  key={item.fdcId}
                  titleEllipsizeMode="tail"
                  titleNumberOfLines={5}
                  title={item.description}
                  description={item.foodCategory}
                  right={() => <LeftListView item={item} />}
                  style={{
                    ...styles.listItemStyle,
                    backgroundColor: theme.colors.surface,
                  }}
                />
                <Divider />
              </View>
            ))}
          </List.Section>
        </ScrollView>
      )}
      {foodSearchData?.foodSearch?.foods?.length > 0 ? (
        <View
          style={{
            ...styles.buttonContainer,
            backgroundColor: theme.colors.surfaceVariant,
          }}
        >
          <IconButton
            icon={"arrow-left-thick"}
            size={50}
            onPress={handlePreviousPage}
            iconColor={theme.colors.primary}
            disabled={currentPage === 1}
          />
          {currentPage > 0 ? (
            <Text
              style={{
                ...styles.pageNumerStyle,
                color: theme.colors.secondary,
              }}
            >
              Page: {currentPage}
            </Text>
          ) : null}
          <IconButton
            icon={"arrow-right-thick"}
            size={50}
            onPress={handleNextPage}
            iconColor={theme.colors.primary}
            disabled={currentPage === totalPages || totalPages === null}
          />
        </View>
      ) : null}
      <FAB style={styles.fab} icon="cart" onPress={onCartPress} />
    </View>
  );
};

export default FoodSearch;

const styles = StyleSheet.create({
  container: (theme) => ({
    flex: 1,
    padding: 5,
    backgroundColor: theme.colors.background,
  }),
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
    opacity: 0.4,
  },
  leftListContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingLeft: 20,
    flex: 0.5,
  },
  listItemStyle: {
    opacity: 0.8,
  },
  pageNumerStyle: {
    paddingTop: 30,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    flex: 1,
  },
});
