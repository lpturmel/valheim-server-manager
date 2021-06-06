// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { EC2, Credentials } from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import validateCookie from "../../../utils/api/validateCookie";
import validateRequest from "../../../utils/api/validateResquest";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const validRequest = validateRequest(["GET"], req, res);

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

        const instances = await ec2
            .describeInstances({
                InstanceIds: [process.env.CV_AWS_SERVER_ID],
            })
            .promise();

        const response = {
            state: instances.Reservations[0].Instances[0].State.Name,
            ipAddress: instances.Reservations[0].Instances[0].PublicIpAddress,
            port: process.env.CV_AWS_SERVER_PORT,
            password: process.env.CV_VALHEIM_PASSWORD,
        };

        res.json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};
