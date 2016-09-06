package com.devfd.RNGeocoder;

import android.location.Address;
import android.location.Geocoder;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.io.IOException;
import java.util.List;

public class RNGeocoderModule extends ReactContextBaseJavaModule {

    private Geocoder geocoder;

    public RNGeocoderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        geocoder = new Geocoder(reactContext.getApplicationContext());
    }

    @Override
    public String getName() {
        return "RNGeocoder";
    }

    @ReactMethod
    public void geocodeAddress(String addressName, Promise promise) {
        if (!geocoder.isPresent()) {
          promise.reject("NOT_AVAILABLE", "Geocoder not available for this platform");
          return;
        }

        try {
            List<Address> addresses = geocoder.getFromLocationName(addressName, 20);
            promise.resolve(transform(addresses));
        }

        catch (IOException e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void geocodePosition(ReadableMap position, Promise promise) {
        if (!geocoder.isPresent()) {
            promise.reject("NOT_AVAILABLE", "Geocoder not available for this platform");
            return;
        }

        try {
            List<Address> addresses = geocoder.getFromLocation(position.getDouble("lat"), position.getDouble("lng"), 20);
            promise.resolve(transform(addresses));
        }
        catch (IOException e) {
            promise.reject(e);
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

            final String feature_name = address.getFeatureName();
            if (feature_name != null && !feature_name.equals(address.getSubThoroughfare()) &&
                    !feature_name.equals(address.getThoroughfare()) &&
                    !feature_name.equals(address.getLocality())) {

                result.putString("feature", feature_name);
            }
            else {
                result.putString("feature", null);
            }

            result.putString("locality", address.getLocality());
            result.putString("adminArea", address.getAdminArea());
            result.putString("country", address.getCountryName());
            result.putString("countryCode", address.getCountryCode());
            result.putString("locale", address.getLocale().toString());
            result.putString("postalCode", address.getPostalCode());
            result.putString("subAdminArea", address.getSubAdminArea());
            result.putString("subLocality", address.getSubLocality());
            result.putString("streetNumber", address.getSubThoroughfare());
            result.putString("streetName", address.getThoroughfare());

            StringBuilder sb = new StringBuilder();

            for (int i = 0; i <= address.getMaxAddressLineIndex(); i++) {
                if (i > 0) {
                    sb.append(", ");
                }
                sb.append(address.getAddressLine(i));
            }

            result.putString("formattedAddress", sb.toString());

            results.pushMap(result);
        }

        return results;
    }
}
