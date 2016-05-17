/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Geocoder from 'react-native-geocoder';

class GeocoderE2EApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoInput: '',
      reverseInput: ''
    };
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <TextInput
          ref="geoInput"
          onChangeText={(text) => this.setState({geoInput: text})}
          value={this.state.geoInput}
        />
        <TouchableOpacity collapse={false} testId="toto" style={{padding: 10, backgroundColor: '#2c3e50'}} onPress={() => {
          this.refs.geoInput.blur();
          Geocoder.geocodeAddress(this.state.geoInput).then((res) => {
            this.setState({ result: res[0] });
          });
        }}>
          <Text testID="geocoderText" collapsable={false} style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: "#ecf0f1"}}>Geocode</Text>
        </TouchableOpacity>

        <TextInput
          ref="reverseInput"
          style={{marginTop: 50}}
          onChangeText={(text) => this.setState({reverseInput: text})}
          value={this.state.reverseInput}
        />
        <TouchableOpacity style={{padding: 10, backgroundColor: '#2c3e50'}} onPress={() => {
          this.refs.geoInput.blur();

          const [lat, lng] = this.state.reverseInput.split(' ');

          Geocoder.reverseGeocodeLocation({latitude: 1 * lat, longitude: 1 * lng}).then((res) => {
            this.setState({ result: res[0] });
          });
        }}>
          <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: "#ecf0f1"}}>Reverse geocode</Text>
        </TouchableOpacity>

        { this.state.result &&
          <View testID="hello" collapsable={false} style={{marginTop: 50, padding: 20, borderWidth: 1, borderColor: 'orange'}}>
            <Text>Locality: {this.state.result.locality}</Text>
            <Text>LatLng: {this.state.result.position.lat}, {this.state.result.position.lng}</Text>
          </View>
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('GeocoderE2EApp', () => GeocoderE2EApp);
