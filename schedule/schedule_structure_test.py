from schedule_structure import Course_Time, Course, Professor, Schedule

time1 = Course_Time(True, False, True, False, True, 800, 850)
time2 = Course_Time(False, False, True, False, False, 830, 920)
print(time1)
print(time2)

professor1 = Professor(12345, "Richard", "Pattis", "ICS", "Donald Bren", "tag1, tag2", 4.2, True, 3.6)
professor2 = Professor(54321, "Alex", "Thornton", "ICS", "Donald Bren", "tag3, tag4", 3.9, False, 2.2)
print(professor1)
print(professor1.detailedStr())
print(professor2)
print(professor2.detailedStr())

course1 = Course("ICS33", 6789, professor1, time1)
course2 = Course("ICS32", 9876, professor2, time2)
print(course1)
print(course2)

schedule = Schedule()
schedule.addCourse(course1)
schedule.addCourse(course2)
print(schedule)
print(schedule.validSchedule())

course = Course("I&CSCI 33", "12345", ["PATTIS, R.", "ALFARO, S."], time1, "HIB 100", 4)
print(course.rmp)
print(course.median_gpa)