import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { messages } from "./messages.js";

type moveType = {
  from: string;
  to: string;
};

export class Game {
  private player1: WebSocket;
  private player2: WebSocket;
  private board: Chess;
  private moveCount: number;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moveCount = 0;

    this.player1.send(
      JSON.stringify({
        type: messages.INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: messages.INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(socket: WebSocket, move: moveType) {
    // validating a move
    console.log("inital return ");
    console.log(this.board.moveNumber());
    if (this.moveCount % 2 == 0 && socket != this.player1) {
      return;
    }

    if (this.moveCount & 1 && socket != this.player2) {
      return;
    }

    console.log("move");

    try {
      // making the move
      this.board.move(move);
    } catch (err) {
      console.error(err);
      return;
    }

    console.log("game over");

    // is the game over
    if (this.board.isGameOver()) {
      // let the players know that the game is over
      this.player1.send(
        JSON.stringify({
          type: messages.GAME_OVER,
          payload: {
            winner: this.board.turn() == "w" ? "black" : "white",
          },
        })
      );

      this.player2.send(
        JSON.stringify({
          type: messages.GAME_OVER,
          payload: {
            winner: this.board.turn() == "w" ? "black" : "white",
          },
        })
      );

      return;
    }

    console.log("sending Move");

    // send the move to the other user
    if (this.moveCount % 2 == 0 && this.player1 == socket) {
      this.player2.send(
        JSON.stringify({
          type: messages.MAKE_MOVE,
          payload: {
            move,
          },
        })
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: messages.MAKE_MOVE,
          payload: {
            move,
          },
        })
      );
    }

    ++this.moveCount;
  }
}
