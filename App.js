import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, View, TextInput, Button, Picker, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import querystring from 'querystring';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.sendToCcm = this.sendToCcm.bind(this);
    this.statusTable = [
      'Complete',
      'Loaner',
      'On Way',
      'Parts',
      'Returning',
      'To Shop',
    ];
    AsyncStorage.getItem('tech').then((tech) =>
      this.setState({tech})
    );
    AsyncStorage.getItem('workorder').then((workorder) =>
      this.setState({workorder})
    );
    this.state = {
      tech: '',
      workorder: '',
      description: '',
      status: 0,
      button: "royalblue",
      isTimeVisible: false
    };
  }
  showDateTimePicker = () => this.setState({ isTimeVisible: true });

  hideDateTimePicker = () => this.setState({ isTimeVisible: false });

  handleDatePicked = (time) => {
      this.setState({time})
      this.hideDateTimePicker();
    };

  sendToCcm = () => {
    this.setState({button:"grey"});
    AsyncStorage.setItem('tech', this.state.tech);
    AsyncStorage.setItem('workorder', this.state.workorder);

    if (typeof this.state.time === "object") {
      time = this.state.time.toString().slice(16,21).replace(":", "")
    } else {
      time = ""
    }

    let mailProp = querystring.stringify({
      tech: this.state.tech,
      workorder: this.state.workorder,
      status: this.statusTable[this.state.status],
      description: this.state.description,
      time: time,
    });

    fetch('http://74.95.36.77:1080/capture-api/time', {
      method: 'POST',
      body: mailProp,
    }).then(response => {
      if (!response.ok) {
        this.setState({button: "red"});
      } else {
        this.setState({button: "green"});
      }
      setTimeout(() => {
        this.setState({button: "royalblue"});
      }, 1500)
    }).catch(error => {console.log(error);
      this.setState({button: "red"});
    });
  }

  render() {
    let select = this.statusTable.map((status, index) => {
      return <Picker.Item value={index} label={status} key={index}/>;
    });

    return (
      <View
        style={styles.container} >
        <View style={{width:300}} >

          <TextInput
            autoCapitalize='characters'
            style = {styles.input}
            placeholder="Tech"
            value={this.state.tech}
            onChangeText={tech => {
              this.setState({ tech });
            }}
          />

          <TextInput
            autoCapitalize='characters'
            value={this.state.workorder}
            style = {styles.input}
            onChangeText={workorder => {
              this.setState({workorder});
            }}
            placeholder="Work Order"
          />

          <Picker
            selectedValue={this.state.status}
            style = {styles.picker}
            onValueChange={(selected, index) =>
              this.setState({ status: index })
            }>
              {select}
          </Picker>

          <TextInput
            value={this.state.description}
            multiline={true}
            onChangeText={value => {
              this.setState({ description: value });
            }}
            placeholder="Notes"
            style = {styles.input}
          />

          <TouchableOpacity
            onPress={this.showDateTimePicker}>
              <Text style={styles.touchText}>Manual Time</Text>
          </TouchableOpacity>

          <Button
            onPress={this.sendToCcm}
            title="Update"
            color={this.state.button}
          />

          <DateTimePicker
            isVisible={this.state.isTimeVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode='time'
          />

        </View>
        <View style={{height:300}}></View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      height:200
    },
    input: {
      alignSelf: 'center',
      width: 300,
      fontSize:20,
      padding:10
    },
    picker: {
      transform: [
        { scaleX: 1.0 },
        { scaleY: 1.3 },
      ]
    },
    touchText: {
      fontSize:18,
      padding:5
    }
  })
