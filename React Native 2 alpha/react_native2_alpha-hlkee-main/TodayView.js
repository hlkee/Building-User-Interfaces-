import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";
import moment from "moment";

class TodayView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todaysActivities: [],
      goal: 0.0,
    };
  }

  componentDidMount() {
    fetch("https://mysqlcs639.cs.wisc.edu/activities/", {
      method: "GET",
      headers: { "x-access-token": this.props.accessToken },
    })
      .then((res) => res.json())
      .then((res) => {
        const todaysActivities = res["activities"];
        let temp = [];

        for (let i = 0; i < todaysActivities.length; ++i) {
          console.log(moment(todaysActivities[i].date).format("MMMM Do YYYY"));
          console.log(moment(new Date()).format("MMMM Do YYYY"));
          console.log(
            moment(todaysActivities[i].date).format("MMMM Do YYYY") ===
              moment(new Date()).format("MMMM Do YYYY")
          );
          if (
            moment(todaysActivities[i].date).format("MMMM Do YYYY") ===
            moment(new Date()).format("MMMM Do YYYY")
          ) {
            console.log(todaysActivities[i]);
            temp.push(todaysActivities[i]);
          }
        }
        this.setState({ todaysActivities: temp });
      });

    fetch("https://mysqlcs639.cs.wisc.edu/users/" + this.props.username, {
      method: "GET",
      headers: { "x-access-token": this.props.accessToken },
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          goal: res.goalDailyActivity,
        });
      });
  }

  getDate() {
    var date = new Date();
    date = JSON.parse(JSON.stringify(date));
    return date.substring(0, 10);
  }

  getExerciseCard = (activity) => {
    if (
      moment(new Date(activity.date)).format("MMMM Do YYYY") !==
      moment(new Date()).format("MMMM Do YYYY")
    ) {
      return;
    }
    return (
      <Card style={{ width: 200, margin: 15, backgroundColor: "lightGrey" }}>
        <Card.Title
          style={{ alignSelf: "center" }}
          title={activity.name}
          subtitle={"_______________"}
        ></Card.Title>
        <View style={{ marginLeft: 10, marginBottom: 10 }}>
          <Text>
            Date: {moment(new Date(activity.date)).format("MMMM Do YYYY")}
          </Text>
          <Text>Time : {moment(new Date(activity.date)).format("h:mm a")}</Text>
          <Text>Duration: {activity.duration} minutes</Text>
          <Text>Calories: {activity.calories}</Text>
        </View>
      </Card>
    );
  };

  addGoalMinutes = (activity) => {
    let totalTime = 0;

    if (this.props.firstTime === true) {
      this.state.todaysActivities.forEach((activity) => {
        totalTime += activity.duration;
      });
    } else {
      this.props.activities.forEach((activity) => {
        if (
          moment(activity.date).format("MMMM Do YYYY") ===
          moment(new Date()).format("MMMM Do YYYY")
        ) {
          totalTime += activity.duration;
        }
      });
    }
    return totalTime;
  };

  render() {
    return (
      <>
        <ScrollView>
          <View style={styles.container}>
            <Text style={{ fontSize: 30, fontWeight: "bold", margin: 10 }}>
              <Icon name="child" size={40} style={{ margin: 20 }} /> Today
            </Text>
            <Text style={{ textAlign: "center" }}>
              What's on the agenda for today ? Below are all of your goals and
              exercises
            </Text>
            <Card
              style={{
                width: 200,
                marginTop: 15,
                marginBottom: 15,
                textAlign: "center",
              }}
            >
              <Card.Title
                title="Today's Goals"
                subtitle={moment(new Date()).format("MMMM Do YYYY")}
              ></Card.Title>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text>
                  Duration: {this.addGoalMinutes(this.props.activities)}/
                  {this.props.goalHasChanged
                    ? this.props.goal
                    : this.state.goal}{" "}
                  minutes
                </Text>
              </View>
            </Card>

            {this.props.firstTime
              ? this.state.todaysActivities.map((activity) => {
                  return this.getExerciseCard(activity);
                })
              : this.props.activities.map((activity) => {
                  return this.getExerciseCard(activity);
                })}
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TodayView;
