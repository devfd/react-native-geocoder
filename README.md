# react-native-geocoder
geocoding services for react native

## Install
```
npm install --save react-native-geocoder
```

Then add RNGeocoder folder to your xcode project.

## Usage
```
var RNGeocoder = require('react-native-geocoder');

// Reverse Geocoding
const NY = {
  latitude: 40.7809261,
  longitude: -73.9637594
};

RNGeocoder.reverseGeocodeLocation(NY, (err, data) => {
  if (err) {
    return;
  }

  console.log(data);
});

// Returned value
[
  {
    "postalCode":"10024",
    "subAdministrativeArea":"New York",
    "name":"Central Park",
    "locality":"New York",
    "subThoroughfare":"1000",
    "administrativeArea":"NY",
    "location":{
      "lat":40.7964708,
      "lng":-73.9545696
    },
    "country":"United States",
    "subLocality":"Manhattan",
    "thoroughfare":"5th Ave"
  }
]

// Address Geocoding
RNGeocoder.geocodeAddress('New York', (err, data) => {
  if (err) {
    return;
  }

  console.log(data);
});

// Returned value
[
  {
    "postalCode":null,
    "subAdministrativeArea":"New York",
    "name":"New York",
    "locality":"New York",
    "subThoroughfare":null,
    "administrativeArea":"NY",
    "location":{
      "lat":40.713054,
      "lng":-74.007228
    },
    "country":"United States",
    "subLocality":null,
    "thoroughfare":null
  }
]
```

## With Promise
```
RNGeocoder.reverseGeocodeLocation(NY).then((data) => {
  ...  
});

RNGeocoder.geocodeAddress('New York').then((data) => {
  ...
});
```

