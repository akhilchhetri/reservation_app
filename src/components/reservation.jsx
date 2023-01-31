import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
// const unit_id = "528560dc-0507-4db9-94f9-f1afa80d0e07";

const Reservation = ({ state, setState }) => {
  const [unitId, setUnitId] = useState(undefined);
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCVV] = useState("");
  const [unitError, setUnitError] = useState({ unitId: undefined });
  const [tenantError, setTenantError] = useState({
    name: undefined,
    street: undefined,
    city: undefined,
    state: undefined,
    zipCode: undefined,
    email: undefined,
  });
  const [paymentError, setPaymentError] = useState({
    cardNumber: undefined,
    nameOnCard: undefined,
    expiryMonth: undefined,
    expiryYear: undefined,
    cvv: undefined,
  });

  const handleReservation = async () => {
    try {
      if (unitId && unitId?.length >= 1) {
        toast.info("Requesting, Please wait...", { position: "top-right" });
        const data = await axios.get(`/cart/reserve/${unitId}`, {
          withCredentials: true,
          headers: { "content-type": "application/x-www-form-urlencoded" },
        });
        if (data?.status === 200 && data?.data) {
          setState((ps) => ({ ...ps, reservation_data: data?.data }));
          setTimeout(() => {
            setState((ps) => ({ ...ps, step: 2 }));
          }, 1000);
          toast.success("Request successful");
        }
      } else {
        toast.error("Unit ID is required!", { position: "top-right" });
      }
    } catch (e) {
      toast.error(`Error occured. ${e?.response?.data[0]}`);
    }
  };
  const handleTenantInformation = async (e) => {
    e.preventDefault();
    try {
      toast.info("Requesting, Please wait...", { position: "top-right" });
      const d = {
        name: name,
        street: street,
        city: city,
        zip_code: zipCode,
        state: addressState,
        email: email,
      };
      const data = await axios.post(
        `/cart/tenant`,
        { ...d },
        {
          withCredentials: true,
          headers: { "content-type": "application/x-www-form-urlencoded" },
        }
      );
      if (data?.status === 200 || data?.data) {
        setState((ps) => ({ ...ps, reservation_data: data?.data }));
        setTimeout(() => {
          setState((ps) => ({ ...ps, step: 3 }));
        }, 1000);
        toast.success("Request successful");
      }
    } catch (e) {
      toast.error(`Error occured. ${e?.response?.data[0]}`);
    }
  };
  const handlePaymentInformation = async (e) => {
    e.preventDefault();
    try {
      if (
        paymentError?.cardNumber ||
        paymentError?.nameOnCard ||
        paymentError?.expiryMonth ||
        paymentError?.expiryYear ||
        paymentError?.cvv
      ) {
        toast.error("Please enter valid payment details", {
          position: "top-right",
        });
      } else {
        toast.info("Requesting, Please wait...", { position: "top-right" });
        const d = {
          card_number: cardNumber,
          name_on_card: nameOnCard,
          expiration_month: expiryMonth,
          expiration_year: expiryYear,
          cvv: cvv,
        };
        const data = await axios.post(
          `/cart/payment`,
          { ...d },
          {
            withCredentials: true,
            headers: { "content-type": "application/x-www-form-urlencoded" },
          }
        );
        if (data?.status === 200 || data?.data) {
          setState((ps) => ({ ...ps, payment_data: data?.data }));
          setTimeout(() => {
            setState((ps) => ({ ...ps, step: 4 }));
          }, 1000);
          toast.success("Payment details submited successfully.");
        }
      }
    } catch (e) {
      toast.error(`Error occured. ${e?.response?.data[0]}`);
    }
  };

  const handleExpiryChange = (e, type) => {
    if (type === "month") {
      let month = parseInt(e?.target?.value);
      if (month >= 1 && month <= 12) {
        setExpiryMonth(e?.target?.value);
        setPaymentError((ps) => ({ ...ps, expiryMonth: undefined }));
      } else {
        setPaymentError((ps) => ({
          ...ps,
          expiryMonth: "Expiry Month should be from 1 to 12.",
        }));
      }
    }
    if (type === "year") {
      let year = parseInt(e?.target?.value);
      if (year >= 23 && year <= 30) {
        setExpiryYear(e?.target?.value);
        setPaymentError((ps) => ({ ...ps, expiryYear: undefined }));
      } else {
        setPaymentError((ps) => ({
          ...ps,
          expiryYear: "Expiry Year must be between 23 to 30.",
        }));
      }
    }
  };

  const completeReservation = async () => {
    try {
      toast.info("Requesting, Please wait...", { position: "top-right" });
      const data = await axios.get(`/cart/submit-reservation`, {
        withCredentials: true,
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });
      if (data?.status === 200 && data?.data) {
        setState((ps) => ({ ...ps, reserved_data: data?.data }));
        setTimeout(() => {
          setState((ps) => ({ ...ps, step: 5 }));
        }, 1000);
        toast.success("Your Reservation Completeted");
      }
    } catch (e) {
      toast.error(`Error occured. ${e?.response?.data[0]}`);
    }
  };
  const handleCardNumberChange = (e) => {
    if (e?.target?.value) {
      setCardNumber(e.target.value);
      if (e?.target?.value?.length >= 13 && e?.target?.value?.length <= 19) {
        setPaymentError((ps) => ({ ...ps, cardNumber: undefined }));
      } else {
        setPaymentError((ps) => ({
          ...ps,
          cardNumber: "Card digits should be from 13 to 19.",
        }));
      }
    } else {
      setPaymentError((ps) => ({
        ...ps,
        cardNumber: "Card Number is required.",
      }));
    }
  };
  const handleCardNameChange = (e) => {
    if (e?.target?.value) {
      setNameOnCard(e.target.value);
      setPaymentError((ps) => ({ ...ps, nameOnCard: undefined }));
    } else {
      setPaymentError((ps) => ({
        ...ps,
        nameOnCard: "Card Number is required.",
      }));
    }
  };

  return (
    <div className="w-full self-start items-start px-[30px] py-[30px]">
      <h1 className="text-[20px] font-semibold">
        {!state?.step === 5 && <>Step {state?.step} :</>}{" "}
        {state?.step === 1 && <>Start your Reservation</>}
        {state?.step === 2 && <>Provide your details</>}
        {state?.step === 3 && <>Enter your Payment Information</>}
        {state?.step === 4 && <>Complete Your Reservation</>}
        {state?.step === 5 && <>Receipt</>}
      </h1>

      <div className="flex flex-col items-start my-[20px] w-[100%]">
        {state?.step === 1 && (
          <div className="flex flex-col w-full">
            <label className="text-[16px]">Enter the Unit ID</label>
            <input
              onChange={(e) => {
                if (e?.target?.value && e.target.value?.length >= 1) {
                  setUnitId(e?.target?.value);
                  setUnitError((ps) => ({ ...ps, unitId: undefined }));
                } else {
                  setUnitError((ps) => ({
                    ...ps,
                    unitId: "Unit ID is required.",
                  }));
                }
              }}
              onBlur={(e) => {
                if (e?.target?.value && e.target.value?.length >= 1) {
                  setUnitId(e?.target?.value);
                  setUnitError((ps) => ({ ...ps, unitId: undefined }));
                } else {
                  setUnitError((ps) => ({
                    ...ps,
                    unitId: "Unit ID is required.",
                  }));
                }
              }}
              name="unit_id"
              className="w-full my-2 px-[10px] py-[5px] rounded-[10px] focus:outline-none active:outline-none"
              placeholder="Enter unit id"
              required
            />
            <span className="text-[12px] font-medium text-red-700">
              {unitError?.unitId}
            </span>
            <button
              className="px-3 w-[20%] py-2 bg-blue-500 rounded-[10px] text-white my-5"
              onClick={() => handleReservation()}
            >
              Start Reservation
            </button>
          </div>
        )}

        {state?.step === 2 && (
          <div>
            <form onSubmit={handleTenantInformation}>
              <label className="text-[16px]">Enter Name </label>
              <input
                onChange={(e) => setName(e.target.value)}
                name="name"
                className="w-full my-2 px-[10px] py-[5px] rounded-[10px] focus:outline-none active:outline-none"
                placeholder="Enter Tenant Name"
                required
              />
              <label className="text-[16px]">Enter Street Address</label>
              <input
                onChange={(e) => setStreet(e.target.value)}
                name="name"
                className="w-full my-2 px-[10px] py-[5px] rounded-[10px] focus:outline-none active:outline-none"
                placeholder="Enter Tenant Name"
                required
              />
              <label className="text-[16px]">Enter City</label>
              <input
                onChange={(e) => setCity(e?.target?.value)}
                name="city"
                className="w-full my-2 px-[10px] py-[5px] rounded-[10px] focus:outline-none active:outline-none"
                placeholder="Enter Tenant City"
                required
              />
              <label className="text-[16px]">Enter State</label>
              <input
                onChange={(e) => setAddressState(e?.target?.value)}
                name="city"
                className="w-full my-2 px-[10px] py-[5px] rounded-[10px] focus:outline-none active:outline-none"
                placeholder="Enter Tenant State"
                required
              />
              <label className="text-[16px]">Enter Zip-Code</label>
              <input
                onChange={(e) => setZipCode(e?.target?.value)}
                name="city"
                className="w-full my-2 px-[10px] py-[5px] rounded-[10px] focus:outline-none active:outline-none"
                placeholder="Enter ZipCode"
                required
              />
              <label className="text-[16px]">Enter Email Address</label>
              <input
                onChange={(e) => setEmail(e?.target?.value)}
                name="email"
                className="w-full my-2 px-[10px] py-[5px] rounded-[10px] focus:outline-none active:outline-none"
                placeholder="Enter Tenant Email Address"
                type="email"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-500 rounded-[10px] text-white"
              >
                Submit Details
              </button>
            </form>
          </div>
        )}
        {state?.step === 3 && (
          <div className="w-full">
            <form onSubmit={handlePaymentInformation}>
              <label class="relative flex flex-col">
                <span class="font-bold mb-3">Card number</span>
                <input
                  class="w-full rounded-md peer pl-12 pr-2 py-2 placeholder-gray-300"
                  type="text"
                  name="card_number"
                  placeholder="0000 0000 0000"
                  onChange={(e) => handleCardNumberChange(e)}
                  onBlur={(e) => handleCardNumberChange(e)}
                  minLength={13}
                  maxLength={19}
                  required
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </label>
              <span className="text-[12px] font-medium text-red-700">
                {paymentError?.cardNumber}
              </span>
              <label class="relative flex flex-col">
                <span class="font-bold mb-3">Name on Card</span>
                <input
                  class="w-full rounded-md peer pl-4 pr-2 py-2 placeholder-gray-300"
                  type="text"
                  name="card_number"
                  placeholder="Enter Name on Card"
                  onChange={(e) => handleCardNameChange(e)}
                  onBlur={(e) => handleCardNameChange(e)}
                  required
                />
              </label>
              <span className="text-[12px] font-medium text-red-700">
                {paymentError?.nameOnCard}
              </span>

              <label class="relative flex-1 flex flex-col">
                <span class="font-bold mb-3">Expiry Month</span>
                <input
                  class="w-full rounded-md peer pl-12 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300"
                  type="text"
                  name="expire_date"
                  placeholder="MM"
                  maxLength={2}
                  onChange={(e) => handleExpiryChange(e, "month")}
                  onBlur={(e) => handleExpiryChange(e, "month")}
                  required
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </label>
              <span className="text-[12px] font-medium text-red-700">
                {paymentError?.expiryMonth}
              </span>
              <label class="relative flex-1 flex flex-col">
                <span class="font-bold mb-3">Expiry Year</span>
                <input
                  class="w-full rounded-md peer pl-12 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300"
                  type="text"
                  name="expire_date"
                  placeholder="YY"
                  maxLength={2}
                  onChange={(e) => handleExpiryChange(e, "year")}
                  onBlur={(e) => handleExpiryChange(e, "year")}
                  required
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </label>
              <span className="text-[12px] font-medium text-red-700">
                {paymentError?.expiryYear}
              </span>

              <label class="relative flex-1 flex flex-col">
                <span class="font-bold flex items-center gap-3 mb-3">
                  CVC/CVV
                  <span class="relative group">
                    <span class="hidden group-hover:flex justify-center items-center px-2 py-1 text-xs absolute -right-2 transform translate-x-full -translate-y-1/2 w-max top-1/2 bg-black text-white">
                      {" "}
                      Card CVC/CVV
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </span>
                <input
                  class="rounded-md peer pl-12 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300"
                  type="text"
                  name="card_cvv"
                  placeholder="&bull;&bull;&bull;"
                  maxLength={3}
                  minLength={3}
                  onChange={(e) => {
                    if (e?.target?.value) {
                      setCVV(e?.target?.value);
                    } else {
                      setPaymentError((ps) => ({
                        ...ps,
                        cvv: "CVV/CVC is required",
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    if (e?.target?.value) {
                      setCVV(e?.target?.value);
                    } else {
                      setPaymentError((ps) => ({
                        ...ps,
                        cvv: "CVV/CVC is required",
                      }));
                    }
                  }}
                  required
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </label>
              <span className="text-[12px] font-medium text-red-700">
                {paymentError?.cvv}
              </span>
              <br />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-500 rounded-[10px] text-white my-5"
              >
                Submit Payment Details
              </button>
            </form>
          </div>
        )}
        {state?.step === 4 && (
          <div>
            <button
              className="px-3 py-3 bg-blue-500 font-medium rounded-[10px] text-white"
              onClick={() => completeReservation()}
            >
              Click Complete Your Reservation
            </button>
          </div>
        )}
        {state?.step === 5 && (
          <div className="flex w-full flex-col">
            <h1 className="text-[20px] text-green-600 font-semibold leading-[40px]">
              Your reservation has been completed successfully
            </h1>
            {state?.reserved_data && (
              <div className="flex bg-blue-300 rounded-md w-[100%] min-h-[30vh] flex flex-col px-4 py-2">
                <h3 className="underline text-[16px] font-medium">
                  Unit Details
                </h3>
                <span>ID: {state?.reserved_data?.unit?.id}</span>
                <span>
                  Description: {state?.reserved_data?.unit?.description}
                </span>
                <span>
                  Inside:{" "}
                  {state?.reserved_data?.unit?.inside ? "True" : "False"}
                </span>
                <span>Floor: {state?.reserved_data?.unit?.floor}</span>
                <span>Width: {state?.reserved_data?.unit?.width}</span>
                <span>Length: {state?.reserved_data?.unit?.length}</span>
                <span>Area: {state?.reserved_data?.unit?.area}</span>
                <h3 className="underline text-[16px] font-medium">
                  Tenant Details
                </h3>
                <span>Name: {state?.reserved_data?.tenant?.name}</span>
                <span>Street: {state?.reserved_data?.tenant?.street}</span>
                <span>City: {state?.reserved_data?.tenant?.city}</span>
                <span>State: {state?.reserved_data?.tenant?.state}</span>
                <span>ZipCode: {state?.reserved_data?.tenant?.zip_code}</span>
                <span>Email: {state?.reserved_data?.email}</span>
                <h3 className="underline text-[16px] font-medium">
                  Payment Details
                </h3>
                <span>Amount Paid: {state?.reserved_data?.paid_today} USD</span>
                <span>Payment Ref: {state?.reserved_data?.payment_id}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservation;
