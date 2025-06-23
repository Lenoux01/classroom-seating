
import { z } from 'zod';

// Enums for object types and layout types
export const classroomObjectTypeSchema = z.enum(['desk', 'whiteboard', 'teacher_desk', 'bookshelf', 'cabinet']);
export type ClassroomObjectType = z.infer<typeof classroomObjectTypeSchema>;

export const layoutTypeSchema = z.enum(['u_shape', 'grouped', 'rows', 'circle', 'custom']);
export type LayoutType = z.infer<typeof layoutTypeSchema>;

// Position schema for canvas coordinates
export const positionSchema = z.object({
  x: z.number(),
  y: z.number()
});
export type Position = z.infer<typeof positionSchema>;

// Size schema for object dimensions
export const sizeSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive()
});
export type Size = z.infer<typeof sizeSchema>;

// Student schema
export const studentSchema = z.object({
  id: z.number(),
  name: z.string(),
  classroom_id: z.number(),
  created_at: z.coerce.date()
});
export type Student = z.infer<typeof studentSchema>;

// Classroom schema
export const classroomSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  layout_type: layoutTypeSchema,
  canvas_width: z.number().positive(),
  canvas_height: z.number().positive(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});
export type Classroom = z.infer<typeof classroomSchema>;

// Classroom object schema
export const classroomObjectSchema = z.object({
  id: z.number(),
  classroom_id: z.number(),
  type: classroomObjectTypeSchema,
  position_x: z.number(),
  position_y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  rotation: z.number().default(0), // in degrees
  label: z.string().nullable(),
  created_at: z.coerce.date()
});
export type ClassroomObject = z.infer<typeof classroomObjectSchema>;

// Student assignment schema (linking students to desks)
export const studentAssignmentSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  desk_id: z.number(), // references classroom_objects where type = 'desk'
  assigned_at: z.coerce.date()
});
export type StudentAssignment = z.infer<typeof studentAssignmentSchema>;

// Layout template schema for predefined layouts
export const layoutTemplateSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  layout_type: layoutTypeSchema,
  template_data: z.string(), // JSON string of object positions and types
  created_at: z.coerce.date()
});
export type LayoutTemplate = z.infer<typeof layoutTemplateSchema>;

// Input schemas for creating records
export const createStudentInputSchema = z.object({
  name: z.string().min(1),
  classroom_id: z.number()
});
export type CreateStudentInput = z.infer<typeof createStudentInputSchema>;

export const createClassroomInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  layout_type: layoutTypeSchema,
  canvas_width: z.number().positive(),
  canvas_height: z.number().positive()
});
export type CreateClassroomInput = z.infer<typeof createClassroomInputSchema>;

export const createClassroomObjectInputSchema = z.object({
  classroom_id: z.number(),
  type: classroomObjectTypeSchema,
  position_x: z.number(),
  position_y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  rotation: z.number().optional(),
  label: z.string().nullable().optional()
});
export type CreateClassroomObjectInput = z.infer<typeof createClassroomObjectInputSchema>;

export const createStudentAssignmentInputSchema = z.object({
  student_id: z.number(),
  desk_id: z.number()
});
export type CreateStudentAssignmentInput = z.infer<typeof createStudentAssignmentInputSchema>;

export const createLayoutTemplateInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  layout_type: layoutTypeSchema,
  template_data: z.string()
});
export type CreateLayoutTemplateInput = z.infer<typeof createLayoutTemplateInputSchema>;

// Update schemas
export const updateClassroomObjectInputSchema = z.object({
  id: z.number(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  rotation: z.number().optional(),
  label: z.string().nullable().optional()
});
export type UpdateClassroomObjectInput = z.infer<typeof updateClassroomObjectInputSchema>;

export const updateClassroomInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  layout_type: layoutTypeSchema.optional(),
  canvas_width: z.number().positive().optional(),
  canvas_height: z.number().positive().optional()
});
export type UpdateClassroomInput = z.infer<typeof updateClassroomInputSchema>;

// Randomize assignments input
export const randomizeAssignmentsInputSchema = z.object({
  classroom_id: z.number()
});
export type RandomizeAssignmentsInput = z.infer<typeof randomizeAssignmentsInputSchema>;

// Load layout template input
export const loadLayoutTemplateInputSchema = z.object({
  classroom_id: z.number(),
  template_id: z.number()
});
export type LoadLayoutTemplateInput = z.infer<typeof loadLayoutTemplateInputSchema>;
