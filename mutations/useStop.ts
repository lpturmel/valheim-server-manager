import axios from "axios";
import { useMutation } from "react-query";

const doStopInstance = async () => {
    const { data } = await axios.post("/api/server/stop");

    return data;
};
const useStop = () => {
    return useMutation("stop", doStopInstance);
};
export default useStop;
