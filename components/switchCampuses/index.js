import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

export default class SwitchCampuses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
      },
    };
  }


  async setLoyola() {
    const state = await this.setState({
      region: {
        latitude: 45.458025,
        longitude: -73.640192,
      }
    });
    this.props.callBack(this.state.region);
  }

  async setSGW() {
    const state = await this.setState({
      region: {
        latitude: 45.495598,
        longitude: -73.577850,
      }
    });
    this.props.callBack(this.state.region);
  }

  render() {
    if (this.props.visiblityState) {
      return (
        <View style={styles.container}>
          <View style={styles.btn}>
            <Button
              title="Loyola"
              onPress={() => { return this.setLoyola(); }}
            />

          </View>

          <View style={styles.btn}>
            <Button
              title="SGW"
              onPress={() => { return this.setSGW(); }}
            />
          </View>
        </View>
      );
    }
    return null;
  }
}
