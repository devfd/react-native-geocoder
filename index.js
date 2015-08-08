var {
  NativeModules: {
    RNGeocoder
  }
} = require('react-native');

var Geocoder = {

  reverseGeocodeLocation: function(location, callback) {

    return new Promise((resolve, reject) => {

      RNGeocoder.reverseGeocodeLocation(location, (err, data) => {
        callback && callback(err, data);

        if (err) {
          return reject(err);
        }

        resolve(data);
      });

    });
  },

  geocodeAddress: function(address, callback) {

    return new Promise((resolve, reject) => {

      RNGeocoder.geocodeAddress(address, (err, data) => {
        callback && callback(err, data);

        if (err) {
          return reject(err);
        }

        resolve(data);
      });

    });
  }
};


module.exports = Geocoder;
