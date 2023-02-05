import React, { useState } from "react";
import { Box, Button, CloseButton, Flex, Heading, Image, Input, InputGroup, InputRightAddon, Text, useColorMode, useDisclosure, useToast } from "@chakra-ui/react";
import Course from "./Course.tsx";

import { AsyncSelect, chakraComponents } from "chakra-react-select";
import peter from "../peter.jpg";

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
    const [units, setUnits] = useLocalStorageState("wanted-units", { defaultValue: 16 });
    const [value, setValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { colorMode, toggleColorMode } = useColorMode();
    // Create a ref
    // const selectRef = React.useRef(null);
    // Create state for input
    const [input, setInput] = useState("");

    // Create fetchCourses function which generates schedules from /generate and updates isLoading appropriately
    const fetchCourses = () => {
        setIsLoading(true);
        axios
            .post("https://zotapi.fly.dev/generate", {
                classes: classes,
                units: units,
            })
            .then((resp) => {

                if (resp.data.schedules.length <= 0) {
                    toast({
                        position: "bottom-right",
                        title: "No Schedules Possible",
                        description: "Try adding more classes or increasing the number of units.",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                    });
                }                
                
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
                    <Flex direction="column" alignItems="center" justifyItems="center">
                        <Image src={peter} w="16rem"></Image>
                        <Heading as="h2">ZotScheduler</Heading>
                    </Flex>
                    <Flex h="20" alignItems="center" justifyContent="space-between" flex="0 0 auto">
                        <Text fontSize="2xl" fontWeight="bold">
                            Wanted Classes
                        </Text>
                        <Flex direction="row" gap="4" alignItems="center" justifyItems="center">
                            <Button onClick={toggleColorMode}>{colorMode === "light" ? <MoonIcon /> : <SunIcon />}</Button>
                            <CloseButton display={{ base: "flex", md: "none" }} onClick={props.onClose} />
                        </Flex>
                    </Flex>
                    <AsyncSelect
                        placeholder="Add a class..."
                        components={asyncComponents}
                        onInputChange={(v) => setInput(v)}
                        noOptionsMessage={() => (input.length <= 0 ? "Type to search for a class..." : "No classes found")}
                        loadOptions={(inputValue, callback) => {
                            axios
                                .get("https://zotapi.fly.dev/search_classes", {
                                    params: {
                                        query: inputValue,
                                    },
                                })
                                .then((resp) => callback(resp.data.classes));
                        }}
                        onChange={(v) => {
                            setValue(null);
                            // Cancel if class is already in classes based on class.course_id
                            if (classes.some((c) => c.course_id == v.course_id)) {
                                // Add a short toast (3s) that indicates the class was already added, including the course.name
                                toast({
                                    position: "bottom-right",
                                    title: "Class Already Added",
                                    description: `'${v.label}' is already in your list of wanted classes.`,
                                    status: "info",
                                    duration: 5000,
                                    isClosable: true,
                                });

                                return;
                            }
                            // Limit the number of classes to 50, and send a toast on the message
                            if (classes.length >= 50) {
                                toast({
                                    position: "bottom-right",
                                    title: "Too Many Classes",
                                    description: "You can only add up to 50 classes.",
                                    status: "warning",
                                    duration: 5000,
                                    isClosable: true,
                                });
                                return;
                            }
                            
                            setClasses([v, ...classes]);
                        }}
                        value={value}
                    />
                </Box>
                <Flex pt="8" gap="2" flexDirection="column" flexGrow="1" overflowY="auto">
                    {classes.map((v, i) => (
                        <Course
                            key={i}
                            record={v}
                            remove={() => {
                                setClasses(classes.filter((c) => c != v));
                            }}
                        ></Course>
                    ))}
                </Flex>
                <Flex gap="4" flexDir="row">
                    <InputGroup size="md">
                        <Input placeholder="16" value={units} onChange={(e) => setUnits(e.target.value)} />
                        <InputRightAddon children="Units"  />
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

