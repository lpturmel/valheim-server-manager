import axios from "axios";
import { useMutation } from "react-query";
import LoginBody from "../types/bodies/LoginBody";

const doLogin = async (body: LoginBody) => {
    const { data } = await axios.post(
        "/api/login",

        {
            username: body.username,
            password: body.password,
        }
    );

    return data;
};
const useLogin = () => {
    return useMutation("login", doLogin);
};
export default useLogin;
