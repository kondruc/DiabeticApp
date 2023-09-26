import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../pages/homeScreen";
import FoodSearch from "../../pages/foodSearch";
import AddFood from "../../pages/addFood";
import FoodCart from "../../pages/foodCart";
import ViewFoodItem from "../../pages/viewFoodItem";
import { IconButton } from "react-native-paper";
import HeaderLogo from "../../ui/headerLogo";

const Stack = createNativeStackNavigator();

export default function HomeNavigation() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <IconButton
              icon="menu"
              size={24}
              color="black"
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 16 }}
            />
          ),
          headerTitle: (props) => <HeaderLogo {...props} />,
        })}
      />
      <Stack.Screen
        name="FoodSearch"
        component={FoodSearch}
        options={{ headerTitle: () => <HeaderLogo title={"Search"} /> }}
      />
      <Stack.Screen
        name="AddFood"
        component={AddFood}
        options={{ headerTitle: () => <HeaderLogo title={"Food Details"} /> }}
      />
      <Stack.Screen
        name="FoodCart"
        component={FoodCart}
        options={{ headerTitle: () => <HeaderLogo title={"My Cart"} /> }}
      />
      <Stack.Screen
        name="ViewFoodItem"
        component={ViewFoodItem}
        options={{ headerTitle: () => <HeaderLogo title={"My Food"} /> }}
      />
    </Stack.Navigator>
  );
}
