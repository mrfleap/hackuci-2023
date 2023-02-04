import React, { ReactNode, useState } from 'react';
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    Input,
    FlexProps,
    InputGroup,
    InputLeftElement,
    Spacer,
} from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import Course from './Course.tsx';
import { SearchIcon } from '@chakra-ui/icons';

import {
    AsyncCreatableSelect,
    AsyncSelect,
    CreatableSelect,
    Select,
    chakraComponents,
} from "chakra-react-select";

import axios from "axios";

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

export default function SimpleSidebar({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [classes, setClasses] = useState([]);
    const [value, setValue] = useState(null);

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <Box
                bg={useColorModeValue('white', 'gray.900')}
                borderRight="1px"
                borderRightColor={useColorModeValue('gray.200', 'gray.700')}
                w={{ base: 'full', md: "45%" }}
                pos="fixed"
                padding="1rem"
                h="full">
                <Flex h="20" alignItems="center" justifyContent="space-between">
                    <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                        Wanted Classes
                    </Text>
                    <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
                </Flex>

                {/* <InputGroup mb="8">
                    <InputLeftElement
                        pointerEvents='none'
                        children={<SearchIcon color='gray.300' />}
                    />
                    <Input placeholder='Add a course...' />
                </InputGroup> */}
                <AsyncSelect
                    placeholder="Add a class..."
                    components={asyncComponents}
                    loadOptions={(inputValue, callback) => {
                        axios.get("http://localhost:8000/search_classes", {
                            params: {
                                query: inputValue
                            }
                        }).then((resp) => callback(resp.data.classes));
                    }}
                    onChange={(v) => {
                        console.log(v);
                        setValue(null);
                        setClasses([v, ...classes]);
                    }}
                    value={value}
                />

                <Flex mt="8" gap="2" alignItems="center" flexDirection="column">
                    {classes.map((v, i) => <Course key="i" record={v} remove={() => {setClasses(classes.filter((c) => c != v))}}></Course>)}
                </Flex>

            </Box>
            <Box ml={{ base: 0, md: "45%" }} p="4">
                Schedules go here...
            </Box>
        </Box>
    );
}