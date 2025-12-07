import type { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { MAKE_MOVE } from "../utils/messages";

export default function ChessBoard({
  board,
  setBoard,
  chess,
  socket,
  pieceColor,
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
  pieceColor: string | undefined;
}) {
  const from = useRef<string>(undefined);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-screen-sm aspect-square">
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

                      if (!pieceColor) {
                        return;
                      }

                      if (
                        (square?.square &&
                          !from.current &&
                          pieceColor != square?.color) ||
                        (!from.current && !square?.square)
                      ) {
                        return;
                      }

                      if (from.current && square?.square) {
                        if (pieceColor && pieceColor == square.color) {
                          from.current = squareRepresentation;
                          return;
                        }
                      }

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
                          from.current = undefined;
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
                    className={`flex-1 aspect-square ${
                      (i + j) % 2 == 0
                        ? "bg-secondary-color"
                        : "bg-primary-color"
                    } `}
                  >
                    {/* {JSON.stringify({ i, j })}
                     */}
                    {/* {square?.type} */}
                    <div className="h-full justify-center flex flex-col items-center ">
                      {square ? (
                        <img
                          //   className="w-[4.25rem]"
                          src={`/${
                            square.color == "b"
                              ? `b${square.type}`
                              : `w${square.type}`
                          }.png`}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
