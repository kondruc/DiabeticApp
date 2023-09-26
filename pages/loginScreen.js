import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { firebase } from "../config";
import { useDispatch } from "react-redux";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  let loginUser = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const { uid, email } = userCredential.user;
        const user = { uid, email };
        firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              const isFirstTimeLogin = userData.isFirstTimeLogin || false;

              if (isFirstTimeLogin) {
                const userWithNewFlag = { ...user, isFirstTimeLogin };
                dispatch({ type: "Login", payload: userWithNewFlag }); // Dispatch Login event after successful sign-in

                // User is logging in for the first time, perform necessary actions
                firebase
                  .firestore()
                  .collection("users")
                  .doc(uid)
                  .update({
                    isFirstTimeLogin: false,
                  })
                  .then(() => {
                    // Perform necessary actions for first-time login
                  })
                  .catch((error) => {
                    console.log(
                      "Error updating isFirstTimeLogin field:",
                      error
                    );
                  });
              } else {
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
                      dispatch({
                        type: "userData",
                        payload: { userData },
                      });
                    } else {
                    }

                    if (userProf.exists) {
                      const userProfData = userProf.data();
                      dispatch({
                        type: "userProfileData",
                        payload: { userProfData },
                      });
                    } else {
                      console.log("User Prof data data not found.");
                    }
                  } else {
                    console.log("No user is currently logged in.");
                  }
                };

                fetchUserData();
                const userWithNewFlag = { ...user, isFirstTimeLogin };
                dispatch({ type: "Login", payload: userWithNewFlag }); // Dispatch Login event after successful sign-in
              }
            }
          })
          .catch((error) => {
            console.log("Error retrieving user document:", error);
          });
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          alert("User not found. Please check your email and password.");
        } else if (error.code === "auth/wrong-password") {
          alert("Invalid password. Please try again.");
        } else if (error.code === "auth/user-disabled") {
          alert("Your account has been disabled. Please contact support.");
        } else if (error.code === "auth/user-mismatch") {
          alert(
            "There is a mismatch between the current user and the provided credentials."
          );
        } else {
          // Handle generic error case
          alert(
            "An error occurred during login. Please try again later.",
            error
          );
        }
      });
  };

  const forgetPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          <Image source={require("../assets/icon.png")} style={styles.image} />

          <TextInput
            style={styles.input}
            label="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <TextInput
            style={styles.input}
            label="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
          />
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => loginUser(email, password)}
            contentStyle={styles.buttonContent}
          >
            Login
          </Button>

          <Button
            style={{ marginTop: 20 }}
            onPress={() => navigation.navigate("Signup")}
          >
            Don't have an account? Register Now
          </Button>

          <Button style={{ marginTop: 20 }} onPress={forgetPassword}>
            Forget Password?
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: 250,
    height: 50, // Increase the height for larger input fields
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    height: 50,
    width: 250,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    marginTop: -30,
  },
});
