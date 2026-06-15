export type UserRole = "STUDENT" | "TEACHER";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface ClassItem {
  id: string;
  name: string;
  description?: string;
  join_code: string;
  teacher_id: string;
  created_at: string;
  teacher_name?: string;
  _count?: {
    class_members: number;
    exams: number;
  };
}

export interface Exam {
  id: string;
  class_id: string;
  title: string;
  description?: string;
  is_published: boolean;
  created_at: string;
}