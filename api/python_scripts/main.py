from bs4 import BeautifulSoup
import json
import collections
import requests
import tempfile
from xml.etree import ElementTree
import re
import datetime
import os


def check_days(course):
    day_tags = ["mon_day", "tue_day", "wed_day",
                "thu_day", "fri_day", "sat_day", "sun_day"]
    days = []
    for day_tag in day_tags:
        day_node = course.find(day_tag)
        if (day_node):
            days.append(day_node.text)
    return days


def convert_term(number):
    readable = ""
    number = str(number)
    if number[-2:] == "10":
        readable = "Fall " + str(int(number[:4]) - 1)
    elif number[-2:] == "20":
        readable = "Spring " + number[:4]
    else:
        readable = "Summer " + number[:4]
    return readable


def convert_prereqs(prereq_str):
    # If empty, return empty list
    if (len(prereq_str) < 1):
        return []

    # First divide by AND
    if (prereq_str.find(" AND ")):
        prereq_sets = prereq_str.split(" AND ")
    else:
        prereq_sets = [prereq_str]

    all_preqs = []

    for prereq_set in prereq_sets:
        possible_courses = prereq_set.split(" OR ")
        # Strip out "(" or ")"
        new_set = []
        for possible_course in possible_courses:
            new_set.append(possible_course.replace("(", "").replace(")", ""))
        all_preqs.append(new_set)

    return all_preqs


def convert_distribution(distribution_str):
    if (distribution_str == "GRP1"):
        return "Distribution I"
    elif (distribution_str == "GRP2"):
        return "Distribution II"
    elif (distribution_str == "GRP3"):
        return "Distribution III"
    # Sum ting wong
    return ""


def parse_file(file, current_data):
    # file = open(filename, "r").read()
    soup = BeautifulSoup(file.read(), "lxml")
    # print(soup)
    # print(soup.find_all("course"))
    for course in soup.find_all("course"):
        course_invariants = {}
        session_info = {}
        # Sometimes this breaks and we just want to skip those
        if (course.find("term") == None):
            continue
        term = course.find("term")["code"]
        session_info["term"] = term
        # term_readable = convert_term(term)
        # print(term_readable)
        # print(course)
        # Get long title
        course_invariants["long_title"] = course.find("crse_title").text
        # Testing
        times_node = course.find("times")
        # Iterate through times node for meeting times
        class_time_set = False
        class_days = []
        lab_time_set = False
        lab_days = []
        if (times_node):
            for meeting_node in times_node.findChildren():
                # Check that this isn't final exam
                type_node = meeting_node.find("type")
                sched_node = meeting_node.find("sched")
                if (type_node and type_node.get("code") == "CLAS"):
                    if (not class_time_set):
                        session_info["class_start_time"] = meeting_node.get(
                            "begin-time")
                        session_info["class_end_time"] = meeting_node.get(
                            "end-time")
                        # Set days
                        day_nodes = meeting_node.find_all(
                            re.compile("_day"))  # Get all day nodes
                        for day_node in day_nodes:
                            class_days.append(day_node.text)
                        session_info["class_days"] = class_days
                        class_time_set = True
                    else:
                        # Class time already set, this must be the lab
                        session_info["lab_start_time"] = meeting_node.get(
                            "begin-time")
                        session_info["lab_end_time"] = meeting_node.get(
                            "end-time")
                        # Set days
                        day_nodes = meeting_node.find_all(
                            re.compile("_day"))  # Get all day nodes
                        for day_node in day_nodes:
                            lab_days.append(day_node.text)
                        session_info["lab_days"] = lab_days
                        lab_time_set = True
        session_info["crn"] = course.find("crn").text
        session_info["instructors"] = [
            instructor.text for instructor in course.find_all("name")]

        # Additional info to get
        '''
        credit hours (min - max)
        prereqs
            - reqs
            - recommendations
        coreqs
        distribution
        description
        enrollment
        max_enrollment
        waitlisted
        max_waitlisted
        xlist group
        xlist enrollment
        xlist max enrollment
        xlist waitlisted
        xlist max waitlisted
        '''
        # Dist fetch
        dist_node = course.find("dists")
        print(course)
        if (dist_node):
            course_invariants["distribution"] = convert_distribution(
                dist_node.find("dist").get("code"))
        else:
            # Not part of a distribution
            course_invariants["distribution"] = ""

        # Credit fetch
        course_invariants["credits_low"] = course.find("credits").get("low")
        try:
            # some courses have a max # of credits; so a range
            course_invariants["credits_high"] = course.find(
                "credits").get("high")
        except:
            course_invariants["credits_high"] = ""

        # there are level, major, class restrictions
        restrictions_node = course.find("restrictions")
        if (restrictions_node):
            all_sets = []
            restrictions_set = None
            for restriction_node in restrictions_node.findChildren():
                # num 0 is always placeholder; "ind" tells us inclusive or exclusive restriction
                if (restriction_node.get("num") == "0"):
                    # Save old object if it exists (so all times except 1st run)
                    if (restrictions_set != None):
                        all_sets.append(restrictions_set)

                    # Create new restriction object
                    restrictions_set = {
                        "type": restriction_node.get("type"),
                        # I = inclusive, E = exclusive
                        "setting": restriction_node.get("ind"),
                        "params": []
                    }
                else:
                    # We just have to get the text
                    restriction_param = restriction_node.text
                    restrictions_set["params"].append(restriction_param)
            # Add last one to set
            all_sets.append(restrictions_set)
            course_invariants["restrictions"] = all_sets

        # Course restrictions (prereqs, coreqs)
        try:
            # session_info["prereqs"] = convert_prereqs(course.find("preq").text)
            # for now we will just pass the whole string
            course_invariants["prereqs"] = course.find("preq").text
            # Example: (BIOC 301 OR BIOC 341 OR BIOC 344) AND (MATH 102 OR MATH 106)
            # so we need to parse this in a function
        except:
            # Course has no listed prereqs
            course_invariants["prereqs"] = ""

        try:
            coreq_list = []
            coreqs_node = course.find("coreqs")
            for coreq_node in coreqs_node.findChildren():
                # Get subject, course number from coreq
                subj = coreq_node.get("subj")
                numb = coreq_node.get("numb")
                concat = subj + " " + numb
                coreq_list.append(concat)
            course_invariants["coreqs"] = coreq_list
        except:
            course_invariants["coreqs"] = []

        # Mutual exclusions
        me_node = course.find("mutual-exclusions")
        if (me_node):
            mutual_excl_list = []
            # Need this recursive=false to ONLY get child nodes
            for excl_node in me_node.findChildren(recursive=False):
                # Get the subject, course #
                subj = excl_node.find("subject").get("code")
                # Ex: <SUBJECT code="BIOC">Biochemistry &amp; Cell Biology</SUBJECT>
                numb = excl_node.find("crse_numb").text
                # Ex: <CRSE_NUMB>464</CRSE_NUMB>
                concat = str(subj) + " " + str(numb)
                mutual_excl_list.append(concat)
            course_invariants["mutual_exclusives"] = mutual_excl_list
        else:
            course_invariants["mutual_exclusives"] = []

        # Enrollment cap
        session_info["max_enroll"] = course.find("max_enrl").text
        session_info["cur_enroll"] = course.find("enrl").text

        # Waitlist cap
        session_info["max_wait"] = course.find("wait_capacity").text
        session_info["cur_wait"] = course.find("wait_count").text

        # Crosslist caps
        crosslists_node = course.find("xlsts")
        if (crosslists_node):
            crosslists = []
            for xlst_course in crosslists_node.find("xlst").findChildren(recursive=False):
                crn = xlst_course.get("crn")
                crosslists.append(crn)
            session_info["crosslists"] = crosslists

            # Now add xlst enrollments
            session_info["max_cross_enroll"] = course.find(
                "xlst_max_enrl").text
            try:
                session_info["cur_cross_enroll"] = course.find(
                    "xlst_enrl").text
            except:
                # Sometimes there isn't a xlst_enrl, so we just make both blank
                session_info["cur_cross_enroll"] = ""
                session_info["max_cross_enroll"] = ""
        else:
            session_info["crosslists"] = []
            session_info["cur_cross_enroll"] = ""
            session_info["max_cross_enroll"] = ""

        name = course.find("subject")[
            "code"] + " " + course.find("crse_numb").text + " : " + course.find("crse_title").text

        if name not in current_data.keys():
            current_data[name] = {
                "course_details": course_invariants,
                "sessions": []
            }

        # Only need to add another session
        current_data[name]["sessions"].append(session_info)

    return current_data


def aggregate_parsed_files(file_names):
    parsed_data = {}
    for file_name in file_names:
        parsed_data = parse_file(file_name, parsed_data)
    return json.dumps(parsed_data, indent=4)


def main():
    print("start")
    output_dir = "./python_scripts/"
    output_loc = os.path.join(output_dir, "output12.json")
    terms = ["202310"]
    # terms = ["201810", "201820", "201910", "201920", "202010", "202020", "202110"]
    url = "https://courses.rice.edu/courses/!swkscat.cat?format=XML&p_action=COURSE&p_term="
    # url = "https://courses.rice.edu/courses/!SWKSCAT.cat?p_action=QUERY&p_term=202110&format=XML"
    # Initialize file
    with open(output_loc, "w+") as output_file:
        output_file.write("[")

    for term in terms:
        print(term)
        term_url = url + term
        courses = requests.get(term_url)
        print("Made request")
        xml_filename = datetime.date.today()
        with open(output_dir + str(xml_filename) + ".xml", mode="w+") as fp:
            fp.write(courses.text)
            # wait for write
            fp.flush()
            # reset position to start
            fp.seek(0)
        # with tempfile.TemporaryFile(mode='r+') as fp:
        with open(output_dir + str(xml_filename) + ".xml", "r") as fp:
            # print("Writing to tempfile")

            # print("Finishing writing to tempfile")

            current_data = {}
            json_data = parse_file(fp, current_data)

            # Dump to JSON
    #         with open(output_loc, "a+") as output_file:
    #             json.dump(json_data, output_file)
    #             # output_file.write(",\n")
    #             # print("finishied writing this term")

    # with open(output_loc, "a+") as output_file:
    #     output_file.write("]")

    # XML is destroyed

    # with open("courses.xml", 'w') as file:
    #     file.write(courses.text)

    # Use temporary file to create JSON file
    # current_data = {}
    # json_data = parse_file(temp.name, current_data)

    # Remove temp XML file
    # temp.close()

    # json_data = aggregate_parsed_files(["./data/Fall2018.xml", "./data/Fall2019.xml", "./data/Spring2019.xml", "./data/Spring2020.xml"])


if __name__ == '__main__':
    main()
