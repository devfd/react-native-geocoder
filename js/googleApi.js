const googleUrl = 'https://maps.google.com/maps/api/geocode/json';

function format(raw) {
  const address = {
    position: {},
    formattedAddress: raw.formatted_address || '',
    feature: null,
    streetNumber: null,
    streetName: null,
    postalCode: null,
    locality: null,
    country: null,
    countryCode: null,
    adminArea: null,
    subAdminArea: null,
    subLocality: null,
  };

  if (raw.geometry && raw.geometry.location) {
    address.position = {
      lat: raw.geometry.location.lat,
      lng: raw.geometry.location.lng,
    }
  }

  for (let component of raw.address_components) {
    if (component.types.includes('route')) {
      address.streetName = component.long_name;
    }
    else if (component.types.includes('street_number')) {
      address.streetNumber = component.long_name;
    }
    else if (component.types.includes('country')) {
      address.country = component.long_name;
      address.countryCode = component.short_name;
    }
    else if (component.types.includes('locality')) {
      address.locality = component.long_name;
    }
    else if (component.types.includes('postal_code')) {
      address.postalCode = component.long_name;
    }
    else if (component.types.includes('administrative_area_level_1')) {
      address.adminArea = component.long_name;
    }
    else if (component.types.includes('administrative_area_level_2')) {
      address.subAdminArea = component.long_name;
    }
    else if (component.types.includes('sublocality') || component.types.includes('sublocality_level_1')) {
      address.subLocality = component.long_name;
    }
    else if (component.types.includes('point_of_interest') || component.types.includes('colloquial_area')) {
      address.feature = component.long_name;
    }
  }

  return address;
}

export default {
  geocodePosition(apiKey, position) {
    if (!apiKey || !position || !position.lat || !position.lng) {
      return Promise.reject(new Error("invalid apiKey / position"));
    }

    return this.googleRequest(`${googleUrl}?key=${apiKey}&latlng=${position.lat},${position.lng}`);
  },

  geocodeAddress(apiKey, address) {
    if (!apiKey || !address) {
      return Promise.reject(new Error("invalid apiKey / address"));
    }

    return this.googleRequest(`${googleUrl}?key=${apiKey}&address=${encodeURI(address)}`);
  },

  async googleRequest(url) {
    const res = await fetch(url);
    const json = await res.json();

    if (!json.results || json.status !== 'OK') {
      return Promise.reject(new Error(`geocoding error ${json.status}, ${json.error_message}`));
    }

    return json.results.map(format);
  }
}
