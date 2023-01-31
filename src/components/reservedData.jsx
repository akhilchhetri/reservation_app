const ReservedData = ({ state }) => {
  return (
    <div className="w-full bg-blue-200 rounded-[20px] p-[20px]">
      <h2>Your Reservation details:</h2>
      <div className="flex flex-col items-start justify-start">
        {" "}
        <span>
          <b>Description:</b> {state?.reservation_data?.description}
        </span>
        <span>
          <b>Floor: </b>
          {state?.reservation_data?.floor}
        </span>
        <span>
          <b>Width:</b> {state?.reservation_data?.width} ft.
        </span>
        <span>
          <b>Width:</b> {state?.reservation_data?.width}ft.
        </span>
        <span>
          <b>Area: </b>
          {state?.reservation_data?.width} sq. ft.
        </span>
        <span>
          <b>Rate:</b> {state?.reservation_data?.width} USD
        </span>
      </div>
    </div>
  );
};
export default ReservedData;
