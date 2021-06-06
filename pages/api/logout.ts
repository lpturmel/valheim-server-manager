import validateRequest from "../../utils/api/validateResquest";
import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const validRequest = validateRequest(["POST"], req, res);
    if (!validRequest) return;

    const cookies = new Cookies(req, res);

    cookies.set("token", "", { maxAge: 0 });

    return res.status(200).json("success");
};
