import logoWhite from "../../assest/images/logo.svg";
import githubWhite from "../../assest/images/github-mark-white.svg";
import githubTextWhite from "../../assest/images/GitHub_Logo_White.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
const Navbar = () => {
  const [toogleMenu, setToogleMenu] = useState(false);
  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4 font-epilogue text-white font-normal">
      <div className="md:flex[0.5] flex-initial justify-center items-center">
        <img src={logoWhite} alt="logo" width="40px" />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        <li className="cursor-pointer mx-4 nav-style">
          <Link to="/">Home</Link>
        </li>
        <li className="cursor-pointer mx-4 nav-style">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="cursor-pointer mx-4 nav-style">
          <Link to="/about">About</Link>
        </li>
        <li className="cursor-pointer mx-4 nav-style">
          <Link to="/leaderboard">Leaderboard</Link>
        </li>

        <a
          href="https://github.com/gb0g0"
          className="transition ease-in-out delay-150 mx-4 bg-[#1C1C1C] py-2 px-6 justify-center flex items-center rounded-lg cursor-pointer hover:bg-black hover:-translate-y-1 hover:scale-110 duration-300"
          target="_blank"
        >
          <img src={githubWhite} alt="github" width="20px" />
          <img src={githubTextWhite} alt="github" width="60x" />
          {/* GitHub */}
        </a>
      </ul>
      <div className="flex relative">
        {toogleMenu ? (
          <RxCross2
            fontSize={40}
            className="cursor-pointer md:hidden flex z-10"
            onClick={() => setToogleMenu(false)}
          />
        ) : (
          <HiMenuAlt3
            fontSize={40}
            className="cursor-pointer md:hidden z-10"
            onClick={() => setToogleMenu(true)}
          />
        )}
        {toogleMenu && (
          <div
            onClick={() => setToogleMenu(false)}
            className="h-screen w-screen z-10 top-0 right-0 flex absolute"
          >
            <ul className="list-none z-10 justify-center flex flex-col items-center flex-initial w-[200px] absolute top-12 right-0 rounded-xl glass-effect md:hidden py-5 ">
              <li className="cursor-pointer mx-4 my-1 nav-style">
                <Link to="/">Home</Link>
              </li>
              <li className="cursor-pointer mx-4 my-1 nav-style">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="cursor-pointer mx-4 my-1 nav-style">
                <Link to="/about">About</Link>
              </li>
              <li className="cursor-pointer mx-4 my-1 nav-style">
                <Link to="/leaderboard">Leaderboard</Link>
              </li>
              <a
                href="https://github.com/gb0g0"
                className="transition ease-in-out delay-150 mx-4 bg-[#1C1C1C] py-2 px-6 justify-center flex items-center rounded-lg cursor-pointer hover:bg-black hover:-translate-y-1 hover:scale-60 duration-300"
                target="_blank"
              >
                <img src={githubWhite} alt="github" width="20px" />
                <img src={githubTextWhite} alt="github" width="60x" />
              </a>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
