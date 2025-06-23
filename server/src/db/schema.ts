
import { serial, text, pgTable, timestamp, integer, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const classroomObjectTypeEnum = pgEnum('classroom_object_type', ['desk', 'whiteboard', 'teacher_desk', 'bookshelf', 'cabinet']);
export const layoutTypeEnum = pgEnum('layout_type', ['u_shape', 'grouped', 'rows', 'circle', 'custom']);

// Classrooms table
export const classroomsTable = pgTable('classrooms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  layout_type: layoutTypeEnum('layout_type').notNull(),
  canvas_width: numeric('canvas_width', { precision: 10, scale: 2 }).notNull(),
  canvas_height: numeric('canvas_height', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Students table
export const studentsTable = pgTable('students', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  classroom_id: integer('classroom_id').notNull().references(() => classroomsTable.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Classroom objects table (desks, whiteboards, etc.)
export const classroomObjectsTable = pgTable('classroom_objects', {
  id: serial('id').primaryKey(),
  classroom_id: integer('classroom_id').notNull().references(() => classroomsTable.id, { onDelete: 'cascade' }),
  type: classroomObjectTypeEnum('type').notNull(),
  position_x: numeric('position_x', { precision: 10, scale: 2 }).notNull(),
  position_y: numeric('position_y', { precision: 10, scale: 2 }).notNull(),
  width: numeric('width', { precision: 10, scale: 2 }).notNull(),
  height: numeric('height', { precision: 10, scale: 2 }).notNull(),
  rotation: numeric('rotation', { precision: 5, scale: 2 }).notNull().default('0'),
  label: text('label'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Student assignments table (linking students to desks)
export const studentAssignmentsTable = pgTable('student_assignments', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull().references(() => studentsTable.id, { onDelete: 'cascade' }),
  desk_id: integer('desk_id').notNull().references(() => classroomObjectsTable.id, { onDelete: 'cascade' }),
  assigned_at: timestamp('assigned_at').defaultNow().notNull(),
});

// Layout templates table for predefined layouts
export const layoutTemplatesTable = pgTable('layout_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  layout_type: layoutTypeEnum('layout_type').notNull(),
  template_data: text('template_data').notNull(), // JSON string
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const classroomsRelations = relations(classroomsTable, ({ many }) => ({
  students: many(studentsTable),
  objects: many(classroomObjectsTable),
}));

export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
  classroom: one(classroomsTable, {
    fields: [studentsTable.classroom_id],
    references: [classroomsTable.id],
  }),
  assignments: many(studentAssignmentsTable),
}));

export const classroomObjectsRelations = relations(classroomObjectsTable, ({ one, many }) => ({
  classroom: one(classroomsTable, {
    fields: [classroomObjectsTable.classroom_id],
    references: [classroomsTable.id],
  }),
  studentAssignments: many(studentAssignmentsTable),
}));

export const studentAssignmentsRelations = relations(studentAssignmentsTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [studentAssignmentsTable.student_id],
    references: [studentsTable.id],
  }),
  desk: one(classroomObjectsTable, {
    fields: [studentAssignmentsTable.desk_id],
    references: [classroomObjectsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Classroom = typeof classroomsTable.$inferSelect;
export type NewClassroom = typeof classroomsTable.$inferInsert;
export type Student = typeof studentsTable.$inferSelect;
export type NewStudent = typeof studentsTable.$inferInsert;
export type ClassroomObject = typeof classroomObjectsTable.$inferSelect;
export type NewClassroomObject = typeof classroomObjectsTable.$inferInsert;
export type StudentAssignment = typeof studentAssignmentsTable.$inferSelect;
export type NewStudentAssignment = typeof studentAssignmentsTable.$inferInsert;
export type LayoutTemplate = typeof layoutTemplatesTable.$inferSelect;
export type NewLayoutTemplate = typeof layoutTemplatesTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  classrooms: classroomsTable,
  students: studentsTable,
  classroomObjects: classroomObjectsTable,
  studentAssignments: studentAssignmentsTable,
  layoutTemplates: layoutTemplatesTable,
};
