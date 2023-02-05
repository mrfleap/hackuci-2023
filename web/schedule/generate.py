from functools import cmp_to_key
from .ranking import get_schedule_score
from .schedule_structure import Course, Schedule



def get_available_courses(course_names: list[str]) -> list[Course]:
    return Course.load_from_file(course_names)

def generate_possible_schedules(courses: list[Course], schedule: Schedule, units: int = 16, _ignore_names: set[str] = None, _ignore_codes: set[str] = None) -> list[Schedule]:

    if schedule.totalUnits() > units:
        return []
    elif schedule.totalUnits() == units:
        return [schedule]

    ignore_names = _ignore_names or set()
    ignore_codes = _ignore_codes or set()

    schedules = []
    for course in courses:
        if course.course_name in ignore_names or course.units <= 0 or course.course_id in ignore_codes:
            continue
        
        # print(f"Before add: {schedule.totalUnits()}")
        valid_add = schedule.addCourse(course)
        # print(f"Add course {course.course_name} ({course.units}), total units: {schedule.totalUnits()}")
        # print(f"Valid add: {valid_add} valid schedule: {schedule.validSchedule()}")
        if valid_add:
            # print(f"Testing inner, starting with {schedule.totalUnits()}")
            schedules.extend([s.copy() for s in generate_possible_schedules(courses, schedule, _ignore_names=ignore_names | {course.course_name,}, units=units, _ignore_codes=ignore_codes | {course.course_id,})])

        schedule.removeCourse(course.course_id)
        
        ignore_codes.add(course.course_id)

    return schedules

def rank_schedules(schedules: list[Schedule]):
    for s in schedules:
        s.score = get_schedule_score(s)

    schedules.sort(key=lambda s: s.score, reverse=True)
    # schedules.sort(key=cmp_to_key(lambda s1, s2: get_schedule_score(s1) - get_schedule_score(s2)))


if __name__ == "__main__":
    wanted_classes = ["CHC/LAT 62", "CHC/LAT 63", "DRAMA 199", "I&C SCI 31", "I&C SCI 6D"]

    available_courses = get_available_courses(wanted_classes)
    
    possible_schedules = generate_possible_schedules(available_courses, Schedule())
    rank_schedules(possible_schedules)
    for i, s in enumerate(possible_schedules):
        print(f"Schedule {i}:")
        print(str(s))
        print("\n\n")
