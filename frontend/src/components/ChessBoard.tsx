import type { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { MAKE_MOVE } from "../utils/messages";

export default function ChessBoard({
  board,
  setBoard,
  chess,
  socket,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  setBoard: Dispatch<
    SetStateAction<
      ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
    >
  >;
  chess: Chess;
  socket: WebSocket;
}) {
  const from = useRef<string>(undefined);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresentation =
                String.fromCharCode(97 + (j % 8)) + "" + `${8 - i}`;

              return (
                <div
                  key={j}
                  onClick={() => {
                    // alert(squareRepresentation);
                    // alert(square?.square);
                    if (!from.current) {
                      from.current = squareRepresentation;
                    } else {
                      try {
                        chess.move({
                          from: from.current,
                          to: squareRepresentation,
                        });
                      } catch (err) {
                        alert(err);
                        return;
                      }

                      setBoard(chess.board());

                      socket.send(
                        JSON.stringify({
                          type: MAKE_MOVE,
                          payload: {
                            move: {
                              from: from.current,
                              to: squareRepresentation,
                            },
                          },
                        })
                      );

                      from.current = undefined;
                    }
                    // if(from.current)
                  }}
                  className={`w-28 h-28 ${
                    (i + j) % 2 == 0 ? "bg-secondary-color" : "bg-primary-color"
                  } `}
                >
                  {/* {JSON.stringify({ i, j })}
                   */}
                  {square?.type}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
