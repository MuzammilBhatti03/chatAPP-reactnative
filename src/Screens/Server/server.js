const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.fetched_userName;
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  console.log(`${socket.username} connected`);

  // Allow user to join a room (chat group) based on the topic
  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`${socket.username} joined room: ${room}`);
  });

  socket.on("private message", ({ content, room }) => {
    console.log("Content:", content, " Room:", room);

    // Broadcast to all users in the room
    io.to(room).emit("private message", {
      content,
      from: socket.username, // Send the username rather than socket id
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected`);
  });
});

http.listen(4200, () => {
  console.log("Listening on port 4200");
});
