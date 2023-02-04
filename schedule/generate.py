from schedule_structure import Course, Schedule



def get_available_courses(course_names: list[str]) -> list[Course]:
    return Course.load_from_file(course_names)

def generate_possible_schedules(courses: list[Course], schedule: Schedule, units: int = 12, _ignore_names: set[str] = None) -> list[Schedule]:

    if schedule.totalUnits() > units:
        return []
    elif schedule.totalUnits() == units:
        return [schedule]

    ignore_names = _ignore_names or set()

    schedules = []
    for course in courses:
        if course.course_name in ignore_names:
            continue

        valid_add = schedule.addCourse(course)
        if valid_add and schedule.validSchedule():
            print(f"Add course {course.course_name}")
            schedules.extend([s.copy() for s in generate_possible_schedules(courses, schedule, _ignore_names=ignore_names | {course.course_name,})])
            schedule.removeCourse(course.course_id)
        
        ignore_names.add(course.course_name)

    return schedules


if __name__ == "__main__":
    wanted_classes = ["CHC/LAT 62", "CHC/LAT 63", "DRAMA 199", "I&C SCI 31", "I&C SCI 6D"]

    available_courses = get_available_courses(wanted_classes)
    
    possible_schedules = generate_possible_schedules(available_courses, Schedule())
    for i, s in enumerate(possible_schedules):
        print(f"Schedule {i}:")
        print(str(s))
        print("\n\n")