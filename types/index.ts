export type UserRole = "STUDENT" | "TEACHER";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface ClassItem {
  id: string;
  class_name: string; // Synced with DB column
  description?: string;
  join_code: string;
  teacher_id: string;
  is_active: boolean;
  created_at: string;
  member_count?: number;
  exam_count?: number;
}

export interface Exam {
  id: string;
  class_id: string;
  title: string;
  description?: string;
  total_marks: number;
  due_date?: string;
  is_published: boolean;
  created_at: string;
}