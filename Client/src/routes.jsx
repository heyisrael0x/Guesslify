import Home from "../pages/Home";
import Game from "../pages/Game";
import About from "../pages/About";
import Leaderboard from "../pages/Leaderboard";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Game />} />
      <Route path="/about" element={<About />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </>
  )
);

export default router;
