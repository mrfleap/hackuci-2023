import React, { useState } from "react";
import { Box, Button, CloseButton, Flex, Input, InputGroup, InputRightAddon, Text, useColorMode, useDisclosure, useToast } from "@chakra-ui/react";
import Course from "./Course.tsx";

import { AsyncSelect, chakraComponents } from "chakra-react-select";

import axios from "axios";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import useLocalStorageState from "use-local-storage-state";

const asyncComponents = {
    LoadingIndicator: (props) => (
        <chakraComponents.LoadingIndicator
            color="currentColor" // <-- This default's to your theme's text color (Light mode: gray.700 | Dark mode: whiteAlpha.900)
            emptyColor="transparent"
            spinnerSize="md"
            speed="0.45s"
            thickness="2px"
            {...props}
        />
    ),
};

function SideContent(props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [classes, setClasses] = useLocalStorageState("wanted-classes", { defaultValue: [] });
    const [value, setValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { colorMode, toggleColorMode } = useColorMode();

    // Create fetchCourses function which generates schedules from /generate and updates isLoading appropriately
    const fetchCourses = () => {
        setIsLoading(true);
        axios
            .post("http://localhost:8000/generate", {
                classes: classes,
            })
            .then((resp) => {
                console.log(resp.data);
                setIsLoading(false);
                props.setSchedules(resp.data.schedules);
            }).catch((err) => {
                console.log(err);
                setIsLoading(false);
                // Show Chakra UI toast that an error occured
                toast({
                    position: "bottom-right",
                    title: "An unknown error occured.",
                    description: "Please try again or contact pcutter@uci.edu.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });
    };

    return (
        <>
            <Flex justifyContent={"space-between"} flexDirection={"column"} h="100%">
                <Box w="100%">
                    <Flex h="20" alignItems="center" justifyContent="space-between" flex="0 0 auto">
                        <Text fontSize="2xl" fontWeight="bold">
                            Wanted Classes
                        </Text>
                        <Button onClick={toggleColorMode}>{colorMode === "light" ? <MoonIcon /> : <SunIcon />}</Button>
                        <CloseButton display={{ base: "flex", md: "none" }} onClick={props.onClose} />
                    </Flex>
                    <AsyncSelect
                        placeholder="Add a class..."
                        components={asyncComponents}
                        loadOptions={(inputValue, callback) => {
                            axios
                                .get("http://localhost:8000/search_classes", {
                                    params: {
                                        query: inputValue,
                                    },
                                })
                                .then((resp) => callback(resp.data.classes));
                        }}
                        onChange={(v) => {
                            console.log(v);
                            setValue(null);
                            setClasses([v, ...classes]);
                        }}
                        value={value}
                    />
                </Box>
                <Flex pt="8" gap="2" flexDirection="column" flexGrow="1" overflowY="auto">
                    {classes.map((v, i) => (
                        <Course
                            key="i"
                            record={v}
                            remove={() => {
                                setClasses(classes.filter((c) => c != v));
                            }}
                        ></Course>
                    ))}
                </Flex>
                <Flex gap="4" flexDir="row">
                    <InputGroup size="sm">
                        <Input placeholder="16" />
                        <InputRightAddon children="Units" />
                    </InputGroup>
                    <Button
                        isLoading={isLoading}
                        loadingText="Generating Schedules..."
                        colorScheme="blue"
                        onClick={fetchCourses}
                        flex="0 0 auto"
                    >
                        Generate Schedules
                    </Button>
                </Flex>
            </Flex>
        </>
    );
}

export default SideContent;

