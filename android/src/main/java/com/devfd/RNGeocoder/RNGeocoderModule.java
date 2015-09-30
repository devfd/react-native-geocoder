package com.devfd.RNGeocoder;

import android.location.Address;
import android.location.Geocoder;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import org.json.JSONArray;

import java.io.IOException;
import java.util.List;

public class RNGeocoderModule extends ReactContextBaseJavaModule {

  public RNGeocoderModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "RNGeocoder";
  }

  @ReactMethod
  public void geocodeAddress(String addressName, Callback errorCallback, Callback successCallback) {
    Geocoder geocoder = new Geocoder(getReactApplicationContext());
    try {
      List<Address> addresses = geocoder.getFromLocationName(addressName, 20);
      successCallback.invoke(transform(addresses));
    }
    catch (IOException e) {
      errorCallback.invoke(e.getMessage());
    }
  }

  @ReactMethod
  public void reverseGeocodeLocation(ReadableMap position, Callback errorCallback, Callback successCallback) {
    Geocoder geocoder = new Geocoder(getReactApplicationContext());

    try {
      List<Address> addresses = geocoder.getFromLocation(position.getDouble("latitude"), position.getDouble("longitude"), 20);
      successCallback.invoke(transform(addresses));
    }
    catch (IOException e) {
      errorCallback.invoke(e.getMessage());
    }

  }

  WritableArray transform(List<Address> addresses) {
    WritableArray results = new WritableNativeArray();

    for (Address address: addresses) {
      WritableMap result = new WritableNativeMap();

      WritableMap position = new WritableNativeMap();
      position.putDouble("lat", address.getLatitude());
      position.putDouble("lng", address.getLongitude());
      result.putMap("position", position);

      result.putString("locality", address.getLocality());
      result.putString("adminArea", address.getAdminArea());
      result.putString("country", address.getCountryName());
      result.putString("countryCode", address.getCountryCode());
      result.putString("locale", address.getLocale().toString());
      result.putString("postalCode", address.getPostalCode());
      result.putString("subAdminArea", address.getSubAdminArea());
      result.putString("subLocality", address.getSubLocality());
      result.putString("subThoroughfare", address.getSubThoroughfare());
      result.putString("thoroughfare", address.getThoroughfare());
      results.pushMap(result);
    }

    return results;
  }
}
