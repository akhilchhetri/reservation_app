import { useState } from "react";
import Reservation from "../components/reservation";
import ReservedData from "../components/reservedData";
import "../index.css";
const Dashboard = () => {
  const [state, setState] = useState({
    reservation_data: undefined,
    reservation_success: false,
    reserved_data: undefined,
    step: 1,
  });
  return (
    <div className="relative block w-[80%] mx-auto min-h-[90vh] my-[5vh] bg-blue-100 rounded-md">
      <div className="flex flex-col items-start justify-start w-full p-[15px] bg-blue-300 rounded-md">
        <h2 className="font-semibold">Best Storage America</h2>
        <span>Address: 123 Some St., Woodland CA 95695</span>
        <span>Phone: 123-123-1234</span>
      </div>
      <div className="flex flex-row items-start justify-between py-5">
        <Reservation state={state} setState={setState} />
        <div className="w-[50%]">
          {state?.reservation_data && <ReservedData state={state} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
