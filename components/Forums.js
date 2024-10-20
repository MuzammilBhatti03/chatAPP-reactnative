import React from 'react';
import { View, FlatList, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const data = [
  {
    id: "1",
    title: "Covid19",
    description: "Trends, precautionary measures and vaccine information",
    image: require("../assets/messagelogo.png"),
  },
  {
    id: "2",
    title: "Netflix Dark",
    description: "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
    image: require("../assets/messagelogo.png"),
  },
  {
    id: "3",
    title: "IPL 2020",
    description: "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
    image: require("../assets/messagelogo.png"),
  },
  {
    id: "4",
    title: "Black Lives Matter",
    description: "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
    image: require("../assets/messagelogo.png"),
  },
  {
    id: "5",
    title: "Nolan’s Tenet",
    description: "Lorem ipsum mollit non deserunt ullamco est sit aliqua dolor do",
    image: require("../assets/messagelogo.png"),
  },
];

const Forums = ({ navigation, route }) => {
  const { user } = route.params;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("Chat", {
          name: user,
          topic: item.title,
          description: item.description,
        })
      }
    >
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22283F",
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#333B56",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    fontSize: 14,
    color: "#bbb",
  },
});

export default Forums;
