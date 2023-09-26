import NavigationStack from "./components/navigation/navigation";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { theme } from "./utils/theme";
import store from "./redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationStack />
      </PaperProvider>
    </Provider>
  );
}
