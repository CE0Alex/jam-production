export type UserRole = "sales" | "production" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  capacity?: number; // Daily capacity in minutes (default 480 - 8 hours)
}
