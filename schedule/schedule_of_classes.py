import requests
from schedule_structure import Schedule, Professor, Course, Course_Time
import time
import json

# Data to be stored
# Course name, section code
# Prof
# Location
# Time

def getScheduleOfClasses(year: int, quarter: str, department: str, courseNumber: int):
    response = requests.get(f"https://api.peterportal.org/rest/v0/schedule/soc?term={year}%20{quarter}&department={department}&courseNumber={courseNumber}").content.decode("utf-8")
    

def getAllCourses():
    """
    Retrieves all UCI courses and store in file
    """
    response = requests.get("https://api.peterportal.org/rest/v0/courses/all")
    if response.status_code == 200:
        f = open("all_courses.json", "wb")
        f.write(response.content)
        f.close

