import React from "react";
import LoginView from "./LoginView";
import SignupView from "./SignupView";
import TodayView from "./TodayView";
import ExercisesView from "./ExercisesView";
import ProfileView from "./ProfileView";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome5";

import { TouchableOpacity, Image, View, Text } from "react-native";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: undefined,
      username: undefined,
      activities: [],
      goal: 0.0,
      goalHasChanged: false,
      firstTime: true,
    };

    this.login = this.login.bind(this);
    this.revokeAccessToken = this.revokeAccessToken.bind(this);
    this.SignoutButton = this.SignoutButton.bind(this);
  }

  /**
   * Store the username and accessToken here so that it can be
   * passed down to each corresponding child view.
   */
  login(username, accessToken) {
    this.setState({
      username: username,
      accessToken: accessToken,
    });
  }

  /**
   * Revokes the access token, effectively signing a user out of their session.
   */
  revokeAccessToken() {
    this.setState({
      accessToken: undefined,
    });
  }

  addExercise = (activities) => {
    this.setState({ activities, firstTime: false });
  };

  updateExercise = (activities) => {
    this.setState({ activities, firstTime: false });
  };

  /**
   * Defines a signout button... Your first TODO!
   */
  SignoutButton = () => {
    return (
      <>
        <View style={{ flexDirection: "row", marginLeft: 10 }}>
          <TouchableOpacity
            onPress={() => {
              this.revokeAccessToken();
            }}
          >
            <Text accessibilityLabel="Logout and return to Login Screen">
              <Icon name="sign-out-alt" color="red" size={20} />
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  handleGoalChange = (goal) => {
    console.log("Hello");
    this.setState({ goal, goalHasChanged: true });
  };

  profileStackScreen = () => {
    let AuthStack = createStackNavigator();
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="FitnessTracker"
          options={{
            headerLeft: this.SignoutButton,
          }}
        >
          {(props) => (
            <ProfileView
              {...props}
              username={this.state.username}
              accessToken={this.state.accessToken}
              revokeAccessToken={this.revokeAccessToken}
              handleGoalChange={this.handleGoalChange}
            />
          )}
        </AuthStack.Screen>
      </AuthStack.Navigator>
    );
  };

  ExerciseStackScreen = () => {
    let AuthStack = createStackNavigator();
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="Exercise"
          options={{
            headerLeft: this.SignoutButton,
          }}
        >
          {(props) => (
            <ExercisesView
              {...props}
              username={this.state.username}
              accessToken={this.state.accessToken}
              revokeAccessToken={this.revokeAccessToken}
              addExercise={this.addExercise}
              updateExercise={this.updateExercise}
            />
          )}
        </AuthStack.Screen>
      </AuthStack.Navigator>
    );
  };

  TodayViewStackScreen = () => {
    let AuthStack = createStackNavigator();
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="Today"
          options={{
            headerLeft: this.SignoutButton,
          }}
        >
          {(props) => (
            <ProfileView
              {...props}
              username={this.state.username}
              accessToken={this.state.accessToken}
              revokeAccessToken={this.revokeAccessToken}
              firstTime={this.state.firstTime}
              goal={this.state.goal}
            />
          )}
        </AuthStack.Screen>
      </AuthStack.Navigator>
    );
  };

  /**
   * Note that there are many ways to do navigation and this is just one!
   * I chose this way as it is likely most familiar to us, passing props
   * to child components from the parent.
   *
   * Other options may have included contexts, which store values above
   * (similar to this implementation), or route parameters which pass
   * values from view to view along the navigation route.
   *
   * You are by no means bound to this implementation; choose what
   * works best for your design!
   */
  render() {
    // Our primary navigator between the pre and post auth views
    // This navigator switches which screens it navigates based on
    // the existent of an access token. In the authorized view,
    // which right now only consists of the profile, you will likely
    // need to specify another set of screens or navigator; e.g. a
    // list of tabs for the Today, Exercises, and Profile views.
    let AuthStack = createStackNavigator();
    let Tab = createBottomTabNavigator();

    return (
      <NavigationContainer>
        {!this.state.accessToken ? (
          <>
            <AuthStack.Navigator>
              <AuthStack.Screen
                name="SignIn"
                options={{
                  title: "Fitness Tracker Welcome",
                }}
              >
                {(props) => <LoginView {...props} login={this.login} />}
              </AuthStack.Screen>

              <AuthStack.Screen
                name="SignUp"
                options={{
                  title: "Fitness Tracker Signup",
                }}
              >
                {(props) => <SignupView {...props} />}
              </AuthStack.Screen>
            </AuthStack.Navigator>
          </>
        ) : (
          <>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === "Today") {
                    iconName = "child";
                  } else if (route.name === "Exercise") {
                    iconName = "dumbbell";
                  } else if (route.name === "Your Profile") {
                    iconName = "address-card";
                  }

                  // You can return any component that you like here!
                  return <Icon name={iconName} size={size} color={color} />;
                },
              })}
              tabBarOptions={{
                activeTintColor: "tomato",
                inactiveTintColor: "gray",
              }}
            >
              <Tab.Screen
                name="Today"

                // component={this.TodayViewStackScreen}
              >
                {(props) => (
                  <AuthStack.Navigator>
                    <AuthStack.Screen
                      name="Today"
                      options={{
                        headerLeft: this.SignoutButton,
                      }}
                    >
                      {(props) => (
                        <TodayView
                          {...props}
                          username={this.state.username}
                          accessToken={this.state.accessToken}
                          revokeAccessToken={this.revokeAccessToken}
                          activities={this.state.activities}
                          firstTime={this.state.firstTime}
                          goal={this.state.goal}
                          goalHasChanged={this.state.goalHasChanged}
                          username={this.state.username}
                        />
                      )}
                    </AuthStack.Screen>
                  </AuthStack.Navigator>
                )}
              </Tab.Screen>
              <Tab.Screen
                name="Exercise"
                component={this.ExerciseStackScreen}
              ></Tab.Screen>
              <Tab.Screen
                name="Your Profile"
                // component={this.profileStackScreen}
              >
                {(props) => (
                  <AuthStack.Navigator>
                    <AuthStack.Screen
                      name="About Me"
                      options={{
                        headerLeft: this.SignoutButton,
                      }}
                    >
                      {(props) => (
                        <ProfileView
                          {...props}
                          username={this.state.username}
                          accessToken={this.state.accessToken}
                          revokeAccessToken={this.revokeAccessToken}
                          handleGoalChange={this.handleGoalChange}
                        />
                      )}
                    </AuthStack.Screen>
                  </AuthStack.Navigator>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          </>
        )}
      </NavigationContainer>
    );
  }
}

export default App;
