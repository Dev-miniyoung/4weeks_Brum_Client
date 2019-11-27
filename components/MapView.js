import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  AsyncStorage
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Container } from "native-base";
import { DestinationInput } from "./Inputs/DestinationInput";
import { DepartureInput } from "./Inputs/DepartureInput";
import { connect } from "react-redux";
import {
  departureSave,
  arrivalSave
} from "../redux/actions/orderPositionActions";

import constants from "../constants";

const LATITUDE = 37.565687;
const LONGITUDE = 126.978045;

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  center: {
    alignContent: "center",
    justifyContent: "center",
    flex: 1
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.5)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 100
  },
  latlng: {
    width: 200,
    alignItems: "stretch"
  },
  centeredText: { textAlign: "center" }
});

const MapScreen = props => {
  const { latitude = LATITUDE, longitude = LONGITUDE } = props;
  const [regions, setRegions] = useState({});

  const region = {
    latitude,
    longitude,
    latitudeDelta: constants.LATITUDE_DELTA,
    longitudeDelta: constants.LONGITUDE_DELTA
  };
  // props.reduxDeparturePosition(address[0]);

  const geoCode = async address => {
    const geo = await Location.geocodeAsync(address);
    return geo;
  };

  const reverseGeocode = async location => {
    const reverseGeo = await Location.reverseGeocodeAsync(location);
    return reverseGeo;
  };

  const recordEvent = async regionChange => {
    const address = await reverseGeocode(regionChange);
    // const geolatlng = await geoCode(this.props.orderDestination);
    console.log("address", address[0]);
    // console.log("geolatlng", geolatlng);
    setRegions(address[0]);
  };
  useEffect(() => {
    recordEvent();
  }, []);

  //   <View style={[styles.bubble, styles.latlng]}>
  //   <Text style={styles.centeredText}>
  //     {regions.region}
  //     {regions.street}
  //     {regions.name}
  //   </Text>
  // </View>
  return (
    <>
      <Container>
        <DepartureInput destination={this.props || undefined} />
        <DestinationInput destination={regions} />
        <MapView
          style={styles.mapStyle}
          provider="google"
          ref={map => {
            this.map = map;
          }}
          initialRegion={region}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={regionChange => recordEvent(regionChange)}
          showsCompass={true}
          showsUserLocation={props.showLocation === false ? false : true}
          showsMyLocationButton={false}
          followsUserLocation={true}
          zoomEnabled={true}
          scrollEnabled={true}
          showsScale={true}
          rotateEnabled={false}
          loadingEnabled={true}
        >
          <Marker coordinate={{ latitude: LATITUDE, longitude: LONGITUDE }} />
        </MapView>
      </Container>
    </>
  );
};

const mapStateToProps = state => {
  // Redux Store --> Component
  return {
    loggedIn: state.authReducer.loggedIn,
    orderDestination: state.destinationReducer.destination
  };
};
const mapDispatchToProps = dispatch => {
  // Action
  return {
    // Login
    reduxDeparturePosition: departure => dispatch(departureSave(departure)),
    reduxArrivalPosition: arrival => dispatch(arrivalSave(arrival))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
