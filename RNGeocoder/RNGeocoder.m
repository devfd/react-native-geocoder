#import "RNGeocoder.h"

#import <CoreLocation/CoreLocation.h>

#import "RCTConvert.h"

@implementation RCTConvert (CoreLocation)

+ (CLLocation *)CLLocation:(id)json
{
  json = [self NSDictionary:json];

  double lat = [RCTConvert double:json[@"latitude"]];
  double lng = [RCTConvert double:json[@"longitude"]];
  return [[CLLocation alloc] initWithLatitude:lat longitude:lng];
}

@end


@implementation RNGeocoder

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(reverseGeocodeLocation:(CLLocation *)location errorCallback: (RCTResponseSenderBlock)errorCallback successCallback: (RCTResponseSenderBlock)successCallback)
{
  if (!self.geocoder) {
    self.geocoder = [[CLGeocoder alloc] init];
  }

  [self.geocoder cancelGeocode];

  [self.geocoder reverseGeocodeLocation:location completionHandler:^(NSArray *placemarks, NSError *error) {

    if (error) {
      if (placemarks.count == 0) {
        return errorCallback(@[@"Not found"]);
      }

      return errorCallback(@[error.description]);
    }


    successCallback(@[[self placemarksToDictionary:placemarks]]);

  }];
}

RCT_EXPORT_METHOD(geocodeAddress:(NSString *)address errorCallback: (RCTResponseSenderBlock)errorCallback successCallback: (RCTResponseSenderBlock)successCallback)
{
  if (!self.geocoder) {
    self.geocoder = [[CLGeocoder alloc] init];
  }

  [self.geocoder cancelGeocode];

  [self.geocoder geocodeAddressString:address completionHandler:^(NSArray *placemarks, NSError *error) {

    if (error) {
      if (placemarks.count == 0) {
        return errorCallback(@[@"Not found"]);
      }

      return errorCallback(@[error.description]);
    }

    successCallback(@[[self placemarksToDictionary:placemarks]]);

  }];
}

- (NSArray *)placemarksToDictionary:(NSArray *)placemarks {

  NSMutableArray *results = [[NSMutableArray alloc] init];

  for (int i = 0; i < placemarks.count; i++) {
    CLPlacemark* placemark = [placemarks objectAtIndex:i];

    NSDictionary *result = @{
     @"name": placemark.name ?: [NSNull null],
     @"location": @{
         @"lat": [NSNumber numberWithDouble:placemark.location.coordinate.latitude],
         @"lng": [NSNumber numberWithDouble:placemark.location.coordinate.longitude],
         },
     @"country": placemark.country ?: [NSNull null],
     @"locality": placemark.locality ?: [NSNull null],
     @"subLocality": placemark.subLocality ?: [NSNull null],
     @"thoroughfare": placemark.thoroughfare ?: [NSNull null],
     @"subThoroughfare": placemark.subThoroughfare ?: [NSNull null],
     @"postalCode": placemark.postalCode ?: [NSNull null],
     @"administrativeArea": placemark.administrativeArea ?: [NSNull null],
     @"subAdministrativeArea": placemark.subAdministrativeArea ?: [NSNull null],
   };

    [results addObject:result];
  }

  return results;

}

@end
