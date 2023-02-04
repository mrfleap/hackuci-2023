import requests
# from schedule_structure import Schedule, Professor, Course, Course_Time
import time
import json

# Data to be stored
# Course name, section code
# Prof
# Location
# Time

def getClassInfo(year: int, quarter: str, department: str, courseNumber: int) -> dict[int: list[dict]]:
    response = requests.get(f"https://api.peterportal.org/rest/v0/schedule/soc?term={year}%20{quarter}&department={department}&courseNumber={courseNumber}").content.decode("utf-8")
    if response == '{"schools":[]}' : return {}
    response = json.loads(response)
    response = getInfo(response)
    return {f"{department} {courseNumber}": response}

def getInfo(response: dict) -> list[dict]:
    info = []

    for section in response["schools"][0]["departments"][0]["courses"][0]["sections"]:
        course_id = section["sectionCode"]
        professors = section["instructors"]
        location = section["meetings"][0]["bldg"]
        course_time = {"days": section["meetings"][0]["days"], "time": section["meetings"][0]["time"]}
        info.append({"ID": course_id, "professors": professors, "location": location, "time": course_time})

        # time = Course_Time(False, False, False, False, False, 0, 0)
        # if "M" in section["meetings"][0]["days"]:
        #     time.mon = True
        # if "Tu" in section["meetings"][0]["days"]:
        #     time.tue = True
        # if "W" in section["meetings"][0]["days"]:
        #     time.wed = True
        # if "Th" in section["meetings"][0]["days"]:
        #     time.thu = True
        # if "F" in section["meetings"][0]["days"]:
        #     time.fri = True
        # times = convert_time(section["meetings"][0]["time"])
        # time.start = times[0]
        # time.end = times[1]
        # info.append(Course(course_name, course_id, professors, time, location))

    return info

def convert_time(time: str) -> list[int, int]:
    if time == "" or time == "TBA": return [0,0]
    pm_offset = 0 if "p" not in time else 1200
    times = time.split("-")
    for i in [0, 1]:
        t = ''.join(c for c in times[i] if c.isdigit())
        times[i] = int(t) + pm_offset
    return times


def getAllCourses() -> None:
    """
    Retrieves all UCI courses and store in file
    """
    response = requests.get("https://api.peterportal.org/rest/v0/courses/all")
    if response.status_code == 200:
        with open("all_courses.json", "wb") as f:
            f.write(response.content)


def getAllCourseNames() -> None:
    """
    Retrieves all UCI course names from json file.
    """
    all_course_dict = {}
    with open("all_courses.json", "rb") as f:
        all_course_dict = json.load(f)
    
    with open("all_course_names.txt", "w") as f:
        for course in all_course_dict:
            f.write(f"{course.get('department', None)} {course.get('number', None)}\n")


with open("all_course_names.txt", "r") as fin:
    counter = 0
    all_class = {}

    for line in fin:
        course = line.strip().rsplit(sep=" ", maxsplit=1)
        time.sleep(0.1)
        print(f"Retrieving {course[0]} {course[1]} information...")
        all_class.update(getClassInfo(2023, "Winter", course[0], course[1]))

        counter += 1
        if counter == 6:
            break

    with open("all_course_info.json", "w") as fout:
        json.dump(all_class, fout)
