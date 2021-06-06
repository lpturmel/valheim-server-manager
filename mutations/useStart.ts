import axios from "axios";
import { useMutation } from "react-query";

const doStartInstance = async () => {
    const { data } = await axios.post("/api/server/start");

    return data;
};
const useStart = () => {
    return useMutation("start", doStartInstance);
};
export default useStart;
