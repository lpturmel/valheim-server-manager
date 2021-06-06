import { NextApiRequest, NextApiResponse } from "next";

function validateRequest(
    methods: Array<string>,
    req: NextApiRequest,
    res: NextApiResponse
) {
    let valid = false;

    if (req.body) {
        if (!req.headers["content-type"]) {
            res.status(400).json("Missing Content-Type header");
            return false;
        }
        if (!req.headers["content-type"].includes("application/json")) {
            res.status(400).json(
                "Invalid request format (only json is supported)"
            );
            return false;
        }
    }

    if (!methods.some((method) => method === req.method)) {
        res.status(400).json("Cannot " + req.method);
        return false;
    }
    valid = true;
    return valid;
}
export default validateRequest;
