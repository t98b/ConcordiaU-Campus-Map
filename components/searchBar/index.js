/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  View, Button, Keyboard
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { SearchBar } from 'react-native-elements';
import styles from './styles';

export default class searchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPredictions: true,
      destination: '',
      predictions: [],
      locations: '',
      region: {
        latitude: 45.492409,
        longitude: -73.582153,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    };
  }


  async onChangeDestination(destination) {
    this.setState({ destination });
    const key = 'AIzaSyCqNODizSqMIWbKbO8Iq3VWdBcK846n_3w';
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${key}&input=${destination}&location=45.492409, -73.582153&radius=2000`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      // console.log(json);
      this.setState({
        predictions: json.predictions

      });
    } catch (err) {
      console.error(err);
    }
  }

  async getLatLong(prediction) {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ description: prediction });
    const key = 'AIzaSyCqNODizSqMIWbKbO8Iq3VWdBcK846n_3w';
    const geoUrl = `https://maps.googleapis.com/maps/api/place/details/json?key=${key}&placeid=${prediction}`;

    try {
      const georesult = await fetch(geoUrl);
      const gjson = await georesult.json();
      this.setState({ locations: gjson.result.geometry.location });

      this.setState({
        region: {
          // eslint-disable-next-line react/no-access-state-in-setstate
          latitude: this.state.locations.lat,
          // eslint-disable-next-line react/no-access-state-in-setstate
          longitude: this.state.locations.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }

      });
      this.props.callBack(this.state.region);
    } catch (err) {
      console.error(err);
    }
  }


  render() {
    const predictions = this.state.predictions.map((prediction) => {
      return (
        <View style={styles.sug} key={prediction.id}>
          <Button
            key={prediction.id}
            color="black"
            style={styles.suggestions}
            title={prediction.description}
            onPress={() => {
              this.setState({ destination: prediction.description });
              this.getLatLong(prediction.place_id);
              this.setState({ showPredictions: false });
              Keyboard.dismiss();
            }}
          />
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <View>
          <SearchBar
            lightTheme
            placeholder="Search..."
            onChangeText={(destination) => { return this.onChangeDestination(destination); }}
            value={this.state.destination}
            style={styles.SearchBar}
            onClear={() => { this.setState({ showPredictions: true }); }}
          />


        </View>
        {
            this.state.showPredictions
              ? predictions : null
          }

      </View>
    );
  }
}
