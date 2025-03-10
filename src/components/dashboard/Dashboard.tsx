import { useState } from "react";
import EditJobDialog from "@/components/jobs/EditJobDialog";
import { useNavigate } from "react-router-dom";
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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [userRole, setUserRole] = useState<UserRole>(initialUserRole);
  const [calendarView, setCalendarView] = useState("week");
  const [selectedJob, setSelectedJob] = useState<JobEvent | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Production hours data
  const totalHoursCapacity = 160; // 4 staff × 40 hours
  const scheduledHours = 98;
  const remainingHours = totalHoursCapacity - scheduledHours;
  const utilizationPercentage = (scheduledHours / totalHoursCapacity) * 100;

  // Staff data with production hours
  const staffMembers: StaffMember[] = [
    {
      id: "1",
      name: "John Doe",
      role: "Production Manager",
      department: "Production",
      hoursAssigned: 32,
      hoursCapacity: 40,
      jobsAssigned: 5,
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Print Operator",
      department: "Production",
      hoursAssigned: 38,
      hoursCapacity: 40,
      jobsAssigned: 8,
    },
    {
      id: "3",
      name: "Mike Johnson",
      role: "Finishing Specialist",
      department: "Production",
      hoursAssigned: 18,
      hoursCapacity: 40,
      jobsAssigned: 4,
    },
    {
      id: "4",
      name: "Sarah Williams",
      role: "Print Operator",
      department: "Production",
      hoursAssigned: 10,
      hoursCapacity: 40,
      jobsAssigned: 2,
    },
  ];

  // Sales staff data
  const salesStaff = [
    {
      id: "5",
      name: "Robert Chen",
      role: "Sales Manager",
      jobsCreated: 12,
      hoursScheduled: 45,
    },
    {
      id: "6",
      name: "Lisa Garcia",
      role: "Account Executive",
      jobsCreated: 8,
      hoursScheduled: 32,
    },
    {
      id: "7",
      name: "David Kim",
      role: "Sales Representative",
      jobsCreated: 6,
      hoursScheduled: 21,
    },
  ];

  const jobEvents: JobEvent[] = [
    {
      id: "1",
      title: "Business Cards",
      customer: "John Smith",
      time: "8:00 AM",
      status: "In Production",
      priority: "Medium",
      description: "500 business cards with logo and contact information",
      productType: "Business Cards",
      quantity: 500,
      estimatedHours: 2,
      assignedTo: "Jane Smith",
      createdBy: "Robert Chen",
    },
    {
      id: "2",
      title: "Brochures",
      customer: "Acme Corp",
      time: "10:30 AM",
      status: "Pending",
      priority: "High",
      description: "Tri-fold brochures for product launch",
      productType: "Brochures",
      quantity: 1000,
      estimatedHours: 4,
      assignedTo: "John Doe",
      createdBy: "Lisa Garcia",
    },
    {
      id: "3",
      title: "Banners",
      customer: "City Event",
      time: "1:00 PM",
      status: "Not Started",
      priority: "High",
      description: "Large format banners for outdoor event",
      productType: "Banners",
      quantity: 5,
      estimatedHours: 6,
      assignedTo: "Mike Johnson",
      createdBy: "David Kim",
    },
    {
      id: "4",
      title: "Flyers",
      customer: "Local Business",
      time: "3:30 PM",
      status: "Pending",
      priority: "Low",
      description: "Promotional flyers for weekend sale",
      productType: "Flyers",
      quantity: 2500,
      estimatedHours: 3,
      assignedTo: "Sarah Williams",
      createdBy: "Robert Chen",
    },
  ];

  // Weekly calendar data - more comprehensive
  const weeklyCalendarData = [
    // Monday
    [
      {
        id: "5",
        title: "Postcards",
        customer: "Travel Agency",
        time: "9:00 AM",
        status: "Completed",
        priority: "Medium",
        estimatedHours: 2,
        assignedTo: "Jane Smith",
      },
    ],
    // Tuesday
    [
      jobEvents[0],
      {
        id: "6",
        title: "Letterheads",
        customer: "Law Firm",
        time: "2:00 PM",
        status: "In Production",
        priority: "Low",
        estimatedHours: 1.5,
        assignedTo: "John Doe",
      },
    ],
    // Wednesday
    [
      jobEvents[1],
      {
        id: "7",
        title: "Posters",
        customer: "Music Festival",
        time: "3:00 PM",
        status: "Pending",
        priority: "Medium",
        estimatedHours: 3,
        assignedTo: "Mike Johnson",
      },
    ],
    // Thursday
    [
      jobEvents[2],
      {
        id: "8",
        title: "Business Cards",
        customer: "Tech Startup",
        time: "11:00 AM",
        status: "Not Started",
        priority: "Low",
        estimatedHours: 1,
        assignedTo: "Sarah Williams",
      },
    ],
    // Friday
    [
      jobEvents[3],
      {
        id: "9",
        title: "Catalogs",
        customer: "Retail Store",
        time: "10:00 AM",
        status: "Pending",
        priority: "High",
        estimatedHours: 5,
        assignedTo: "John Doe",
      },
    ],
    // Saturday
    [
      {
        id: "10",
        title: "Rush Flyers",
        customer: "Weekend Event",
        time: "9:00 AM",
        status: "Pending",
        priority: "High",
        estimatedHours: 2,
        assignedTo: "Jane Smith",
      },
    ],
    // Sunday
    [],
  ];

  const handleJobClick = (job: JobEvent) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

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
            <Button onClick={() => navigate("/jobs/new")}>
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
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">In Production</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed This Week</span>
                    <span className="font-medium">4</span>
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
              {[
                {
                  id: "u1",
                  title: "Brochures",
                  customer: "Acme Corp",
                  time: "9:00 AM",
                  due: "Tomorrow",
                  status: "In Production",
                  priority: "High",
                  estimatedHours: 4,
                  description: "Tri-fold brochures for product launch",
                  productType: "Brochures",
                  quantity: 1000,
                  assignedTo: "John Doe",
                  createdBy: "Lisa Garcia",
                },
                {
                  id: "u2",
                  title: "Menus",
                  customer: "Local Restaurant",
                  time: "10:30 AM",
                  due: "In 2 days",
                  status: "Pending",
                  priority: "Medium",
                  estimatedHours: 3,
                  description: "Double-sided menus with specials section",
                  productType: "Menus",
                  quantity: 50,
                  assignedTo: "Jane Smith",
                  createdBy: "Robert Chen",
                },
                {
                  id: "u3",
                  title: "Badges",
                  customer: "Tech Conference",
                  time: "1:00 PM",
                  due: "In 3 days",
                  status: "Not Started",
                  priority: "High",
                  estimatedHours: 5,
                  description: "Conference badges with QR codes",
                  productType: "Badges",
                  quantity: 200,
                  assignedTo: "Mike Johnson",
                  createdBy: "David Kim",
                },
                {
                  id: "u4",
                  title: "Posters",
                  customer: "Retail Store",
                  time: "11:00 AM",
                  due: "In 5 days",
                  status: "Pending",
                  priority: "Low",
                  estimatedHours: 2,
                  description: "Sale posters for store windows",
                  productType: "Posters",
                  quantity: 10,
                  assignedTo: "Sarah Williams",
                  createdBy: "Robert Chen",
                },
                {
                  id: "u5",
                  title: "Catalogs",
                  customer: "Marketing Agency",
                  time: "2:00 PM",
                  due: "In 7 days",
                  status: "Not Started",
                  priority: "Medium",
                  estimatedHours: 6,
                  description: "Product catalogs with updated pricing",
                  productType: "Catalogs",
                  quantity: 500,
                  assignedTo: "John Doe",
                  createdBy: "Lisa Garcia",
                },
              ].map((job, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleJobClick(job)}
                >
                  <div>
                    <p className="font-medium">{job.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.title} • Due {job.due} • {job.estimatedHours}h •{" "}
                      {job.assignedTo}
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
            const updatedJobs = jobEvents.map((job) =>
              job.id === selectedJob.id ? { ...job, ...updatedJob } : job,
            );
            // This is just for demo purposes - in a real app you'd update the state properly
            alert(`Job "${updatedJob.title}" updated successfully!`);
          }
        }}
      />
    </div>
  );
}
