import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Platform,
  RefreshControl,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import { Content } from "native-base";
import AuthModal from "../../Auth/AuthModal";
import { serverApi } from "../../../components/API";
import ListCard from "../../ListCard";
import OrderCard from "../../../components/Cards/OrderCard";
import Loader from "../../../components/Loader";
import { withNavigation } from "react-navigation";

const ListScreen = props => {
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState(props.order);
  const refresh = async () => {
    try {
      setRefreshing(true);
      const selectedCampus = await AsyncStorage.getItem("campus");
      let getCampusOrders = await serverApi.getCampusOrders(selectedCampus);
      // console.log(`refresh: `, getAllOrders);
      setOrders([...getCampusOrders.data.data.orders]);

      console.log(`order: `, getCampusOrders);
    } catch (e) {
      console.log(`Can't refresh data. error message: ${e}`);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <Content>
          {props.orders &&
            props.orders.map((data, i) => (
              <View key={i}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("OrderDetailScreen");
                  }}
                >
                  <ListCard data={data} />
                  {/* <OrderCard {...data} /> */}
                </TouchableOpacity>
              </View>
            ))}
        </Content>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  headerStyle: {
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    backgroundColor: "white",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? 20 : 0 // android top-tab statusbar overlap fix
  },
  titleStyle: {
    color: "black"
  },
  footerStyle: {
    borderTopWidth: 0.5,
    borderTopColor: "gray",
    backgroundColor: "white",
    justifyContent: "center"
  }
});

export default withNavigation(ListScreen);
