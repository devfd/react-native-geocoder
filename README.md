# react-native-geocoder
geocoding services for react native

## Install
```
npm install --save react-native-geocoder
```
## Installation iOS

1. In the XCode's "Project navigator", right click on Libraries folder under your project ➜ `Add Files to <...>`
2. Go to `node_modules` ➜ `react-native-geocoder` and add the `RNGeocoder.xcodeproj` file
3. Add libRNGeocoder.a to Build Phases -> Link Binary With Libraries

##Installation Android
1. In `android/setting.gradle`

```gradle
...
include ':RNGeocoder', ':app'
project(':RNGeocoder').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-geocoder/android')
```

3. In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    compile project(':RNGeocoder')
}
```

4. register module (in MainActivity.java)

```java
import com.devfd.RNGeocoder.RNGeocoderPackage; // <--- import

public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {
  ......

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    mReactRootView = new ReactRootView(this);

    mReactInstanceManager = ReactInstanceManager.builder()
      .setApplication(getApplication())
      .setBundleAssetName("index.android.bundle")
      .setJSMainModuleName("index.android")
      .addPackage(new MainReactPackage())
      .addPackage(new RNGeocoderPackage())              // <------ add here
      .setUseDeveloperSupport(BuildConfig.DEBUG)
      .setInitialLifecycleState(LifecycleState.RESUMED)
      .build();

    mReactRootView.startReactApplication(mReactInstanceManager, "ExampleRN", null);

    setContentView(mReactRootView);
  }
  ......
}
```

## Usage
```
var RNGeocoder = require('react-native-geocoder');

// Reverse Geocoding
var NY = {
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

