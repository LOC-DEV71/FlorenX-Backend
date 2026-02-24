module.exports = (io, socket) => {
  if (socket.role !== "admin") return;

  socket.on("admin:ping", () => {
    console.log("Admin ping:", socket.id);
    socket.emit("admin:pong");
  });
};
