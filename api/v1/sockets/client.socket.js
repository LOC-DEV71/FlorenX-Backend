module.exports = (io, socket) => {
  if (socket.role !== "client") return;

  socket.on("client:ping", () => {
    console.log("Client ping:", socket.id);
    socket.emit("client:pong");
  });
};
