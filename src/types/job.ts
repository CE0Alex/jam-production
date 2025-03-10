import { JobType } from "./product";

export type JobStatus =
  | "Not Started"
  | "Pending"
  | "In Production"
  | "Completed"
  | "Delivered";
export type JobPriority = "Low" | "Medium" | "High";

export interface JobProduct {
  productType: string;
  quantity: number;
  productionTime: number; // in minutes
  setupTime?: number; // in minutes
  finishingTime?: number; // in minutes
}

export interface Job {
  id: string;
  title: string;
  customer: string;
  description?: string;
  jobType: JobType;
  productType: string;
  products?: JobProduct[];
  quantity: number;
  dueDate: Date;
  status: JobStatus;
  priority: JobPriority;
  estimatedTime: number; // total time in minutes
  setupTime?: number; // in minutes
  productionTime?: number; // in minutes
  finishingTime?: number; // in minutes
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
