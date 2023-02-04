from typing import Union
import orjson

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from fuzzy_match import algorithims

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
