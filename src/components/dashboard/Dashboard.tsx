import { useState, useEffect } from "react";
import EditJobDialog from "@/components/jobs/EditJobDialog";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  CalendarIcon,
  ClipboardList,
  Settings,
  Plus,
  Users,
  Package,
  Info,
  Clock,
  Calendar as CalendarIcon2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ProductionCalendar from "@/components/calendar/ProductionCalendar";

type UserRole = "sales" | "production" | "admin";

interface DashboardProps {
  userRole?: UserRole;
}

interface JobEvent {
  id: string;
  title: string;
  customer: string;
  time: string;
  status: string;
  priority: string;
  description?: string;
  productType?: string;
  quantity?: number;
  estimatedHours?: number;
  assignedTo?: string;
  createdBy?: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  hoursAssigned: number;
  hoursCapacity: number;
  jobsAssigned: number;
}

export default function Dashboard({
  userRole: initialUserRole = "sales",
}: DashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [userRole, setUserRole] = useState<UserRole>(initialUserRole);
  const [calendarView, setCalendarView] = useState("day");
  const [selectedJob, setSelectedJob] = useState<JobEvent | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Calculate production hours data based on actual jobs
  const calculateProductionData = () => {
    const totalHoursCapacity = 160; // 4 staff × 40 hours

    // Calculate scheduled hours from actual jobs
    const scheduledHours = jobEvents.reduce((total, job) => {
      return total + (job.estimatedHours || 0);
    }, 0);

    const remainingHours = Math.max(0, totalHoursCapacity - scheduledHours);
    const utilizationPercentage = Math.min(
      100,
      (scheduledHours / totalHoursCapacity) * 100,
    );

    return {
      totalHoursCapacity,
      scheduledHours,
      remainingHours,
      utilizationPercentage,
    };
  };

  const {
    totalHoursCapacity,
    scheduledHours,
    remainingHours,
    utilizationPercentage,
  } = calculateProductionData();

  // Staff data with production hours
  const staffMembers: StaffMember[] = [
    {
      id: "1",
      name: "Isaac Johnson",
      role: "Production Manager",
      department: "Production",
      hoursAssigned: 32,
      hoursCapacity: 40,
      jobsAssigned: 8,
    },
    {
      id: "2",
      name: "Aaron Smith",
      role: "Production Specialist",
      department: "Production",
      hoursAssigned: 36,
      hoursCapacity: 40,
      jobsAssigned: 6,
    },
  ];

  // Sales staff data
  const salesStaff = [
    {
      id: "3",
      name: "Mike Wilson",
      role: "Sales Manager",
      department: "Sales",
      jobsCreated: 12,
      hoursScheduled: 48,
    },
    {
      id: "4",
      name: "Jordan Davis",
      role: "Account Executive",
      department: "Sales",
      jobsCreated: 8,
      hoursScheduled: 32,
    },
  ];

  // Load jobs from localStorage
  const [jobEvents, setJobEvents] = useState<JobEvent[]>([]);

  // Load jobs from localStorage when component mounts or when localStorage changes
  useEffect(() => {
    const loadJobs = () => {
      try {
        const storedJobs = localStorage.getItem("jobs");
        if (storedJobs) {
          const parsedJobs = JSON.parse(storedJobs);
          // Convert to JobEvent format
          const formattedJobs = parsedJobs.map((job: any) => ({
            id: job.id,
            title: job.title || "Untitled Job",
            customer: job.customer || "Unknown Customer",
            time: job.scheduledTime || "09:00",
            status: job.status || "Not Started",
            priority: job.priority || "Medium",
            description: job.description,
            productType: job.productType,
            quantity: job.quantity,
            estimatedHours: job.estimatedTime ? job.estimatedTime / 60 : 1,
            assignedTo: job.assignedTo || "Unassigned",
            dueDate: job.dueDate,
          }));
          setJobEvents(formattedJobs);
        }
      } catch (error) {
        console.error("Error loading jobs:", error);
      }
    };

    // Load jobs initially
    loadJobs();

    // Set up storage event listener to refresh data when localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "jobs") {
        loadJobs();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Weekly calendar data
  const weeklyCalendarData = [
    // Monday
    [],
    // Tuesday
    [],
    // Wednesday
    [],
    // Thursday
    [],
    // Friday
    [],
    // Saturday
    [],
    // Sunday
    [],
  ];

  const handleJobClick = (job: JobEvent) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleAddNewJob = () => {
    navigate("/jobs/new");
  };

  // Check if we should focus on the calendar (coming from job creation)
  useEffect(() => {
    if (location.state?.showCalendar) {
      // Focus on the calendar view
      setCalendarView("day");

      // If there's a new job ID, we could highlight it or show a message
      if (location.state.newJobId) {
        // Show a message to the user
        alert(
          "Your job has been created! Now you can schedule it by dragging it to a time slot in the calendar.",
        );
      }

      // Clear the location state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="bg-background">
      {/* Main content */}
      <div className="p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, here's an overview of your production schedule.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="view-mode"
                checked={userRole === "production"}
                onCheckedChange={(checked) =>
                  setUserRole(checked ? "production" : "sales")
                }
              />
              <Label htmlFor="view-mode" className="font-medium">
                {userRole === "sales" ? "Sales View" : "Production View"}
              </Label>
            </div>
            <Button onClick={handleAddNewJob}>
              <Plus className="mr-2 h-4 w-4" /> Add New Job
            </Button>
          </div>
        </div>

        {/* Production Hours Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Production Hours</CardTitle>
            <CardDescription>
              Weekly production capacity and allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Weekly Capacity</span>
                  <span className="text-sm font-medium">
                    {scheduledHours}/{totalHoursCapacity} hours
                  </span>
                </div>
                <Progress value={utilizationPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Scheduled: {scheduledHours} hours</span>
                  <span>Available: {remainingHours} hours</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">Hours by Day</h3>
                <div className="grid grid-cols-7 gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs font-medium">{day}</div>
                      <div
                        className={cn(
                          "h-10 rounded-md flex items-center justify-center text-xs font-medium",
                          i < 5
                            ? "bg-blue-100 text-blue-800"
                            : i === 5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800",
                        )}
                      >
                        {i < 5 ? "20h" : i === 5 ? "8h" : "0h"}
                      </div>
                      <div className="text-xs mt-1">
                        {i < 5 ? "25h" : i === 5 ? "10h" : "0h"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Production Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Jobs</span>
                    <span className="font-medium">{jobEvents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">In Production</span>
                    <span className="font-medium">
                      {
                        jobEvents.filter(
                          (job) => job.status === "In Production",
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending</span>
                    <span className="font-medium">
                      {
                        jobEvents.filter((job) => job.status === "Pending")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed</span>
                    <span className="font-medium">
                      {
                        jobEvents.filter((job) => job.status === "Completed")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Production Calendar</CardTitle>
              <CardDescription>
                {userRole === "sales"
                  ? "View customer jobs and delivery schedules"
                  : "View production schedule and staff assignments"}
              </CardDescription>
            </div>
            <Tabs
              value={calendarView}
              onValueChange={setCalendarView}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {/* Using the new ProductionCalendar component */}
            <ProductionCalendar
              calendarView={calendarView as "day" | "week" | "month"}
              date={date || new Date()}
            />
          </CardContent>
        </Card>

        {/* Staff Allocation */}
        <div className="grid gap-8 md:grid-cols-2 mb-8">
          {/* Production Staff */}
          <Card>
            <CardHeader>
              <CardTitle>Production Staff Allocation</CardTitle>
              <CardDescription>Staff workload and capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {staffMembers.map((staff) => (
                  <div key={staff.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {staff.role}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">
                          {staff.jobsAssigned}
                        </span>{" "}
                        jobs
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Hours Assigned</span>
                        <span>
                          {staff.hoursAssigned}/{staff.hoursCapacity}h
                        </span>
                      </div>
                      <Progress
                        value={
                          (staff.hoursAssigned / staff.hoursCapacity) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Staff */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Staff Activity</CardTitle>
              <CardDescription>
                Jobs created and hours scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {salesStaff.map((staff) => (
                  <div key={staff.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {staff.role}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="font-medium">
                            {staff.jobsCreated}
                          </span>
                          <span className="text-muted-foreground"> jobs</span>
                        </div>
                        <div>
                          <span className="font-medium">
                            {staff.hoursScheduled}
                          </span>
                          <span className="text-muted-foreground"> hours</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Production Hours Scheduled</span>
                        <span>{staff.hoursScheduled}h</span>
                      </div>
                      <Progress
                        value={(staff.hoursScheduled / 50) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Jobs</CardTitle>
            <CardDescription>Jobs due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobEvents
                .filter((job) => {
                  // Filter for jobs with due dates in the next 7 days
                  if (!job.dueDate) return false;
                  const dueDate = new Date(job.dueDate);
                  const today = new Date();
                  const nextWeek = new Date();
                  nextWeek.setDate(today.getDate() + 7);
                  return dueDate >= today && dueDate <= nextWeek;
                })
                .sort((a, b) => {
                  // Sort by due date (ascending)
                  if (!a.dueDate) return 1;
                  if (!b.dueDate) return -1;
                  return (
                    new Date(a.dueDate).getTime() -
                    new Date(b.dueDate).getTime()
                  );
                })
                .map((job, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleJobClick(job)}
                  >
                    <div>
                      <p className="font-medium">{job.customer}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.title} • Due{" "}
                        {job.dueDate
                          ? new Date(job.dueDate).toLocaleDateString()
                          : "Not set"}{" "}
                        • {job.estimatedHours}h • {job.assignedTo}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          job.status === "In Production"
                            ? "bg-blue-100 text-blue-800"
                            : job.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : job.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800",
                        )}
                      >
                        {job.status}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          job.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : job.priority === "Medium"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800",
                        )}
                      >
                        {job.priority}
                      </span>
                    </div>
                  </div>
                ))}
              {jobEvents.filter((job) => {
                if (!job.dueDate) return false;
                const dueDate = new Date(job.dueDate);
                const today = new Date();
                const nextWeek = new Date();
                nextWeek.setDate(today.getDate() + 7);
                return dueDate >= today && dueDate <= nextWeek;
              }).length === 0 && (
                <div className="text-center p-4 text-muted-foreground">
                  No jobs due in the next 7 days
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Details Dialog */}
      <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <DialogDescription>Job details and information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedJob && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Customer</Label>
                  <div className="col-span-3 font-medium">
                    {selectedJob.customer}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Time</Label>
                  <div className="col-span-3">{selectedJob.time}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <div className="col-span-3">
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        selectedJob.status === "In Production"
                          ? "bg-blue-100 text-blue-800"
                          : selectedJob.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedJob.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800",
                      )}
                    >
                      {selectedJob.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Priority</Label>
                  <div className="col-span-3">
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        selectedJob.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : selectedJob.priority === "Medium"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800",
                      )}
                    >
                      {selectedJob.priority}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">Description</Label>
                  <div className="col-span-3">{selectedJob.description}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Product Type</Label>
                  <div className="col-span-3">{selectedJob.productType}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Quantity</Label>
                  <div className="col-span-3">{selectedJob.quantity}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Estimated Hours</Label>
                  <div className="col-span-3">
                    {selectedJob.estimatedHours} hours
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Assigned To</Label>
                  <div className="col-span-3">{selectedJob.assignedTo}</div>
                </div>
                {selectedJob.createdBy && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Created By</Label>
                    <div className="col-span-3">{selectedJob.createdBy}</div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowJobDetails(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setShowJobDetails(false);
                setShowEditDialog(true);
              }}
            >
              Edit Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <EditJobDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        job={selectedJob}
        onSave={(updatedJob) => {
          console.log("Saving updated job:", updatedJob);
          // In a real app, this would update the job in the database
          // For now, we'll just update the local state
          if (selectedJob) {
            // Update the job in the local state
            const updatedJobEvents = jobEvents.map((job) =>
              job.id === selectedJob.id ? { ...job, ...updatedJob } : job,
            );
            setJobEvents(updatedJobEvents);

            // Also update the job in localStorage
            try {
              const storedJobs = JSON.parse(
                localStorage.getItem("jobs") || "[]",
              );
              const updatedStoredJobs = storedJobs.map((job: any) =>
                job.id === selectedJob.id ? { ...job, ...updatedJob } : job,
              );
              localStorage.setItem("jobs", JSON.stringify(updatedStoredJobs));
              alert(`Job "${updatedJob.title}" updated successfully!`);
            } catch (error) {
              console.error("Error updating job:", error);
              alert("Error updating job. Please try again.");
            }
          }
        }}
      />
    </div>
  );
}
