import axios from "axios";
import { useMutation } from "react-query";

const doLogout = async () => {
    const { data } = await axios.post("/api/logout");

    return data;
};
const useLogout = () => {
    return useMutation("logout", doLogout);
};
export default useLogout;
