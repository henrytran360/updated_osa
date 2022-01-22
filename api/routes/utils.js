const Course = require("../models/CourseModel").Course;
const Instructor = require("../models/InstructorModel").Instructor;
const Session = require("../models/SessionModel").Session;

var BIGJSON = require("../python_scripts/output10.json");

const splitCourseCode = (courseCode) => {
    let courseArr = courseCode.split(" ");
    let subject = courseArr[0];
    let courseNum = courseArr[1];
    return { subject, courseNum };
};

var jsonToSchema = async (jsonObj) => {
    // https://stackoverflow.com/questions/40102372/find-one-or-create-with-mongoose

    console.time("json");
    process.send("Started task!");
    // Iterate through each course code in the json
    let sessionBulkUpdates = [];
    for (let fullCourseName in jsonObj) {
        // create course object for this key
        // inside each course code, we want to extract each term
        // Split course code
        let [courseCode, longTitle] = fullCourseName.split(" : ");
        let { subject, courseNum } = splitCourseCode(courseCode);

        let courseFilter = {
            subject: subject,
            courseNum: courseNum,
            longTitle: longTitle,
        };

        // Get course details
        let courseDetails = jsonObj[fullCourseName]["course_details"];

        // // Find corresponding coreqs
        // let coreqRefs = [];
        // for (let coreqCode of firstSession["coreqs"]) {
        //     // Split into subject, coursenum
        //     let { coreqSubj, coreqNum } = coreqCode.split(" ");
        //     let coreqCourse = await Course.findOne({ subject: coreqSubj, courseNum: coreqNum });
        //     coreqRefs.push(coreqCourse._id);
        // }

        // Create update object
        let courseSingleUpdate = {
            // Honestly add the name here too
            "description": courseDetails["crs_text"],
            "creditsMin": courseDetails["credits_low"],
            "creditsMax": courseDetails["credits_high"],
            "restrictions": courseDetails["restrictions"],
            "prereqs": courseDetails["prereqs"],
            "coreqs": courseDetails["coreqs"],
            "mutualExclusions": courseDetails["mutual_exclusives"],
            "distribution": courseDetails["distribution"]
        }

        // Update course object
        let courseUpdateOptions = {
            upsert: true,
            new: true,
            useFindAndModify: false,
        };
        let courseObject = await Course.findOneAndUpdate(
            courseFilter,
            courseSingleUpdate,
            courseUpdateOptions
        );

        for (let session of jsonObj[fullCourseName]["sessions"]) {
            // 1: we want to find the instructors associated with this session - so we will check our Mongo collection for them and if they are not there, we will create them
            let instructorRefs = [];
            for (let instructor of session.instructors) {
                let nameArr = instructor.split(", ");
                let lastName = nameArr[0];
                let firstName = nameArr[1];
                let foundInstructor = await Instructor.findOne({
                    firstName: firstName,
                    lastName: lastName,
                });
                let ref;
                if (foundInstructor) {
                    // Instructor exists! Get their ref
                    ref = foundInstructor._id;
                } else {
                    // Create instructor & get their ID
                    foundInstructor = await Instructor.create({
                        firstName: firstName,
                        lastName: lastName,
                    });
                    ref = foundInstructor._id;
                }
                instructorRefs.push(ref);
            }
            // 2: Create session object to be added to this particular course object
            let classObject = {};
            let labObject = {};

            // Create class object
            if (session["class_days"] && session["class_days"].length > 0) {
                classObject = {
                    startTime: session["class_start_time"],
                    endTime: session["class_end_time"],
                    days: session["class_days"],
                };
            }

            // Create lab object
            if (session["lab_days"] && session["lab_days"].length > 0) {
                labObject = {
                    startTime: session["lab_start_time"],
                    endTime: session["lab_end_time"],
                    days: session["lab_days"],
                };
            }

            // TODO: Create crosslisted
            // let crosslistCourses = [];
            // for (let crosslistCourseCRN of session["crosslists"]) {
            //     // Find corresponding course
            //     let crosslistSession = await Session.findOne({ crn: crosslistCourseCRN, term: session.term });
            //     let crosslistCourseID = crosslistSession.course;
            //     crosslistCourses.push(crosslistCourseID);
            // }

            // Create update document
            let sessionSingleUpdate = {
                crn: session.crn,
                term: session.term,
                course: courseObject._id,
                class: classObject,
                lab: labObject,
                crosslistCourses: [],
                // "crosslistCourses": crosslistCourses,
                instructors: instructorRefs,
                enrollment: session["cur_enroll"],
                maxEnrollment: session["max_enroll"],
                waitlisted: session["cur_wait"],
                maxWaitlisted: session["max_wait"],
                crossEnrollment: session["cur_cross_enroll"],
                maxCrossEnrollment: session["max_cross_enroll"],
                instructionMethod: session["instructional_method"],
            };

            // TODO: confirm these are the invariants
            let filter = { crn: session.crn, term: session.term };

            // Create updator document
            let sessionUpdator = {
                updateOne: {
                    filter: filter,
                    update: sessionSingleUpdate,
                    upsert: true, // create new session if crn doesn't exist
                },
            };

            // Add update to bulk update
            sessionBulkUpdates.push(sessionUpdator);

            if (sessionBulkUpdates.length > 100) {
                let copy = sessionBulkUpdates.slice();
                await Session.bulkWrite(copy, (err, res) => {
                    process.send("Num attempted: " + copy.length);
                    process.send("Num finished: " + res.matchedCount);
                });

                // Reset
                sessionBulkUpdates = [];
            }
        }
    }

    // Wait for the last one to finish

    // Finish saving prior to completion
    let sessionCopy = sessionBulkUpdates.slice();
    process.send(sessionCopy.length);
    Session.bulkWrite(sessionCopy, (err, res) => {
        process.send("Num attempted: " + sessionCopy.length);
        process.send("Num finished: " + res.matchedCount);
        console.timeEnd("json");
    });

    // Stop
    return;
};

jsonToSchema(BIGJSON[0]);
