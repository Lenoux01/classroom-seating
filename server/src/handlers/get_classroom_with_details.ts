
import { type Classroom, type Student, type ClassroomObject, type StudentAssignment } from '../schema';

export interface ClassroomWithDetails {
  classroom: Classroom;
  students: Student[];
  objects: ClassroomObject[];
  assignments: StudentAssignment[];
}

export declare function getClassroomWithDetails(classroomId: number): Promise<ClassroomWithDetails | null>;
