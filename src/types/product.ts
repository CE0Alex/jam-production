export type JobType =
  | "Digital Printing"
  | "Wide Format"
  | "Screen Printing"
  | "DTF"
  | "Embroidery";

export interface Product {
  id: string;
  name: string;
  jobType: JobType;
  description?: string;
  productionTime: number; // in minutes
  setupTime?: number; // additional setup time in minutes
  finishingTime?: number; // additional finishing time in minutes
  notes?: string;
}
