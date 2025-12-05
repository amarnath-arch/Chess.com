import { useNavigate } from "react-router-dom";
import chessBoard from "../assets/chess-board.jpeg";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center bg-bg-color p-20 h-screen">
      <div>
        <img src={chessBoard} alt="chess-board" className="w-[70%]" />
      </div>
      <div>
        <button
          onClick={() => {
            navigate("/game");
          }}
          className="text-white px-10 py-6 bg-button-bg-color rounded-xl font-semibold text-2xl mt-20 hover:scale-110 transition-transform duration-150 cursor-pointer"
        >
          Play Online
        </button>
      </div>
    </div>
  );
}
