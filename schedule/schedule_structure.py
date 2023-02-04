import copy
from itertools import combinations
import json
import re
from typing import Iterable, Self

with open("/home/phillip/projects/hackuci-2023/schedule/course_schedule.json", "r") as f:
    COURSE_SCHEDULE = json.loads(f.read())

class Course_Time:
    def __init__(self, mon: bool, tue: bool, wed: bool, thu: bool, fri: bool, sat: bool, sun: bool, start: int, end: int):
        self.mon = mon
        self.tue = tue
        self.wed = wed
        self.thu = thu
        self.fri = fri
        self.sat = sat
        self.sun = sun
        self.start = start
        self.end = end

    def conflicts(self, other) -> bool:
        """
        Checks if one Course_Time conflicts with another, returning True if they do conflict
        """
        if self.mon and other.mon or self.tue and other.tue or self.wed and other.wed or self.thu and other.thu or self.fri and other.fri:
            if self.start < other.end and other.start < self.end:
                return True
        return False

    def __str__(self) -> bool:
        return f"{self.start // 100}:{self.start % 100 if self.start % 100 != 0 else '00'} - {self.end // 100}:{self.end % 100 if self.end % 100 != 0 else '00'} every {'Mon' if self.mon else ''}{'Tue' if self.tue else ''}{'Wed' if self.wed else ''}{'Thu' if self.thu else ''}{'Fri' if self.fri else ''}"


class Professor:
    def __init__(self, first_name: str, last_name: str, department: str, school: str, rmp_id: int, tags: list, rating: float, take_again: bool, difficulty: float):
        self.rmp_id = rmp_id
        self.first_name = first_name
        self.last_name = last_name
        self.department = department
        self.school = school
        self.tags = tags
        self.rating = rating
        self.take_again = take_again
        self.difficulty = difficulty

    def __str__(self) -> None:
        return f"{self.first_name} {self.last_name}"

    def detailedStr(self) -> str:
        return f"{self.first_name} {self.last_name}\nDepartment: {self.department}\nSchool: {self.school}\nRateMyProfessor\n\tID: {self.rmp_id}\n\tRating: {self.rating}\n\tDifficulty: {self.difficulty}\n\tTake Again: {self.take_again}\n\tTags: {self.tags}"


class Course:
    def __init__(self, course_name: str, course_id: str, professors: list[str], time: Course_Time, location: str, units: int, course_info: dict = None):
        self.course_name = course_name
        self.course_id = course_id
        self.professors = professors
        self.time = time
        self.location = location
        self.units = units
        self.course_info = course_info

    @classmethod
    def load_from_file(cls, only_names: Iterable[str]) -> list[Self]:
        only_names = set(only_names)

        courses = []
        for (course, courses_data) in COURSE_SCHEDULE.items():
            if course not in only_names:
                continue

            for course_data in courses_data:
                # Use regex to parse 'MTuWThFSaSu' into a list of booleans mon, tue, wed, thu, fri, sat, sun based on whether each day exists in the string
                days = course_data["time"]["days"]

                start, end = None, None
                if course_data["time"]["time"] != "TBA":
                    start = int((course_data["time"]["time"].strip()).split("-")[0].replace(":", ""))
                    end = int((course_data["time"]["time"].strip()).split("-")[1].replace(":", "").replace("p", ""))

                if "p" in course_data["time"]["time"] and start and end:
                    start += 1200
                    end += 1200

                courses.append(Course(
                    course_name=course,
                    course_id=course_data["ID"],
                    professors=course_data["professors"],
                    time=Course_Time(
                        mon="M" in days,
                        tue="Tu" in days,
                        wed="W" in days,
                        thu="Th" in days,
                        fri="F" in days,
                        sat="Sa" in days,
                        sun="Su" in days,
                        start=start,
                        end=end,
                    ),
                    units=int(course_data["units"].split("-")[-1]) if "-" in course_data["units"] else int(course_data["units"]),
                    location=course_data["location"].strip(),
                    course_info=course_data,
                ))
        return courses

    # @classmethod
    # def from_course_id(cls, course_id: str) -> Self:
    #     courses = [c for c in COURSES if c["id"] == course_id]

    #     if not courses:
    #         raise ValueError(f"Course with id {course_id} not found")

    #     course = courses[0]
    #     course_obj = Course(
    #         course_name=course["department"] + " " + course["number"],
    #         course_id=course["id"]
    #         professors=
    #     )

    def conflicts(self, other) -> bool:
        """
        Checks if one Course conflicts with another, returns True if they do conflict
        """
        return self.time.conflicts(other.time)

    def __str__(self) -> None:
        return f"{self.course_name}\nID: {self.course_id}\nProf: {self.professors}\nLocation: {self.location}\n{self.time if self.time.start else 'Time: TBA'}"


class Schedule:
    def __init__(self, courses: list[Course] = []):
        self.courses = courses

    def totalUnits(self) -> int:
        return sum([c.units for c in self.courses])
    
    def courseInSchedule(self, search_id: int) -> bool:
        """
        Checks if a course exists in the schedule with course_id.
        """
        for course in self.courses:
            if course.course_id == search_id:
                return True
        return False

    def addCourse(self, course: Course) -> bool:
        """
        Adds a course to the schedule.
        Returns True if successfully added, False if course_id already exists in schedule
        """
        if self.courseInSchedule(course.course_id): return False
        self.courses.append(course)
        return True

    def removeCourse(self, remove_id: int) -> bool:
        """
        Removes a course from the schedule by course_id.
        Returns True if successfully removed, False otherwise.
        """
        for course in self.courses:
            if course.course_id == remove_id:
                self.courses.remove(course)
                return True
        return False

    def validSchedule(self) -> bool:
        """
        Validates the schedule.
        Returns True if valid (no time conflicts), False otherwise
        """
        if len(self.courses) > 1:
            for course1, course2 in combinations(self.courses, 2):
                if course1.conflicts(course2):
                    return False
        return True
    
    def copy(self) -> Self:
        return copy.deepcopy(self)

    def __str__(self) -> None:
        return "".join(f"{course}\n" for course in self.courses)
