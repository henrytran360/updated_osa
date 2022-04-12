//RUNNING THIS SCRIPT WILL CHANGE THE DATA IN MONGODB! DONT RUN IF YOU ARE NOT SURE

const { MongoClient, ObjectId } = require("mongodb");
async function main() {
    const uri =
        "mongodb+srv://tigerking:wphPpplcHRwNdv29@riceapps2020-21-ppsrv.gcp.mongodb.net/hatch_staging?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        //DO NOT RUN THESE FILES
        // await listDatabases(client);
        // await testCollection(client);
        // await addCourseName(client);
        await addCourseSemesterValue(client);
        // await updateName(client);
        // await addDefaultDegreePlanForAll(client);
        //await dropDegreePlanParentCollection(client);
        // await addCourseNameEvals(client);
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}
main().catch(console.error);

async function listDatabases(client) {
    const databaseList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databaseList.databases.forEach((db) => console.log(db.name));
}

async function testDocument(client, name) {
    const res = await client
        .db("hatch_staging")
        .collection("course_evaluations_new")
        .findOne({ name: name });
    console.log(res);
}

async function testCollection(client) {
    const cursor = await client
        .db("hatch_staging")
        .collection("course_evaluations_new")
        .find();
    const res = await cursor.toArray();
    console.log(res);
}

async function updateName(client) {
    await client
        .db("hatch_prod")
        .collection("course_evaluations_new")
        .find()
        .snapshot()
        .forEach(function (elem) {
            client
                .db("hatch_prod")
                .collection("course_evaluations_new")
                .updateMany(
                    { _id: elem._id },
                    {
                        $rename: {
                            "organization.1": "organization.score_1",
                            "organization.2": "organization.score_2",
                            "organization.3": "organization.score_3",
                            "organization.4": "organization.score_4",
                            "organization.5": "organization.score_5",

                            "assignments.1": "assignments.score_1",
                            "assignments.2": "assignments.score_2",
                            "assignments.3": "assignments.score_3",
                            "assignments.4": "assignments.score_4",
                            "assignments.5": "assignments.score_5",

                            "overall.1": "overall.score_1",
                            "overall.2": "overall.score_2",
                            "overall.3": "overall.score_3",
                            "overall.4": "overall.score_4",
                            "overall.5": "overall.score_5",

                            "challenge.1": "challenge.score_1",
                            "challenge.2": "challenge.score_2",
                            "challenge.3": "challenge.score_3",
                            "challenge.4": "challenge.score_4",
                            "challenge.5": "challenge.score_5",

                            "workload.1": "workload.score_1",
                            "workload.2": "workload.score_2",
                            "workload.3": "workload.score_3",
                            "workload.4": "workload.score_4",
                            "workload.5": "workload.score_5",

                            "why_taking.1": "why_taking.score_1",
                            "why_taking.2": "why_taking.score_2",
                            "why_taking.3": "why_taking.score_3",
                            "why_taking.4": "why_taking.score_4",
                            "why_taking.5": "why_taking.score_5",

                            "expected_grade.1": "expected_grade.score_1",
                            "expected_grade.2": "expected_grade.score_2",
                            "expected_grade.3": "expected_grade.score_3",
                            "expected_grade.4": "expected_grade.score_4",
                            "expected_grade.5": "expected_grade.score_5",

                            "expected_pf.1": "expected_pf.score_1",
                            "expected_pf.2": "expected_pf.score_2",
                            "expected_pf.3": "expected_pf.score_3",
                            "expected_pf.4": "expected_pf.score_4",
                            "expected_pf.5": "expected_pf.score_5",
                        },
                    },
                    false,
                    true
                );
        });
}

async function addCourseName(client) {
    await client
        .db("hatch_staging")
        .collection("courses")
        .find()
        .snapshot()
        .forEach(function (elem) {
            let a = elem.longTitle;
            let b = elem.subject;
            let c = elem.courseNum.toString();
            let fullName = b + " " + c + " " + a;
            client
                .db("hatch_staging")
                .collection("sessions")
                .updateOne(
                    {
                        course: elem._id,
                    },
                    {
                        $set: {
                            fullCourseName: fullName
                                .replace(/\s+/g, "")
                                .toLowerCase(),
                        },
                    }
                );
        });
}

async function addCourseNameEvals(client) {
    await client
        .db("hatch_staging")
        .collection("course_evaluations_new")
        .find()
        .snapshot()
        .forEach(function (elem) {
            let a = elem.name;
            let b = a.split(" ");
            let courseName = b[0] + " " + b[1];
            client
                .db("hatch_staging")
                .collection("course_evaluations_new")
                .updateMany(
                    {
                        _id: elem._id,
                    },
                    {
                        $set: {
                            courseName: courseName,
                        },
                    }
                );
        });
}

async function addCourseSemesterValue(client) {
    await client
        .db("hatch_prod")
        .collection("course_evaluations_new")
        .find()
        .snapshot()
        .forEach(function (elem) {
            let a = elem.term.split(" ");
            let value;
            if (a[0] == "Fall") {
                value = parseInt(a[2] * 100 + 20);
            } else {
                value = parseInt(a[2] * 100 + 10);
            }
            client
                .db("hatch_prod")
                .collection("course_evaluations_new")
                .updateMany(
                    {
                        term: "Fall Semester 2021",
                    },
                    {
                        $set: {
                            termValue: 202120,
                        },
                    }
                );
        });
}

async function addDefaultDegreePlanForAll(client) {
    await client
        .db("hatch_prod")
        .collection("users")
        .find()
        .snapshot()
        .forEach(function (user) {
            let userId = user._id;
            client
                .db("hatch_prod")
                .collection("degreeplanparents")
                .insertOne({
                    name: "Default Plan",
                    user: ObjectId(userId),
                });
        });
}

async function dropDegreePlanParentCollection(client) {
    await client
        .db("hatch_staging")
        .collection("degreeplanparents")
        .deleteMany({});
}
// let mongoose = require("mongoose");
// let { MONGODB_CONNECTION_STRING } = require("./config");

// const url = MONGODB_CONNECTION_STRING;
// // "mongodb+srv://ultrascheduler:kAtwdqi3Ehd)H@cluster0-fy2jk.mongodb.net/ultrascheduler?retryWrites=true&w=majority";

// mongoose.connect(url);
// let db;
// mongoose.connection.on("connected", async function () {
//     db = mongoose.connection.db;
//     console.log("Mongoose connected to " + url);
// });
