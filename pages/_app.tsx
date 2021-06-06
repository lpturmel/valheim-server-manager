import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../utils/style/theme";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});
function MyApp({ Component, pageProps }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </QueryClientProvider>
    );
}

export default MyApp;
