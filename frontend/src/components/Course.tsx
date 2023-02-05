import { DeleteIcon, InfoIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Text,
    Flex,
    IconButton,
    Spacer,
    useColorModeValue,
    Box,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
} from "@chakra-ui/react";
import React from "react";
import { FiBarChart2 } from "react-icons/fi";

export default function Course(props) { 
    const label = props.record?.label || props.schedule.course_name;
    const record = props.record || props.schedule.record;
    return (
        <Card w="100%">
            <CardBody>
                <Flex alignContent="center" justifyContent="center">
                    <Box>
                        <Text>{label}</Text>
                        <Text color={useColorModeValue("gray.500", "gray.500")}>
                            {record.course_level} | {record.units} Units {props.schedule ? `| ${props.schedule.course_id}` : ""}
                        </Text>
                    </Box>
                    <Spacer minW="8" />
                    {props.record ? (
                        <IconButton aria-label="Remove course" icon={<DeleteIcon />} onClick={props.remove} />
                    ) : (
                        <Text whiteSpace={"pre-line"} textAlign="right" color="gray.500">
                            {props.schedule.time_str}
                        </Text>
                    )}
                </Flex>
                {props.schedule ? (
                    <Flex alignContent="center" justifyContent="center">
                        <Text whiteSpace="pre-line">{props.schedule.professors.join("\n")}</Text>
                        <Text color="gray.500" whiteSpace="pre-line">
                            RateMyProfessor:{" "}
                            {typeof props.schedule.median_gpa == "number"
                                ? props.schedule.rmp.toFixed(1)
                                : props.schedule.rmp}
                            /5
                        </Text>
                        <Spacer minW="8" />
                        <Text color="gray.500">
                            Avg. GPA:{" "}
                            {typeof props.schedule.median_gpa == "number"
                                ? props.schedule.median_gpa.toFixed(1)
                                : props.schedule.median_gpa}
                        </Text>
                    </Flex>
                ) : null}
                <Popover>
                    <Flex alignContent="center" justifyContent="center" mt="6" gap="2">
                        <PopoverTrigger>
                            <Button leftIcon={<InfoOutlineIcon />} variant="outline">
                                Class Info
                            </Button>
                        </PopoverTrigger>

                        <Button
                            leftIcon={<FiBarChart2 />}
                            variant="outline"
                            onClick={() => {
                                var f = document.createElement("form");
                                f.action = "https://zotistics.com";
                                f.method = "POST";
                                f.target = "_blank";
                                f.name = "zotistics";

                                Object.entries({
                                    selectDep: props.record.department,
                                    classNum: props.record.number,
                                    code: "",
                                    teacher: "",
                                    csrf_token:
                                        "IjhiYjVmMjYxZWFhMTA5OWQ2N2YwN2FmYmYxNDY1ZTZkYjliMTVkMTci.Y96rYA.8setBYuR7iI-BSnV4wge5QFrGBg",
                                }).forEach((e) => {
                                    const [k, v] = e;
                                    let i = document.createElement("input");
                                    i.type = "hidden";
                                    i.name = k;
                                    i.value = v;
                                    f.appendChild(i);
                                });

                                document.body.appendChild(f);
                                f.submit();
                            }}
                        >
                            Zotistics
                        </Button>
                    </Flex>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>{label}</PopoverHeader>
                        <PopoverBody>
                            <Text fontSize={13}>{record.description}</Text>
                            <Text fontSize={13} as="b">
                                Prerequisite:{" "}
                            </Text>
                            <Text fontSize={13}>{record.prereq}</Text>
                            <Text fontSize={13} as="b">
                                Restriction:{" "}
                            </Text>
                            <Text fontSize={13}>{record.restriction}</Text>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </CardBody>
        </Card>
    );
}
