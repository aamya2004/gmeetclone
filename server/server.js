const { Server } = require("socket.io");

const io = new Server(process.env.PORT || 9000, {
  cors: true,
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("userCalling", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("callAccepted", (data) => {
    io.to(data.to).emit("callAcceptedTrue", data.signal);
  });
});
