module.exports = (io, socket) => {

  socket.on("chat:join", ({ roomId }) => {
    console.log("room", roomId)
    socket.join(roomId);
  });

  socket.on("chat:send", ({ roomId, content }) => {
    const message = {
      roomId,
      content,
      sender_role: socket.role,
      senderId: socket.userId || socket.adminId,
      createdAt: Date.now()
    };

    console.log(content)

    // gửi cho tất cả trong phòng
    io.to(roomId).emit("chat:new-message", message);

    // nếu user gửi → notify admin
    if (socket.role === "client") {
      io.to("admins").emit("chat:new-room", {
        roomId
      });
    }
  });

};
