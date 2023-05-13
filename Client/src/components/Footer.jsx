import { BsTwitter } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { BsGithub } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center">
        <p className="text-white font-epilogue font-light">built by gbogo</p>
        <div className="flex">
          <BsTwitter className="text-white cursor-pointer m-2" />
          <BsGithub className="text-white cursor-pointer m-2" />
          <BsLinkedin className="text-white cursor-pointer m-2" />
        </div>
        <span className="text-white font-epilogue font-light">&copy; 2023</span>
      </div>
    </div>
  );
};

export default Footer;
