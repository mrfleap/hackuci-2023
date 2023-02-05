import json
import pandas as pd
# import sklearn
# from sklearn.impute import KNNImputer
# import sklearn.ensemble, sklearn.ensemble, sklearn.svm
# import numpy as np

import os
script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
grades = pd.read_csv(os.path.join(script_dir, "course_grades.csv"))
scores = pd.read_csv(os.path.join(script_dir, "final_regression.csv"))

# s = sklearn.preprocessing.MinMaxScaler()
grades["avg_gpa"] = pd.read_csv(os.path.join(script_dir, "avg_gpa.csv"))
scores["score"] = pd.read_csv(os.path.join(script_dir, "score.csv"))

# grades["avg_gpa"].to_csv("avg_gpa.csv", index=False)
# scores["score"].to_csv("score.csv", index=False)

def class_score(professor, course):
    total = []
    # print(f"Professor: {professor}, Course: {course}, {not scores[scores.name == professor].empty}, {not grades[grades.course_name == course].empty}")
    if not scores[scores.name == professor].empty:
        # print("adding total")
        total.append(scores[scores.name == professor]["score"].iloc[0])
    else:
        total.append(0.35)
    
    if not grades[grades.course_name == course].empty:
        # print("adding course")
        total.append(grades[grades.course_name == course]["avg_gpa"].iloc[0])
    else:
        total.append(0.35)
    return sum(total) / len(total) if total else 0.40

def get_schedule_score(schedule):
    scores = []
    for i in schedule.courses:
        score = class_score(i.professors[0], i.course_name)
        i.score = score
        scores.append(score)

    return sum(scores) /  len(scores) if scores else 0.25