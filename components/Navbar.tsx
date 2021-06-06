import { Button } from "@chakra-ui/button";
import { Badge, HStack, Text } from "@chakra-ui/layout";
import React from "react";
import useLogout from "../mutations/useLogout";
import Router from "next/router";
import User from "../types/entities/User";
import { Spinner } from "@chakra-ui/spinner";

export interface NavbarProps {
    user: User;
}

const Navbar: React.FunctionComponent<NavbarProps> = ({ user }) => {
    const { mutate, isLoading } = useLogout();

    const handleLogout = () => {
        mutate();
        Router.push("/");
    };
    return (
        <HStack
            paddingX={4}
            position="absolute"
            left={0}
            top={0}
            h="50px"
            w="100%"
            justifyContent="flex-end"
        >
            <HStack spacing={10}>
                <Badge colorScheme="blue">{user.username}</Badge>
                <Button size="sm" onClick={handleLogout}>
                    {isLoading ? <Spinner size="sm" /> : "LOGOUT"}
                </Button>
            </HStack>
        </HStack>
    );
};

export default Navbar;
