var {
  NativeModules: {
    RNGeocoder
  }
} = require('react-native');

var Geocoder = {

  reverseGeocodeLocation: function(location, callback) {

    return new Promise((resolve, reject) => {

      RNGeocoder.reverseGeocodeLocation(location, (err) => {
        callback && callback(err, null);
        reject(err);
      }, (data) => {
        callback && callback(null, data);
        resolve(data);
      });
    });
  },

  geocodeAddress: function(address, callback) {

    return new Promise((resolve, reject) => {

      RNGeocoder.geocodeAddress(address, (err) => {
        callback && callback(err, null);
        reject(err);
      }, (data) => {
        callback && callback(null, data);
        resolve(data);
      });
    });
  }
};


module.exports = Geocoder;
