import React from "react";
import { Button, Modal, View, Text, Dimensions, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { Avatar, Card, Title, Paragraph } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";
import moment from "moment";

class ExercisesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      modalVisible: false,
      editModalVisible: false,
      name: "",
      duration: "",
      burnt: "",
      parseDate: "-6",
      date: "Date",
      showDate: false,
      showTime: false,
      // datetime: "datetime",
    };
  }

  componentDidMount() {
    fetch("https://mysqlcs639.cs.wisc.edu/activities/", {
      method: "GET",
      headers: { "x-access-token": this.props.accessToken },
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({ activities: res["activities"] });
        this.props.updateExercise(res["activities"]);
      });
  }

  handleEdit = (id) => {
    console.log(this.state.date);
    if (this.state.date.substring(0, 1) === '"') {
      this.setState({
        date: this.state.date.substring(1, this.state.date.length - 1),
      });
    } else {
    }
    this.setState(
      {
        duration: parseFloat(this.state.duration),
        burnt: parseFloat(this.state.burnt),
      },

      () =>
        fetch("https://mysqlcs639.cs.wisc.edu/activities/" + id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.props.accessToken,
          },
          body: JSON.stringify({
            name: this.state.name,
            duration: this.state.duration,
            calories: this.state.burnt,
            date: this.state.date,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            alert("Your exercise has been updated!");
            this.setState({ editModalVisible: false });
            this.componentDidMount();
          })

          .catch((err) => {
            alert(
              "Something went wrong! Verify you have filled out the fields correctly."
            );
          })
    );
  };

  handleSave = () => {
    this.setState(
      {
        date: this.state.date.substring(1, this.state.date.length - 1),
        duration: parseFloat(this.state.duration),
        burnt: parseFloat(this.state.burnt),
      },
      () =>
        fetch("https://mysqlcs639.cs.wisc.edu/activities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": this.props.accessToken,
          },

          body: JSON.stringify({
            name: this.state.name,
            duration: this.state.duration,
            calories: this.state.burnt,
            date: this.state.date,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            alert("Your exercise has been added!");
            this.setState({
              modalVisible: false,
              name: "",
              duration: "",
              burnt: "",
              date: "",
              time: "",
            });
            this.componentDidMount();
          })
          .catch((err) => {
            alert(
              err +
                " Something went wrong! Verify you have filled out the fields correctly."
            );
          })
    );
  };

  handleDelete = (id) => {
    fetch("https://mysqlcs639.cs.wisc.edu/activities/" + id, {
      method: "DELETE",
      headers: { "x-access-token": this.props.accessToken },
    })
      .then((res) => res.json())
      .then((res) => {
        alert("Activity Deleted");
        this.componentDidMount();
      })
      .catch((err) => {
        alert("Something went wrong!");
      });
  };

  getModal = () => {
    return (
      <Modal visible={this.state.modalVisible}>
        <View style={styles.container}>
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>
            Exercise Details{"\n"}
          </Text>
          <Text style={styles.title}>Exercise Name </Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Exercise Name"
            placeholderTextColor="#d9bebd"
            onChangeText={(name) => {
              this.setState({ name });
            }}
            autoCapitalize="none"
          />
          <Text style={styles.title}>Duration </Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Duration"
            placeholderTextColor="#d9bebd"
            onChangeText={(duration) => {
              this.setState({ duration });
            }}
            autoCapitalize="none"
          />
          <Text style={styles.title}>Calories Burnt </Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Calories Burnt"
            placeholderTextColor="#d9bebd"
            onChangeText={(burnt) => {
              this.setState({ burnt });
            }}
            autoCapitalize="none"
          />
          <Text style={styles.title}> Set Date and Time</Text>
          <Text>
            {moment(
              this.state.date.substring(1, this.state.date.length - 1)
            ).format("MMMM Do YYYY, h:mm a")}
          </Text>
          <View>
            <View>
              <DateTimePickerModal
                isVisible={this.state.showDate}
                mode="datetime"
                onConfirm={(date) => {
                  this.setState({
                    date: JSON.stringify(date),
                    showDate: false,
                  });
                }}
                onCancel={() => {
                  this.setState({ showDate: false });
                }}
              />
            </View>

            <Text style={styles.title}>
              <Button
                title="Set date and time"
                color="#942a21"
                style={styles.buttonInline}
                onPress={() => {
                  this.setState({ showDate: true });
                }}
              ></Button>
            </Text>

            <Text style={styles.title}>
              Looks Good ! Ready to save your exercise ?
            </Text>

            <Text style={styles.title}>
              <Button
                title="Save"
                onPress={() => {
                  this.handleSave();
                }}
              ></Button>
              {"     "}
              <Button
                title="Cancel"
                onPress={() => {
                  this.setState({ modalVisible: false });
                }}
              ></Button>
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  editModal = () => {
    return (
      <Modal visible={this.state.editModalVisible}>
        <View style={styles.container}>
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>
            Exercise Details{"\n"}
          </Text>
          <Text style={styles.title}>Exercise Name </Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Exercise Name"
            placeholderTextColor="#d9bebd"
            onChangeText={(name) => {
              this.setState({ name });
            }}
            value={this.state.name}
            autoCapitalize="none"
          />
          <Text style={styles.title}>Duration </Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Duration"
            placeholderTextColor="#d9bebd"
            onChangeText={(duration) => {
              this.setState({ duration });
            }}
            value={String(this.state.duration)}
            autoCapitalize="none"
          />
          <Text style={styles.title}>Calories Burnt </Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Calories Burnt"
            placeholderTextColor="#d9bebd"
            onChangeText={(burnt) => {
              this.setState({ burnt });
            }}
            value={String(this.state.burnt)}
            autoCapitalize="none"
          />
          <Text style={styles.title}> Set Date and Time</Text>
          <Text>
            {moment(
              this.state.date.substring(1, this.state.date.length - 1)
            ).format("MMMM Do YYYY, h:mm a") !== "Invalid date"
              ? moment(
                  this.state.date.substring(1, this.state.date.length - 1)
                ).format("MMMM Do YYYY, h:mm a")
              : this.state.date}
          </Text>
          <View>
            <View>
              <DateTimePickerModal
                isVisible={this.state.showDate}
                mode="datetime"
                onConfirm={(date) => {
                  this.setState({
                    date: JSON.stringify(date),
                    showDate: false,
                  });
                }}
                onCancel={() => {
                  this.setState({ showDate: false });
                }}
              />
            </View>

            <Text style={styles.title}>
              <Button
                title="Set date and time"
                color="#942a21"
                style={styles.buttonInline}
                onPress={() => {
                  this.setState({ showDate: true });
                }}
              ></Button>

              {"\n"}
            </Text>

            <Text style={styles.title}>
              Looks Good ! Ready to save your exercise ?
            </Text>

            <Text style={styles.title}>
              <Button
                title="Save"
                onPress={() => {
                  this.handleEdit(this.state.id);
                }}
              ></Button>
              {"     "}
              <Button
                title="Cancel"
                onPress={() => {
                  this.setState({ editModalVisible: false });
                }}
              ></Button>
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  getExerciseCard = (activity) => {
    return (
      <Card style={{ width: 200, marginTop: 15 }}>
        <Card.Title
          style={{ alignSelf: "center" }}
          title={activity.name}
          subtitle={"_______________"}
        ></Card.Title>
        <View style={{ marginLeft: 10 }}>
          <Text>
            Date: {moment(new Date(activity.date)).format("MMMM Do YYYY")}
          </Text>
          <Text>Time: {moment(new Date(activity.date)).format("h:mm a")}</Text>
          <Text>Duration: {activity.duration} minutes</Text>
          <Text>Calories: {activity.calories}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignSelf: "center",
            margin: 10,
          }}
        >
          <Text>
            <Button
              title="Edit"
              onPress={() => {
                this.setState({
                  name: activity.name,
                  burnt: activity.calories,
                  duration: activity.duration,
                  parseDate: JSON.stringify(activity.date),
                  date: moment(new Date(activity.date)).format(
                    "MMMM Do YYYY, h:mm a"
                  ),
                  id: activity.id,
                });
                this.setState({ editModalVisible: true });
              }}
            ></Button>
            {"     "}
            <Button
              title="Delete"
              onPress={() => this.handleDelete(activity.id)}
            ></Button>
          </Text>
        </View>
      </Card>
    );
  };

  render() {
    return (
      <>
        <ScrollView>
          <View style={styles.container}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>
              <Icon name="dumbbell" size={40} style={{ margin: 20 }} />{" "}
              Exercises
            </Text>
            <Text style={styles.title}>
              {" "}
              Record your exercises below {"\n"}
            </Text>
            <Button
              onPress={() => {
                this.setState({ modalVisible: true });
              }}
              title="Add Exercise"
            ></Button>
            {this.getModal()}
            {this.state.activities.map((activity) => {
              return this.getExerciseCard(activity);
            })}
            {this.editModal()}
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "ghostwhite",
    alignItems: "center",
    // justifyContent: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  input: {
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: "#c9392c",
    borderWidth: 1,
  },

  timeinput: {
    width: 100,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
  },
  buttonInline: {
    display: "flex",
    color: "#942a21",
  },
});

export default ExercisesView;
