// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { EC2, Credentials } from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import validateCookie from "../../../utils/api/validateCookie";
import validateRequest from "../../../utils/api/validateResquest";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const validRequest = validateRequest(["POST"], req, res);

        if (!validRequest) return;

        const isAuth = validateCookie(req, res);
        if (!isAuth)
            return res.status(401).json({
                error: "The request is not authenticated",
            });

        const credentials = new Credentials({
            accessKeyId: process.env.CV_AWS_DB_USER_ACCESS_KEY,
            secretAccessKey: process.env.CV_AWS_DB_USER_SECRET_KEY,
        });
        const ec2 = new EC2({
            apiVersion: "2016-11-15",
            credentials,
            region: process.env.CV_AWS_DB_LOCATION,
        });

        await ec2
            .stopInstances({
                InstanceIds: [process.env.CV_AWS_SERVER_ID],
            })
            .promise();

        res.json("Successfully stopped the server");
    } catch (error) {
        res.status(500).json(error);
    }
};
