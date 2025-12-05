import { WebSocketServer } from "ws";
import { UserManager } from "./managers/UserManager.js";

const wss = new WebSocketServer({ port: 8080 });

const userManager = new UserManager();

wss.on("connection", (socket) => {
  userManager.addUser(socket);

  socket.on("close", () => {
    userManager.removeUser(socket);
  });
});
