import { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MAKE_MOVE } from "../utils/messages";

export default function Game() {
  const { socket } = useSocket();
  const [chess, setChess] = useState<Chess>(new Chess());
  const [board, setBoard] = useState(chess.board());

  useEffect(() => {
    if (socket == null) {
      return;
    }

    socket.onmessage = (e) => {
      const message = JSON.parse(e.data);

      switch (message.type) {
        case INIT_GAME:
          break;
        case MAKE_MOVE:
          const move = message.payload.move;
          // validate the move
          chess.move(move);
          setBoard(chess.board());
          break;
        case GAME_OVER:
          break;
      }
    };
  }, [socket]);

  if (socket == null) {
    return <div>...Connecting the socket</div>;
  }

  return (
    <div className="grid grid-cols-10 h-screen bg-bg-color">
      <div className="col-span-7 w-full">
        <ChessBoard
          setBoard={setBoard}
          chess={chess}
          socket={socket}
          board={board}
        />
      </div>

      <div className="col-span-3 w-full py-10 px-20">
        <button
          onClick={() => {
            socket.send(
              JSON.stringify({
                type: INIT_GAME,
              })
            );
          }}
          className="py-6 w-full inline-block bg-primary-color text-3xl text-white rounded-2xl hover:bg-green-950 cursor-pointer"
        >
          Play
        </button>
      </div>
    </div>
  );
}
