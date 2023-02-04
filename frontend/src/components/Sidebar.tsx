// import React, { ReactNode, useState } from 'react';
// import {
//     Box, useColorModeValue, useDisclosure
// } from '@chakra-ui/react';

// import {
//     chakraComponents
// } from "chakra-react-select";
import SideContent from './SideContent.tsx';



// export default function SimpleSidebar({ children }: { children: ReactNode }) {
//     return (
//         <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
//             <Box
//                 bg={useColorModeValue('white', 'gray.900')}
//                 borderRight="1px"
//                 borderRightColor={useColorModeValue('gray.200', 'gray.700')}
//                 w={{ base: 'full', md: "45%" }}
//                 pos="fixed"
//                 padding="1rem"
//                 h="full">
                
//                 <SideContent/>
//             </Box>
//             <Box ml={{ base: 0, md: "45%" }} p="4">
//                 Schedules go here...
//             </Box>
//         </Box>
//     );
// }
import React, { ReactNode, useState } from "react";
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Heading,
} from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import Schedule from './Schedule.tsx';
import { InfoIcon } from '@chakra-ui/icons';

interface LinkItemProps {
    name: string;
    icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
    { name: "Home", icon: FiHome },
    { name: "Trending", icon: FiTrendingUp },
    { name: "Explore", icon: FiCompass },
    { name: "Favourites", icon: FiStar },
    { name: "Settings", icon: FiSettings },
];

export default function SimpleSidebar({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [schedules, setSchedules] = useState([]);

    return (
        <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
            <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} setSchedules={setSchedules} />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} setSchedules={setSchedules} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: "45%", xl: "40rem" }} p="4" h="100vh">
                {schedules.length > 0 ? (
                    <Flex flexWrap={"wrap"} gap="4" flexFlow={"row wrap"} alignContent="flex-start">
                        {schedules.map((s, i) => (
                            <Schedule schedule={s} key={i} />
                        ))}
                    </Flex>
                ) : (
                    <Flex w="100%" h="100%" alignItems={"center"} justifyContent="center">
                        <Box textAlign="center" py={10} px={6}>
                            <InfoIcon boxSize={"50px"} color={"blue.500"} />
                            <Heading as="h2" size="xl" mt={6} mb={2}>
                                No Schedules Yet
                            </Heading>
                            <Text color={"gray.500"}>
                                Select some classes you'd like to take on the left, select "Generate Schedules", and let us do the course
                                planning for you!
                            </Text>
                        </Box>
                    </Flex>
                )}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
    setSchedules: (s) => void;
}

const SidebarContent = ({ setSchedules, ...props }: SidebarProps) => {
    return (
        <Box
            bg={useColorModeValue("white", "gray.900")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: "45%", xl: "40rem" }}
            pos="fixed"
            padding={"1rem"}
            h="full"
            {...props}
        >
            <SideContent {...props} setSchedules={setSchedules} />
        </Box>
    );
};


interface MobileProps extends FlexProps {
    onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent={{ base: "space-between", md: "flex-end" }}
            display={{ base: "block", md: "none" }}
            {...rest}
        >
            <IconButton
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text display={{ base: "flex", md: "none" }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                Logo
            </Text>
        </Flex>
    );
};
