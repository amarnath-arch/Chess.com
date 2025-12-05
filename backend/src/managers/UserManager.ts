import { Game } from "./GameManager.js";
import { WebSocket } from "ws";
import { messages } from "./messages.js";

export class UserManager {
  // each user will be have a associated game id .
  // a user can wait for other user or some random player as well.

  //   private gameToUser: Map<string, Game>;

  private pendingUser: WebSocket | null;
  private gameIdToGame: Map<string, Game>;
  private userToGameId: Map<WebSocket, string>;

  constructor() {
    // this.gameToUser = new Map<string,
    this.pendingUser = null;
    this.gameIdToGame = new Map<string, Game>();
    this.userToGameId = new Map<WebSocket, string>();
  }

  private generateGameId() {
    const randomString = "adfhjasewoiruncdslzzxhruew";
    const length = 9;
    let ans = "";
    for (let i = 0; i < 9; ++i) {
      ans += randomString[Math.floor(Math.random() * randomString.length)];
    }

    return ans;
  }

  addUser(socket: WebSocket) {
    this.initHandler(socket);
  }

  matchGame() {}

  removeUser(socket: WebSocket) {
    // to remove the user from the game
    const gameId = this.userToGameId.get(socket);
    if (gameId) {
      this.gameIdToGame.delete(gameId);
    }
    this.userToGameId.delete(socket);

    if (this.pendingUser) {
      console.log("clearing the pending user");
      this.pendingUser = null;
    }
  }

  private initHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type == messages.INIT_GAME) {
          if (this.pendingUser != null) {
            // a particular game Id for a game;
            const gameId = this.generateGameId();
            const game = new Game(this.pendingUser, socket);

            // update the mappings
            this.gameIdToGame.set(gameId, game);
            this.userToGameId.set(this.pendingUser, gameId);
            this.userToGameId.set(socket, gameId);

            // update the pending user
            this.pendingUser = null;
          } else {
            console.log("setting the pending user");
            this.pendingUser = socket;
          }
        } else if (message.type == messages.MAKE_MOVE) {
          console.log("making MOve");
          const gameId = this.userToGameId.get(socket);
          console.log("gameId is : ", gameId);

          if (gameId) {
            const game = this.gameIdToGame.get(gameId);
            console.log("gameId is : ", game);

            game?.makeMove(socket, message.payload.move);
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
}
