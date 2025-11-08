const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Middleware xác thực socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.token;
      
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join session room
    socket.on("join_session", async (sessionId) => {
      try {
        socket.join(`session:${sessionId}`);
        socket.currentSession = sessionId;
        
        // Thông báo cho các user khác
        socket.to(`session:${sessionId}`).emit("user_joined", {
          userId: socket.userId,
          userName: socket.user.name,
          timestamp: new Date()
        });

        // Gửi danh sách users đang online trong room
        const socketsInRoom = await io.in(`session:${sessionId}`).fetchSockets();
        const onlineUsers = socketsInRoom.map(s => ({
          userId: s.userId,
          userName: s.user.name
        }));

        socket.emit("online_users", onlineUsers);
      } catch (error) {
        socket.emit("error", { message: "Failed to join session" });
      }
    });

    // Leave session room
    socket.on("leave_session", (sessionId) => {
      socket.leave(`session:${sessionId}`);
      socket.to(`session:${sessionId}`).emit("user_left", {
        userId: socket.userId,
        userName: socket.user.name,
        timestamp: new Date()
      });
    });

    // Send message
    socket.on("send_message", async (data) => {
      try {
        const { sessionId, message, messageType = "text", replyTo } = data;

        if (!socket.currentSession || socket.currentSession !== sessionId) {
          return socket.emit("error", { message: "Not in this session" });
        }

        const SessionMessage = require("../../models/SessionMessage.model");
        const newMessage = new SessionMessage({
          sessionId,
          user: socket.userId,
          message,
          messageType,
          replyTo
        });

        await newMessage.save();

        // Populate user info and replyTo
        await newMessage.populate("user", "name email avatar");
        if (replyTo) {
          await newMessage.populate({
            path: "replyTo",
            populate: {
              path: "user",
              select: "name email avatar"
            }
          });
        }

        // Broadcast to all users in the session room
        const messageData = {
          _id: newMessage._id,
          sessionId: newMessage.sessionId,
          user: {
            _id: newMessage.user._id,
            name: newMessage.user.name,
            email: newMessage.user.email,
            avatar: newMessage.user.avatar
          },
          message: newMessage.message,
          messageType: newMessage.messageType,
          replyTo: newMessage.replyTo ? {
            _id: newMessage.replyTo._id,
            message: newMessage.replyTo.message,
            user: newMessage.replyTo.user ? {
              _id: newMessage.replyTo.user._id,
              name: newMessage.replyTo.user.name,
              email: newMessage.replyTo.user.email,
              avatar: newMessage.replyTo.user.avatar
            } : null
          } : null,
          isEdited: newMessage.isEdited,
          isDeleted: newMessage.isDeleted,
          createdAt: newMessage.createdAt,
          updatedAt: newMessage.updatedAt
        };

        io.to(`session:${sessionId}`).emit("new_message", messageData);
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Edit message
    socket.on("edit_message", async (data) => {
      try {
        const { messageId, newMessage, sessionId } = data;
        const SessionMessage = require("../../models/SessionMessage.model");
        
        const message = await SessionMessage.findOne({
          _id: messageId,
          user: socket.userId,
          sessionId
        });

        if (!message) {
          return socket.emit("error", { message: "Message not found" });
        }

        message.message = newMessage;
        message.isEdited = true;
        await message.save();

        io.to(`session:${sessionId}`).emit("message_edited", {
          messageId,
          newMessage,
          updatedAt: message.updatedAt
        });
      } catch (error) {
        socket.emit("error", { message: "Failed to edit message" });
      }
    });

    // Delete message
    socket.on("delete_message", async (data) => {
      try {
        const { messageId, sessionId } = data;
        const SessionMessage = require("../../models/SessionMessage.model");
        
        const message = await SessionMessage.findOne({
          _id: messageId,
          user: socket.userId,
          sessionId
        });

        if (!message) {
          return socket.emit("error", { message: "Message not found" });
        }

        message.isDeleted = true;
        await message.save();

        io.to(`session:${sessionId}`).emit("message_deleted", {
          messageId
        });
      } catch (error) {
        socket.emit("error", { message: "Failed to delete message" });
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { sessionId, isTyping } = data;
      socket.to(`session:${sessionId}`).emit("user_typing", {
        userId: socket.userId,
        userName: socket.user.name,
        isTyping
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      if (socket.currentSession) {
        socket.to(`session:${socket.currentSession}`).emit("user_left", {
          userId: socket.userId,
          userName: socket.user.name,
          timestamp: new Date()
        });
      }
    });
  });

  return io;
};

module.exports = initializeSocket;