#import "RNGeocoder.h"

#import <CoreLocation/CoreLocation.h>

#import <React/RCTConvert.h>

@implementation RCTConvert (CoreLocation)

+ (CLLocation *)CLLocation:(id)json
{
  json = [self NSDictionary:json];

  double lat = [RCTConvert double:json[@"lat"]];
  double lng = [RCTConvert double:json[@"lng"]];
  return [[CLLocation alloc] initWithLatitude:lat longitude:lng];
}

@end


@implementation RNGeocoder

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(geocodePosition:(CLLocation *)location
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (!self.geocoder) {
    self.geocoder = [[CLGeocoder alloc] init];
  }

  if (self.geocoder.geocoding) {
    [self.geocoder cancelGeocode];
  }

  [self.geocoder reverseGeocodeLocation:location completionHandler:^(NSArray *placemarks, NSError *error) {

    if (error) {
      if (placemarks.count == 0) {
          return reject(@"NOT_FOUND", @"geocodePosition failed", error);
      }

      return reject(@"ERROR", @"geocodePosition failed", error);
    }

    resolve([self placemarksToDictionary:placemarks]);

  }];
}

RCT_EXPORT_METHOD(geocodeAddress:(NSString *)address
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (!self.geocoder) {
        self.geocoder = [[CLGeocoder alloc] init];
    }

    if (self.geocoder.geocoding) {
      [self.geocoder cancelGeocode];
    }

    [self.geocoder geocodeAddressString:address completionHandler:^(NSArray *placemarks, NSError *error) {

        if (error) {
            if (placemarks.count == 0) {
              return reject(@"NOT_FOUND", @"geocodeAddress failed", error);
            }

            return reject(@"ERROR", @"geocodeAddress failed", error);
        }

        resolve([self placemarksToDictionary:placemarks]);
  }];
}

- (NSArray *)placemarksToDictionary:(NSArray *)placemarks {

  NSMutableArray *results = [[NSMutableArray alloc] init];

  for (int i = 0; i < placemarks.count; i++) {
    CLPlacemark* placemark = [placemarks objectAtIndex:i];

    NSString* name = [NSNull null];

    if (![placemark.name isEqualToString:placemark.locality] &&
        ![placemark.name isEqualToString:placemark.thoroughfare] &&
        ![placemark.name isEqualToString:placemark.subThoroughfare])
    {

        name = placemark.name;
    }

    NSArray *lines = placemark.addressDictionary[@"FormattedAddressLines"];

    NSDictionary *result = @{
     @"feature": name,
     @"position": @{
         @"lat": [NSNumber numberWithDouble:placemark.location.coordinate.latitude],
         @"lng": [NSNumber numberWithDouble:placemark.location.coordinate.longitude],
         },
     @"country": placemark.country ?: [NSNull null],
     @"countryCode": placemark.ISOcountryCode ?: [NSNull null],
     @"locality": placemark.locality ?: [NSNull null],
     @"subLocality": placemark.subLocality ?: [NSNull null],
     @"streetName": placemark.thoroughfare ?: [NSNull null],
     @"streetNumber": placemark.subThoroughfare ?: [NSNull null],
     @"postalCode": placemark.postalCode ?: [NSNull null],
     @"adminArea": placemark.administrativeArea ?: [NSNull null],
     @"subAdminArea": placemark.subAdministrativeArea ?: [NSNull null],
     @"formattedAddress": [lines componentsJoinedByString:@", "] ?: [NSNull null]
   };

    [results addObject:result];
  }

  return results;

}

@end
