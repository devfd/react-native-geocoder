import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('geocoder', function() {
  let Geocoder, RNGeocoder, GoogleApi;

  beforeEach(function() {
    GoogleApi = {
      geocodePosition: sinon.stub().returns(Promise.resolve('google')),
      geocodeAddress: sinon.stub().returns(Promise.resolve('google')),
    };

    RNGeocoder = {
      geocodePosition: sinon.stub().returns(Promise.resolve()),
      geocodeAddress: sinon.stub().returns(Promise.resolve()),
    };

    Geocoder = proxyquire
      .noCallThru()
      .load('../../js/geocoder.js', {
        './googleApi.js': GoogleApi,
        'react-native': {
          NativeModules: { RNGeocoder },
        }
      }).default;
  });

  it ('can be required', function() {
    let GeocoderPkg = proxyquire
      .noCallThru()
      .load('../../', {
        './js/geocoder.js': { valid: true },
      }).default;

    expect(GeocoderPkg.valid).to.be.ok;
  });

  describe('geocodePosition', function() {

    it ('requires a valid position', async function(done) {
      try {
        await Geocoder.geocodePosition({});
        done(new Error('should not be there'));
      }
      catch(err) {
        expect(err).to.be.ok;
        expect(err.message).to.contain('valid');
        done();
      }
    });

    it ('returns geocoding results', async function() {
      const position = {lat: 1.234, lng: 4.567};
      await Geocoder.geocodePosition(position);
      expect(RNGeocoder.geocodePosition).to.have.been.calledWith(position);
    });

    it ('does not call google api if no apiKey', async function(done) {
      const position = {lat: 1.234, lng: 4.567};
      RNGeocoder.geocodePosition = sinon.stub().returns(Promise.reject());
      try {
        await Geocoder.geocodePosition(position);
        done(new Error('should not be there'));
      } catch(err) {
        expect(GoogleApi.geocodePosition).to.not.have.been.called;
        done();
      }
    });

    it ('fallbacks to google api when not available', async function() {
      const position = {lat: 1.234, lng: 4.567};
      RNGeocoder.geocodePosition = sinon.stub().returns(Promise.reject({code: 'NOT_AVAILABLE'}));
      Geocoder.fallbackToGoogle('myGoogleMapsAPIKey');
      const ret = await Geocoder.geocodePosition(position);
      expect(GoogleApi.geocodePosition).to.have.been.calledWith('myGoogleMapsAPIKey', position);
      expect(ret).to.eql('google');
    });

    it ('does not fallback to google api on error', async function(done) {
      const position = {lat: 1.234, lng: 4.567};
      RNGeocoder.geocodePosition = sinon.stub().returns(Promise.reject(new Error('something wrong')));
      Geocoder.fallbackToGoogle('myGoogleMapsAPIKey');
      try {
        const ret = await Geocoder.geocodePosition(position);
        done(new Error('should not be called'));
      }
      catch(err) {
        expect(err.message).to.eql('something wrong');
        done();
      }
    });
  });

  describe('geocodeAddress', function() {
    it ('requires a valid address', async function(done) {
      try {
        await Geocoder.geocodeAddress();
        done(new Error('should not be there'));
      }
      catch(err) {
        expect(err).to.be.ok;
        expect(err.message).to.contain('address is null');
        done();
      }
    });

    it ('returns geocoding results', async function() {
      const address = 'london';
      await Geocoder.geocodeAddress(address);
      expect(RNGeocoder.geocodeAddress).to.have.been.calledWith(address);
    });

    it ('does not call google api if no apiKey', async function(done) {
      const address = 'london';
      RNGeocoder.geocodeAddress = sinon.stub().returns(Promise.reject());
      try {
        await Geocoder.geocodeAddress(address);
        done(new Error('should not be here'));
      } catch(err) {
        expect(GoogleApi.geocodeAddress).to.not.have.been.called;
        done();
      }
    });

    it ('does not fallback to google api on error', async function(done) {
      const address = 'london';
      RNGeocoder.geocodeAddress = sinon.stub().returns(Promise.reject(new Error('something wrong')));
      Geocoder.fallbackToGoogle('myGoogleMapsAPIKey');
      try {
        const ret = await Geocoder.geocodeAddress(address);
        done(new Error('should not be called'));
      }
      catch(err) {
        expect(err.message).to.eql('something wrong');
        done();
      }
    });

    it ('fallbacks to google api on error', async function() {
      const address = 'london';
      RNGeocoder.geocodeAddress = sinon.stub().returns(Promise.reject({code: 'NOT_AVAILABLE'}));
      Geocoder.fallbackToGoogle('myGoogleMapsAPIKey');
      const ret = await Geocoder.geocodeAddress(address);
      expect(GoogleApi.geocodeAddress).to.have.been.calledWith('myGoogleMapsAPIKey', address);
      expect(ret).to.eql('google');
    });
  });
});
