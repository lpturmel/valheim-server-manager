import { Alert } from "@chakra-ui/alert";
import { Button, IconButton } from "@chakra-ui/button";
import { CopyIcon } from "@chakra-ui/icons";

import {
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Badge,
    Heading,
    HStack,
    VStack,
    Text,
    Input,
    useToast,
} from "@chakra-ui/react";
import Cookies from "cookies";
import { DBConsoleClient } from "dynamo-sdk/dist";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";
import Navbar from "../components/Navbar";
import useStart from "../mutations/useStart";
import useStop from "../mutations/useStop";
import useStatus from "../queries/useStatus";
import User from "../types/entities/User";
import validateJWT from "../utils/validateJWT";

export interface ServerPageProps {
    user: User;
}

const ServerPage: React.FunctionComponent<ServerPageProps> = ({ user }) => {
    const { data, isLoading, error, refetch } = useStatus();
    const _stopInstance = useStop();
    const _startInstance = useStart();
    const toast = useToast();

    const handleServerStart = () => {
        _startInstance.mutate();
        let iterations = 0;
        const handle = setInterval(() => {
            iterations++;
            refetch();
            if (iterations >= 5) {
                clearInterval(handle);
            }
        }, 3000);
    };
    const handleServerStop = () => {
        _stopInstance.mutate();
        let iterations = 0;
        const handle = setInterval(() => {
            iterations++;
            refetch();
            if (iterations >= 5) {
                clearInterval(handle);
            }
        }, 3000);
    };

    const getStateColor = (state: string) => {
        if (
            state === "stopped" ||
            state === "shutting-down" ||
            state === "terminated" ||
            state === "stopping"
        ) {
            return "red";
        } else if (state === "running") {
            return "green";
        } else if (state === "pending") {
            return "yellow";
        }
    };

    const writeToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        if (!toast.isActive("CopiedToClipboard")) {
            toast({
                title: "Copied to clipboard",
                status: "info",
                duration: 5000,
                id: "CopiedToClipboard",
                isClosable: true,
            });
        }
    };
    return (
        <VStack
            h="100vh"
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            backgroundImage={`url('/status.jpg')`}
            alignItems="center"
            justifyContent="center"
        >
            <Navbar user={user} />
            {error && (
                <Alert status="error" position="absolute" top={10} left={0}>
                    <AlertIcon />
                    <AlertTitle mr={2}>Your browser is outdated!</AlertTitle>
                    <AlertDescription>
                        {/* {(error as any).response.data.error} */}
                    </AlertDescription>
                </Alert>
            )}
            {!isLoading && data && (
                <VStack
                    borderRadius="8px"
                    w="650px"
                    wrap="wrap"
                    bg="rgb(217, 186, 157, 0.3)"
                    p={8}
                    spacing={4}
                >
                    <HStack justifyContent="space-between" w="100%">
                        <Heading>Valheim Server</Heading>
                        <HStack h="100%">
                            <HStack>
                                <Text fontWeight="semibold">status: </Text>
                                <Badge colorScheme={getStateColor(data.state)}>
                                    {data.state}
                                </Badge>
                            </HStack>
                        </HStack>
                    </HStack>
                    <VStack>
                        <HStack>
                            <Text fontWeight="semibold">IP Address:</Text>
                            <Text>
                                {data.ipAddress}:{data.port}
                            </Text>
                            <IconButton
                                onClick={() =>
                                    writeToClipboard(
                                        `${data.ipAddress}:${data.port}`
                                    )
                                }
                                size="sm"
                                aria-label="copy"
                            >
                                <CopyIcon />
                            </IconButton>
                        </HStack>
                        <HStack>
                            <Text fontWeight="semibold">Password:</Text>
                            <Input
                                variant="unstyled"
                                value={data.password}
                                type="password"
                            />

                            <IconButton
                                onClick={() => writeToClipboard(data.password)}
                                size="sm"
                                aria-label="copy"
                            >
                                <CopyIcon />
                            </IconButton>
                        </HStack>
                    </VStack>
                    <HStack w="100%" justifyContent="flex-end">
                        <Button
                            disabled={getStateColor(data.state) === "green"}
                            onClick={handleServerStart}
                            colorScheme="green"
                        >
                            Start
                        </Button>
                        <Button
                            disabled={getStateColor(data.state) === "red"}
                            onClick={handleServerStop}
                            colorScheme="red"
                        >
                            Stop
                        </Button>
                    </HStack>
                </VStack>
            )}
        </VStack>
    );
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const cookies = new Cookies(context.req, context.res);
    const token = cookies.get("token");

    if (!token) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        };
    }

    const payload = validateJWT(token);

    if (!payload) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        };
    }

    const client = new DBConsoleClient(
        process.env.CV_AWS_DB_TABLE_NAME,
        process.env.CV_AWS_DB_USER_ACCESS_KEY,
        process.env.CV_AWS_DB_USER_SECRET_KEY,
        process.env.CV_AWS_DB_LOCATION
    );

    const user = await client.getUserById(payload.id);
    return {
        props: {
            user,
        },
    };
};
export default ServerPage;
