import { ContractContext } from "../context/SmartContractInteraction";
import { useState, useEffect, useContext } from "react";

const Notification = ({}) => {
  const { color, text, /*time,*/ notification, setNotification } =
    useContext(ContractContext);
  console.log(notification);
  // const [notificationState, setnotificationState] = useState(true);
  // setnotificationState(notification);
  useEffect(() => {
    if (notification == true) {
      setTimeout(() => {
        setNotification(false);
      }, 7000);
    }
  }, [notification]);
  console.log(`bg-${color}`);
  return (
    <>
      {notification && (
        <div className="flex absolute z-30 w-full p-3 top-0 notification-slidein sm justify-end">
          <div
            className={`flex border-2 h-[5.5rem] rounded-[25px] bg-${color} text-white w-full sm:w-max sm:p-5 items-center justify-center`}
            style={{ backgroundColor: `${color}` }}
          >
            <div>
              {text}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Notification;
