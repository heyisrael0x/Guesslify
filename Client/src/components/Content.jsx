import { Link } from "react-router-dom";
import chainlinkLogo from "../../assest/images/chainlinkLogo.png";

const Content = () => {
  return (
    <div className="w-full flex justify-center md:pt-[30px]">
      <div className="flex flex-col md:flex-row items-center justify-between md:p-5 py-10 px-4">
        <div className="justify-start md:mr-10 fade-in">
          <h1 className="text-white text-5xl sm:text-5xl py-1 font-epilogue font-semibold text-center md:text-start">
            Can You
            <br />
            Predict ChainLink
            <br />
            VRF?
          </h1>
          <p className="text-white font-epilogue font-light md:w-[400px] text-center md:text-start">
            Chainlink VRF provides secure, verifiable random numbers, making it
            difficult to predict outputs. it's highly reliable and robust.
          </p>
          <div className="flex flex-row w-full justify-center align-center md:justify-start">
            <Link to="/dashboard">
              <button
                type="button"
                onClick=""
                className="flex flex-row justify-center items-center my-5 mr-5 white-glassmorphism p-3 px-5 rounded-lg cursor-pointer"
              >
                <p className="text-white text-base font-meduim font-epilogue">
                  Play Now
                </p>
              </button>
            </Link>
            <Link to="/about">
              <button
                type="button"
                onClick=""
                className="flex flex-row justify-center items-center my-5 white-glassmorphism p-3 px-5 rounded-lg cursor-pointer"
              >
                <p className="text-white text-base font-meduim font-epilogue">
                  Game Rules
                </p>
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-start md:ml-10 icon-fade">
          <img src={chainlinkLogo} alt="chainlinkLogo" width={400} />
        </div>
      </div>
    </div>
  );
};

export default Content;
