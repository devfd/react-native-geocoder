import { NativeModules } from 'react-native';

const { RNGeocoder } = NativeModules;

export default {

  geocodePosition(position) {
    if (!position || !position.lat || !position.lng) {
      return Promise.reject(new Error("invalid position: {lat, lng} required"));
    }

    return RNGeocoder.geocodePosition(position);
  },

  geocodeAddress(address) {
    if (!address) {
      return Promise.reject(new Error("address is null"));
    }

    return RNGeocoder.geocodeAddress(address);
  },
}
