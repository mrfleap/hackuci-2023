import { Box, Card, CardBody, useToast, Flex, IconButton, useColorModeValue, Text, Heading, Button } from '@chakra-ui/react';
import React from 'react';
import Course from './Course.tsx';
import randomWords from 'random-words';
import randomColor from 'randomcolor';
import axios from 'axios';


const TEST = {
    userID: "TESTING12345",
    userData: {
        addedCourses: [
            { color: "#f44336", term: "2022 Fall", sectionCode: "35550", scheduleIndices: [0] },
            { color: "#e91e63", term: "2022 Fall", sectionCode: "35554", scheduleIndices: [0] },
            { color: "#00bcd4", term: "2022 Fall", sectionCode: "35740", scheduleIndices: [0] },
            { color: "#9c27b0", term: "2022 Fall", sectionCode: "35750", scheduleIndices: [0] },
            { color: "#3f51b5", term: "2022 Fall", sectionCode: "35751", scheduleIndices: [0] },
            { color: "#4caf50", term: "2022 Fall", sectionCode: "35753", scheduleIndices: [0] },
            { color: "#2196f3", term: "2022 Fall", sectionCode: "66010", scheduleIndices: [0] },
            { color: "#673ab7", term: "2022 Fall", sectionCode: "66014", scheduleIndices: [0] },
            { color: "#f5a623", term: "2023 Winter", sectionCode: "34030", scheduleIndices: [4] },
            { color: "#cddc39", term: "2023 Winter", sectionCode: "34032", scheduleIndices: [4] },
            { color: "#ffc107", term: "2023 Winter", sectionCode: "34160", scheduleIndices: [4] },
            { color: "#5ec8e0", term: "2023 Winter", sectionCode: "34163", scheduleIndices: [4] },
            { color: "#5ec8e0", term: "2023 Winter", sectionCode: "34290", scheduleIndices: [4] },
            { color: "#5ec8e0", term: "2023 Winter", sectionCode: "34291", scheduleIndices: [4] },
            { color: "#5ec8e0", term: "2023 Winter", sectionCode: "35700", scheduleIndices: [4] },
            { color: "#8bc34a", term: "2023 Winter", sectionCode: "35701", scheduleIndices: [4] },
            { color: "#009688", term: "2023 Winter", sectionCode: "35717", scheduleIndices: [4] },
        ],
        scheduleNames: ["Schedule 1", "Schedule 2", "Schedule 3", "Schedule 4", "Winter 2023"],
        customEvents: [],
    },
};

const Schedule = (props) => {
    const toast = useToast();
    return (
        <Card flexGrow={1}>
            <CardBody>
                <Flex dir="row" justifyContent="space-between">
                    <Box mb="4">
                        <Heading as="h3">
                            Schedule {props.n}
                        </Heading>
                        <Text color="gray.500">ZotRating: {(props.schedule.score * 100).toFixed(0)}/100</Text>
                    </Box>
                    <Button
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => {
                            const code = randomWords({ exactly: 3, join: "-" });
                            const payload = {
                                userID: code,
                                userData: {
                                    addedCourses: props.schedule.courses.map((course, i) => ({
                                        color: randomColor(),
                                        term: "2023 Winter",
                                        sectionCode: course.course_id,
                                        scheduleIndices: [0],
                                    })),
                                },
                                scheduleNames: ["2023 Winter"],
                                customEvents: [],
                            };

                            // fetch("https://api.antalmanac.com/api/users/saveUserData", {
                            //     credentials: "omit",
                            //     headers: {
                            //         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0",
                            //         Accept: "*/*",
                            //         "Accept-Language": "en-US,en;q=0.5",
                            //         "Content-Type": "application/json",
                            //     },
                            //     referrer: "https://antalmanac.com/",
                            //     body: JSON.stringify(payload),
                            //     method: "POST",
                            // });

                            // Send a request to https://zotapi.fly.dev /save with the body payload json
                            axios.post("https://zotapi.fly.dev/save", payload).then((res) => {
                                // Show a Chakra ui toast with the code and instructions to put it into antalmanac.com
                                toast({
                                    title: "Saved to AntAlmanac",
                                    position: "bottom-right",
                                    description: `Your schedule has been saved to AntAlmanac. You can access it by heading to https://antalmanac.com and entering the code '${code}'`,
                                    status: "success",
                                    duration: 15000,
                                    isClosable: true,
                                });
                            });
                        }}
                    >
                        Save to AntAlmanac
                    </Button>
                </Flex>
                <Flex alignContent="center" justifyContent="center" direction={"column"} gap="4">
                    {props.schedule.courses.map((course, i) => (
                        <Course key={i} schedule={course} />
                    ))}
                </Flex>
            </CardBody>
        </Card>
    );
};

export default Schedule;