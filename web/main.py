import inspect
import json as orjson
import os
import time
import sys
from typing import Any, List, Union
# import orjson 

from fastapi import Body, FastAPI

from fastapi.middleware.cors import CORSMiddleware

from schedule.schedule_structure import Course, Course_Time, Schedule
from schedule.generate import generate_possible_schedules, get_available_courses, rank_schedules

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_courses():
    with open("courses.json", "r") as f:
        courses_data = orjson.loads(f.read())

    values = []
    index = []

    for i, course in enumerate(courses_data):
        label = course["department"] + " " + course["number"] + " - " + course["title"]
        values.append({
            "id": i,
            "value": course["id"],
            "label": label,
            "department": course["department"],
            "number": course["number"],
            "description": course["description"],
            "course": course["department"] + " " + course["number"],
            "prereq": course["prerequisite_text"],
            "restriction": course["restriction"],
            "ge_list": course["ge_list"],
            "units": course["units"][0],
            "course_level": course["course_level"],
        })
        index.append(label.lower())
    
    return values, index

COURSES, INDEX = load_courses()

import meilisearch
client = meilisearch.Client('http://localhost:7700', "MASTER_KEY")
courses = client.index("courses")

if __name__ == "__main__":
    import time
    client.index("courses").delete()
    time.sleep(2)
    client.index("courses").add_documents(COURSES)
    courses.update_searchable_attributes(["course", "label", "description"])
#     courses.update_ranking_rules(["typo",
#   "exactness",
#   "proximity",
#   "words",
#   "attribute",
#   "sort",])
    # courses.update_typo_tolerance({
    # 'minWordSizeForTypos': {
    #     'oneTypo': 1,
    #     'twoTypos': 2,
    # }
    # })
    # client.index("courses").docu

    # print(client.index("courses").search("I&C SCI 31"))
    pass

@app.get("/search_classes")
async def search_classes(query: str):
    query = query.lower()
    search = courses.search(query)

    return {"classes": search["hits"]}

@app.post("/generate")
async def generate(body: dict = Body(...)):
    if not body.get("classes", {}):
        return {"ok": False, "error": "No classes provided", "schedules": []}
    
    units = int(body.get("units", 16))

    wanted_classes = [c["course"] for c in body["classes"]]
    print(f"Wanted courses: {len(wanted_classes)}")
    available_courses = get_available_courses(wanted_classes)
    print(f"Available courses: {len(available_courses)}")
    start = time.time()
    possible_schedules = generate_possible_schedules(available_courses, Schedule(), units=units)
    print(f"Took {time.time()-start:.2f}s to run")

    # print(possible_schedules)
    print(f"Possible schedules: {len(possible_schedules)}")
    start = time.time()
    rank_schedules(possible_schedules)
    print(f"Ranking took {time.time()-start:.2f}s to run")

    possible_schedules = possible_schedules[:20] + possible_schedules[-20:]

    for schedule in possible_schedules:
        for course in schedule.courses:
            course.record = [c for c in COURSES if c["course"] == course.course_name][0]
            course.time_str = str(course.time)
            course.getRMP_GPA()

    # print(body)
    # schedules = [
    #     Schedule(courses=[Course("ICS 32A", 123, ["Pattis"], Course_Time(True, False, True, False, True, 900, 930), "ALP 1100")]),
    #     Schedule(courses=[Course("ICS 32A", 123, ["Pattis"], Course_Time(True, False, True, False, True, 900, 930), "ALP 1100")]),
    #     Schedule(courses=[Course("ICS 32A", 123, ["Pattis"], Course_Time(True, False, True, False, True, 900, 930), "ALP 1100")]),
    #     Schedule(courses=[Course("ICS 32A", 123, ["Pattis"], Course_Time(True, False, True, False, True, 900, 930), "ALP 1100")]),
    # ]
    
    return {"ok": True, "schedules": possible_schedules}