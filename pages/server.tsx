import { Alert } from "@chakra-ui/alert";
import { Button } from "@chakra-ui/button";

import {
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Badge,
    Heading,
    HStack,
    VStack,
    Text,
} from "@chakra-ui/react";
import React from "react";
import useStart from "../mutations/useStart";
import useStop from "../mutations/useStop";
import useStatus from "../queries/useStatus";

export interface ServerPageProps {}

const ServerPage: React.FunctionComponent<ServerPageProps> = () => {
    const { data, isLoading, error, refetch } = useStatus();
    const _stopInstance = useStop();
    const _startInstance = useStart();

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
    return (
        <VStack
            h="100vh"
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            backgroundImage={`url('/status.jpg')`}
            alignItems="center"
            justifyContent="center"
        >
            {error && (
                <Alert status="error" position="absolute" top={0} left={0}>
                    <AlertIcon />
                    <AlertTitle mr={2}>Your browser is outdated!</AlertTitle>
                    <AlertDescription>
                        {(error as any).response.data.error}
                    </AlertDescription>
                </Alert>
            )}
            {!isLoading && data && (
                <VStack bg="rgb(217, 186, 157, 0.3)" p={8}>
                    <HStack w="100%">
                        <Heading>Valheim Server</Heading>
                        <HStack>
                            <HStack>
                                <Text fontWeight="semibold">status: </Text>
                                <Badge colorScheme={getStateColor(data.state)}>
                                    {data.state}
                                </Badge>
                            </HStack>
                        </HStack>
                    </HStack>
                    <HStack>
                        <Button
                            disabled={getStateColor(data.state) === "green"}
                            onClick={handleServerStart}
                        >
                            Start
                        </Button>
                        <Button
                            disabled={getStateColor(data.state) === "red"}
                            onClick={handleServerStop}
                        >
                            Stop
                        </Button>
                    </HStack>
                </VStack>
            )}
        </VStack>
    );
};

export default ServerPage;
