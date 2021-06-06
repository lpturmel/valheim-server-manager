import axios from "axios";
import { useQuery } from "react-query";

const getStatus = async () => {
    const { data } = await axios.get("/api/server/status");
    return data;
};

const useStatus = () => {
    return useQuery("status", getStatus);
};

export default useStatus;
