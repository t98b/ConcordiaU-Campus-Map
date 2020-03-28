import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Agenda } from 'react-native-calendars';

export default class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      synchronizedEvents: this.structureSynchronizedEvents(
        props.navigation.state.params.jsonFile.items
      )
    };
  }

  structureSynchronizedEvents(events) {
    let tempArray = [];
    events.forEach(event => {
      tempArray.push(
        {
          date: event.start.dateTime != null ? event.start.dateTime.substring(0,event.start.dateTime.indexOf('T')):event.start.date,
          title: event.summary!=null ? event.summary:'No Title For this Event',
          startTime: event.start.dateTime != null ? event.start.dateTime : event.start.date,
          endTime: event.end.dateTime != null ? event.end.dateTime : event.end.date,
          description: event.description != null ?event.description : '',
          address: ''
        }
      )
    });
    this.setState({
      synchronizedEvents: this.tempArray
    });
    console.log('temp:\n', tempArray, '--->\n\n\-n>>>>');
    return tempArray;
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const todayEvents = this.state.synchronizedEvents
            .filter((event) => { return strTime === event.date; });
          const numItems = todayEvents.length;
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: todayEvents[j].title,
              startTime: todayEvents[j].startTime,
              endTime: todayEvents[j].endTime,
              description: todayEvents[j].description,
              address: todayEvents[j].address,
              height: 80
            });
          }
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  renderItem(item) {
    return (
      <TouchableOpacity
        style={[styles.item, { height: item.height }]}
        onPress={() => Alert.alert(item.name,`${item.startTime}  -  ${item.endTime}\n${item.description}\n${item.address}`)}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      /View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  render() {
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2020-03-27'}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
      />
    );
  }


        
          
        
          
        
          rowHasChanged(r1, r2) {
            return r1.name !== r2.name;
          }
        
          timeToString(time) {
            const date = new Date(time);
            return date.toISOString().split('T')[0];
          }
        }
       
        const styles = StyleSheet.create({
          item: {
            backgroundColor: 'white',
            flex: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            marginTop: 17
          },
          emptyDate: {
            height: 15,
            flex:1,
            paddingTop: 30
          }
        });
        