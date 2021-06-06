import {
    Box,
    HStack,
    VStack,
    Center,
    Text,
    InputGroup,
    FormLabel,
    Link,
    FormControl,
    InputLeftElement,
    Input,
    Checkbox,
    Divider,
    Button,
    Spinner,
} from "@chakra-ui/react";
import { AtSignIcon, LockIcon } from "@chakra-ui/icons";
import React, { FormEvent, useEffect, useState } from "react";
import Router from "next/router";
import useLogin from "../mutations/useLogin";
import { UseMutationResult } from "react-query";
import { motion } from "framer-motion";
import LoginBody from "../types/bodies/LoginBody";

export default function Index() {
    const login: UseMutationResult<AnalyserNode, any, LoginBody, any> =
        useLogin();
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        if (login.data) {
            Router.push("/server");
        }
    }, [login.data]);

    const handleChange = (e, type: string) => {
        setInputs((prevInputs: any) => {
            const newInputs = { ...prevInputs };
            newInputs[type] = e.target.value;
            return newInputs;
        });
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        login.mutate({
            username: inputs.username,
            password: inputs.password,
        });
    };
    return (
        <VStack
            h="100vh"
            w="100%"
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            backgroundImage={`url('/bg.png')`}
        >
            <Box
                margin={20}
                color="#222A2C"
                fontSize="3.5rem"
                fontWeight="bold"
            >
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,

                        transition: { duration: 2 },
                    }}
                >
                    Valheim server manager
                </motion.h1>
            </Box>
            <Center>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={5} w="400px">
                        <Text fontWeight="600" fontSize="2xl">
                            Sign in
                        </Text>
                        <FormControl id="username" isRequired>
                            <FormLabel>Username</FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<AtSignIcon color="gray.200" />}
                                />
                                <Input
                                    color="white"
                                    bg="#082332"
                                    _focus={{ bg: "#082332" }}
                                    _hover={{ bg: "#082332" }}
                                    onChange={(e) =>
                                        handleChange(e, "username")
                                    }
                                    value={inputs.username}
                                    type="username"
                                    variant="filled"
                                    placeholder="Username"
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup mb={5}>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<LockIcon color="gray.200" />}
                                />
                                <Input
                                    color="white"
                                    bg="#082332"
                                    _focus={{ bg: "#082332" }}
                                    _hover={{ bg: "#082332" }}
                                    onChange={(e) =>
                                        handleChange(e, "password")
                                    }
                                    value={inputs.password}
                                    type="password"
                                    variant="filled"
                                    placeholder="Password"
                                />
                            </InputGroup>
                        </FormControl>

                        {login.error && (
                            <Text color="#F87171">
                                {login.error.response.data.error}
                            </Text>
                        )}
                        <Button
                            type="submit"
                            isDisabled={
                                inputs.username === "" || inputs.password === ""
                            }
                            w="100%"
                            bg="#E2A966"
                            _hover={{ bg: "#E2A966" }}
                        >
                            {login.isLoading ? (
                                <Spinner color="white" />
                            ) : (
                                "LOG IN"
                            )}
                        </Button>
                    </VStack>
                </form>
            </Center>
        </VStack>
    );
}
