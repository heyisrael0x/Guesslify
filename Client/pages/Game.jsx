import { Navbar, GameBody, Footer } from "../src/components";
import { ContractProvider } from "../src/context/SmartContractInteraction";

const Game = () => {
  return (
    <div className="min-h-screen">
      <div className="w-screen gradient01">
        <Navbar />
        <ContractProvider />
        <Footer />
      </div>
    </div>
  );
};

export default Game;
