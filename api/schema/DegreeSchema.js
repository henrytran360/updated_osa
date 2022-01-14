// import { Course, CourseTC, Session, SessionTC, 
//          Instructor, InstructorTC, User, UserTC,
//          Schedule, ScheduleTC, DegreeTC } from "../models";

// DegreeTC.addRelation("course", {
//     resolver: () => CourseTC.getResolver("findById"),
//     prepareArgs: {
//         _id: (source) => source.course,
//     },
//     projection: { course: 1 },
// });

// DegreeTC.addRelation("user", {
//     resolver: () => UserTC.getResolver("findById"),
//     prepareArgs: {
//         _id: (source) => source.user,
//     },
//     projection: { user: 1 },
// });

// DegreeTC.addRelation("instructor", {
//     resolver: () => InstructorTC.getResolver("findById"),
//     prepareArgs: {
//         _id: (source) => source.instructor,
//     },
//     projection: { instructor: 1 },
// });

// DegreeTC.addResolver({
//     name: "openScheduleOrBlank???",  // If the user doesn't have a schedule yet, what do I do?
//     type: ScheduleTC,
//     args: ScheduleTC.getResolver("_____").getArgs(),
//     resolve: async ({ source, args, context, info }) => {
//         let { __, ___, ___ } = args.filter;
//     },
// });