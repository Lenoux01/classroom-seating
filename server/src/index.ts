
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import all schemas
import {
  createClassroomInputSchema,
  updateClassroomInputSchema,
  createStudentInputSchema,
  createClassroomObjectInputSchema,
  updateClassroomObjectInputSchema,
  createStudentAssignmentInputSchema,
  randomizeAssignmentsInputSchema,
  createLayoutTemplateInputSchema,
  loadLayoutTemplateInputSchema
} from './schema';

// Import all handlers
import { createClassroom } from './handlers/create_classroom';
import { getClassrooms } from './handlers/get_classrooms';
import { getClassroomById } from './handlers/get_classroom_by_id';
import { updateClassroom } from './handlers/update_classroom';
import { deleteClassroom } from './handlers/delete_classroom';
import { createStudent } from './handlers/create_student';
import { getStudentsByClassroom } from './handlers/get_students_by_classroom';
import { deleteStudent } from './handlers/delete_student';
import { createClassroomObject } from './handlers/create_classroom_object';
import { getClassroomObjects } from './handlers/get_classroom_objects';
import { updateClassroomObject } from './handlers/update_classroom_object';
import { deleteClassroomObject } from './handlers/delete_classroom_object';
import { createStudentAssignment } from './handlers/create_student_assignment';
import { getStudentAssignments } from './handlers/get_student_assignments';
import { deleteStudentAssignment } from './handlers/delete_student_assignment';
import { randomizeStudentAssignments } from './handlers/randomize_student_assignments';
import { createLayoutTemplate } from './handlers/create_layout_template';
import { getLayoutTemplates } from './handlers/get_layout_templates';
import { loadLayoutTemplate } from './handlers/load_layout_template';
import { getClassroomWithDetails } from './handlers/get_classroom_with_details';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Classroom routes
  createClassroom: publicProcedure
    .input(createClassroomInputSchema)
    .mutation(({ input }) => createClassroom(input)),
  
  getClassrooms: publicProcedure
    .query(() => getClassrooms()),
  
  getClassroomById: publicProcedure
    .input(z.number())
    .query(({ input }) => getClassroomById(input)),
  
  updateClassroom: publicProcedure
    .input(updateClassroomInputSchema)
    .mutation(({ input }) => updateClassroom(input)),
  
  deleteClassroom: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteClassroom(input)),

  getClassroomWithDetails: publicProcedure
    .input(z.number())
    .query(({ input }) => getClassroomWithDetails(input)),

  // Student routes
  createStudent: publicProcedure
    .input(createStudentInputSchema)
    .mutation(({ input }) => createStudent(input)),
  
  getStudentsByClassroom: publicProcedure
    .input(z.number())
    .query(({ input }) => getStudentsByClassroom(input)),
  
  deleteStudent: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteStudent(input)),

  // Classroom object routes
  createClassroomObject: publicProcedure
    .input(createClassroomObjectInputSchema)
    .mutation(({ input }) => createClassroomObject(input)),
  
  getClassroomObjects: publicProcedure
    .input(z.number())
    .query(({ input }) => getClassroomObjects(input)),
  
  updateClassroomObject: publicProcedure
    .input(updateClassroomObjectInputSchema)
    .mutation(({ input }) => updateClassroomObject(input)),
  
  deleteClassroomObject: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteClassroomObject(input)),

  // Student assignment routes
  createStudentAssignment: publicProcedure
    .input(createStudentAssignmentInputSchema)
    .mutation(({ input }) => createStudentAssignment(input)),
  
  getStudentAssignments: publicProcedure
    .input(z.number())
    .query(({ input }) => getStudentAssignments(input)),
  
  deleteStudentAssignment: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteStudentAssignment(input)),

  randomizeStudentAssignments: publicProcedure
    .input(randomizeAssignmentsInputSchema)
    .mutation(({ input }) => randomizeStudentAssignments(input)),

  // Layout template routes
  createLayoutTemplate: publicProcedure
    .input(createLayoutTemplateInputSchema)
    .mutation(({ input }) => createLayoutTemplate(input)),
  
  getLayoutTemplates: publicProcedure
    .query(() => getLayoutTemplates()),
  
  loadLayoutTemplate: publicProcedure
    .input(loadLayoutTemplateInputSchema)
    .mutation(({ input }) => loadLayoutTemplate(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
