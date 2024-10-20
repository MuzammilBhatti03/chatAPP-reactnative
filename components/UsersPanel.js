import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const socket = io("http://192.168.0.110:4200"); // Socket connection

const UsersPanel = ({ navigation, route }) => {
  const { user } = route.params;
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    socket.on('users', (users) => {
      setConnectedUsers(users);
    });

    return () => socket.off('users');
  }, []);

  const handleSelectUser = (selectedUser) => {
    navigation.navigate("Chat", { name: user, recipient: selectedUser.name, recipientId: selectedUser.id });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleSelectUser(item)}>
      <Text style={styles.userName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connected Users</Text>
      <FlatList
        data={connectedUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#22283F',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 10,
  },
  userItem: {
    backgroundColor: '#333B56',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UsersPanel;
