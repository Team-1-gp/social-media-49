const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

const port = 3000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/",
  },
});

let users = [];
let posts = [];

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  console.log("username: ", socket.handshake.auth.username);

  if (socket.handshake.auth.username) {
    users.push({
      id: socket.id,
      username: socket.handshake.auth.username,
    });
  }

  io.emit("users", users);

  socket.emit("posts", posts);

  socket.on("post", (post) => {
    posts.unshift(post);
    io.emit("posts", posts);
  });

  socket.on("comment", (updatedPost) => {
    const postIndex = posts.findIndex((post) => post.id === updatedPost.id);
    if (postIndex !== -1) {
      posts[postIndex] = updatedPost;
      io.emit("comment", updatedPost);
    }
  });

  socket.on("like", (updatedPost) => {
    const postIndex = posts.findIndex((post) => post.id === updatedPost.id);
    if (postIndex !== -1) {
      posts[postIndex] = updatedPost;
      io.emit("like", updatedPost);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    users = users.filter((u) => u.id !== socket.id);
    io.emit("users", users);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});