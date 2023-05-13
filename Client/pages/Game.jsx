import { Navbar, GameBody, Footer } from "../src/components";

const Game = () => {
  return (
    <div className="min-h-screen">
      <div className="w-screen gradient01">
        <Navbar />
        <GameBody />
        <Footer />
      </div>
    </div>
  );
};

export default Game;
