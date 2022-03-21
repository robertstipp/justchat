const users = [];

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "Username is in use",
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1);
  }
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);

  if (!user) {
    return {
      error: "No user available",
    };
  }
  return user;
};

const getUsersInRoom = (room) => {
  const usersInRoom = users.filter((user) => user.room === room);
  if (usersInRoom.length === 0) {
    return {
      error: "No users in room",
    };
  }
  return usersInRoom;
};

addUser({
  id: 22,
  username: "just bobby",
  room: "playa",
});

addUser({
  id: 33,
  username: "just robert",
  room: "playa",
});

addUser({
  id: 44,
  username: "just dave",
  room: "venice",
});

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
