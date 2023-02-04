import { Box, Card, CardBody, Flex, IconButton, useColorModeValue, Text, Heading } from '@chakra-ui/react';
import React from 'react';
import Course from './Course.tsx';

const Schedule = (props) => {
    console.log(props);
    return (
        <Card flexGrow={1}>
            <CardBody>
                <Heading as="h3" mb="4">Schedule 1</Heading>
                <Flex alignContent="center" justifyContent="center">
                    {props.schedule.courses.map((course, i) => <Course key={i} schedule={course} />)}
                </Flex>
            </CardBody>
        </Card>
    );
};

export default Schedule;