import axios from "axios";
const BASE_API_URL = "https://fe-test.marketing4storage.com";
axios.defaults.baseURL = BASE_API_URL;
// axios.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded";
export default axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});
