import { extendTheme } from "@chakra-ui/react";

const config: any = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};
const theme = extendTheme({
    config,
});
export default theme;
