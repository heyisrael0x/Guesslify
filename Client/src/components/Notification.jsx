import { useState, useEffect } from "react";

const Notification = ({ color, text, time, notificationState }) => {
  console.log(notificationState)
  const [notificationStat, setnotificationState] = useState(initialState);
  useEffect(() => {
    if (notificationState == true) {
      setTimeout(() => {
        notificationState = false
      }, time * 1000 || 7000);
    }
  }, [notificationState]);
  console.log(`bg-${color}`);
  return (
    <>
      {notificationState && (
        <div className="flex absolute z-30 w-full p-3 top-0 notification-slidein sm justify-end">
          <div
            className={`flex border-2 h-[5.5rem] rounded-[25px] bg-${color} text-white w-full sm:w-max sm:p-5 items-center justify-center`}
            style={{ backgroundColor: `${color}` }}
          >
            <div>
              {text}
              {time}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Notification;
