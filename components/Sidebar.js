import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Sidebar = (props) => {
  const userList = props.connectedUsers;

  console.log('In sidebar userlist:', userList);

  let selectedUser = '';

  const userName_from_click = (username) => {
    selectedUser = username;
    let selectedUserDetails = userList.find(
      (user) => user.username === selectedUser
    );

    console.log('In sidebar the user details:', selectedUserDetails);
    props.selectUser(selectedUserDetails);
  };

  let showUsers = userList.map((user) => {
    return (
      <TouchableOpacity
        key={user.key}
        style={styles.userListEl}
        onPress={() => userName_from_click(user.username)}
      >
        <Text>{user.username}</Text>
      </TouchableOpacity>
    );
  });

  return <View>{showUsers}</View>;
};

const styles = StyleSheet.create({
  userListEl: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default Sidebar;
