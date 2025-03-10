import { useState, useEffect } from "react";
import EditJobDialog from "@/components/jobs/EditJobDialog";
import {
  format,
  addDays,
  startOfWeek,
  addHours,
  addMinutes,
  parse,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, FileText, Download } from "lucide-react";

interface Job {
  id: string;
  title: string;
  customer: string;
  time: string;
  endTime?: string;
  status: string;
  priority: string;
  description?: string;
  productType?: string;
  quantity?: number;
  estimatedHours?: number;
  assignedTo?: string;
  createdBy?: string;
  pdfTicket?: string;
}

interface ProductionCalendarProps {
  calendarView: "day" | "week" | "month";
  date: Date;
  onDateChange?: (date: Date) => void;
}

export default function ProductionCalendar({
  calendarView,
  date,
  onDateChange,
}: ProductionCalendarProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Job data array
  const [jobEvents, setJobEvents] = useState<Job[]>([]);

  // Load jobs from localStorage when component mounts
  useEffect(() => {
    try {
      const storedJobs = localStorage.getItem("jobs");
      if (storedJobs) {
        const parsedJobs = JSON.parse(storedJobs);
        // Convert to Job format
        const formattedJobs = parsedJobs.map((job: any) => ({
          id: job.id,
          title: job.title || "Untitled Job",
          customer: job.customer || "Unknown Customer",
          time: job.scheduledTime || "09:00",
          endTime: job.scheduledEndTime,
          status: job.status || "Not Started",
          priority: job.priority || "Medium",
          description: job.description,
          productType: job.productType,
          quantity: job.quantity,
          estimatedHours: job.estimatedTime ? job.estimatedTime / 60 : 1,
          assignedTo: job.assignedTo || "Unassigned",
        }));
        setJobEvents(formattedJobs);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
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

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  // Function to handle scheduling a job
  const handleScheduleJob = (job: Job, timeSlot: string, day?: Date) => {
    // In a real app, this would update the job in the database with scheduling info
    console.log(
      `Scheduling job ${job.id} at ${timeSlot}${day ? " on " + format(day, "PPP") : ""}`,
    );

    try {
      // For demo purposes, update the job in localStorage
      const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      const updatedJobs = jobs.map((j: any) => {
        if (j.id === job.id) {
          return {
            ...j,
            scheduledTime: timeSlot,
            scheduledDay: day
              ? format(day, "yyyy-MM-dd")
              : format(new Date(), "yyyy-MM-dd"),
            assignedTo: job.assignedTo || "Unassigned",
          };
        }
        return j;
      });
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));

      // For demo purposes, show a success message
      alert(`Job "${job.title}" scheduled successfully!`);
    } catch (error) {
      console.error("Error scheduling job:", error);
      alert("Error scheduling job. Please try again.");
    }
  };

  const handleViewPdf = () => {
    setShowPdfPreview(true);
  };

  const formatTimeDisplay = (timeString: string) => {
    // Convert 24-hour format to 12-hour format with AM/PM
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Generate time slots for day view (30-minute increments)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Find jobs for a specific time slot
  const getJobsForTimeSlot = (timeSlot: string) => {
    return jobEvents.filter((job) => {
      const jobStartTime = job.time;
      const jobEndTime =
        job.endTime ||
        addHours(parse(job.time, "HH:mm", new Date()), job.estimatedHours || 1)
          .toTimeString()
          .slice(0, 5);

      const slotTime = parse(timeSlot, "HH:mm", new Date());
      const jobStart = parse(jobStartTime, "HH:mm", new Date());
      const jobEnd = parse(jobEndTime, "HH:mm", new Date());

      return slotTime >= jobStart && slotTime < jobEnd;
    });
  };

  // Generate days for week view
  const generateWeekDays = () => {
    const days = [];
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday

    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }

    return days;
  };

  const weekDays = generateWeekDays();

  return (
    <div className="space-y-4">
      {calendarView === "day" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">Today's Schedule</h3>
            <div className="text-sm text-muted-foreground">
              {date.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            {/* Time slots header */}
            <div className="grid grid-cols-[100px_1fr] bg-muted/50">
              <div className="p-2 border-r text-sm font-medium">Time</div>
              <div className="p-2 text-sm font-medium">Jobs</div>
            </div>

            {/* Time slots with jobs */}
            <div className="divide-y">
              {timeSlots.map((timeSlot, i) => {
                const jobsInSlot = getJobsForTimeSlot(timeSlot);
                const isHalfHour = timeSlot.endsWith("30");

                return (
                  <div
                    key={i}
                    className={cn(
                      "grid grid-cols-[100px_1fr]",
                      isHalfHour ? "bg-muted/10" : "bg-white",
                    )}
                  >
                    <div className="p-2 border-r text-sm">
                      {formatTimeDisplay(timeSlot)}
                    </div>
                    <div className="p-2">
                      {jobsInSlot.map((job, j) => (
                        <div
                          key={`${i}-${j}`}
                          className={cn(
                            "p-2 rounded-md mb-1 cursor-pointer hover:opacity-90 transition-opacity",
                            job.status === "In Production"
                              ? "bg-blue-100 border-l-4 border-blue-500"
                              : job.status === "Pending"
                                ? "bg-yellow-100 border-l-4 border-yellow-500"
                                : job.status === "Completed"
                                  ? "bg-green-100 border-l-4 border-green-500"
                                  : "bg-gray-100 border-l-4 border-gray-500",
                          )}
                          onClick={() => handleJobClick(job)}
                        >
                          <div className="font-medium">{job.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {job.customer} • {formatTimeDisplay(job.time)} -{" "}
                            {job.endTime
                              ? formatTimeDisplay(job.endTime)
                              : "N/A"}{" "}
                            • {job.assignedTo}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {calendarView === "week" && (
        <div className="h-[600px] border rounded-md overflow-hidden">
          {/* Week header */}
          <div className="grid grid-cols-8 bg-muted/50 border-b">
            <div className="p-2 border-r text-sm font-medium">Time</div>
            {weekDays.map((day, i) => (
              <div
                key={i}
                className="p-2 text-center text-sm font-medium border-r"
              >
                <div>{format(day, "EEE")}</div>
                <div>{format(day, "MMM d")}</div>
              </div>
            ))}
          </div>

          {/* Time slots with jobs */}
          <div className="overflow-y-auto h-[calc(100%-40px)]">
            {timeSlots.map((timeSlot, i) => {
              const isHalfHour = timeSlot.endsWith("30");

              return (
                <div
                  key={i}
                  className={cn(
                    "grid grid-cols-8 border-b",
                    isHalfHour ? "bg-muted/10" : "bg-white",
                  )}
                >
                  <div className="p-2 border-r text-xs">
                    {formatTimeDisplay(timeSlot)}
                  </div>

                  {weekDays.map((day, dayIndex) => {
                    // Get jobs for this day and time slot
                    const dayJobs = weeklyCalendarData[dayIndex] || [];
                    const jobsInSlot = dayJobs.filter((job) => {
                      const jobStartTime = job.time;
                      const jobEndTime =
                        job.endTime ||
                        addHours(
                          parse(job.time, "HH:mm", new Date()),
                          job.estimatedHours || 1,
                        )
                          .toTimeString()
                          .slice(0, 5);

                      const slotTime = parse(timeSlot, "HH:mm", new Date());
                      const jobStart = parse(jobStartTime, "HH:mm", new Date());
                      const jobEnd = parse(jobEndTime, "HH:mm", new Date());

                      return slotTime >= jobStart && slotTime < jobEnd;
                    });

                    return (
                      <div key={dayIndex} className="p-1 border-r min-h-[40px]">
                        {jobsInSlot.map((job, j) => {
                          // Only show job at its start time to avoid duplicates
                          if (job.time === timeSlot) {
                            return (
                              <div
                                key={`${dayIndex}-${j}`}
                                className={cn(
                                  "p-1 rounded-md text-xs cursor-pointer hover:opacity-90 transition-opacity",
                                  job.status === "In Production"
                                    ? "bg-blue-100 border-l-2 border-blue-500"
                                    : job.status === "Pending"
                                      ? "bg-yellow-100 border-l-2 border-yellow-500"
                                      : job.status === "Completed"
                                        ? "bg-green-100 border-l-2 border-green-500"
                                        : "bg-gray-100 border-l-2 border-gray-500",
                                )}
                                onClick={() => handleJobClick(job)}
                              >
                                <div className="font-medium truncate">
                                  {job.title}
                                </div>
                                <div className="truncate text-[10px] text-muted-foreground">
                                  {formatTimeDisplay(job.time)} -{" "}
                                  {job.endTime
                                    ? formatTimeDisplay(job.endTime)
                                    : "N/A"}
                                  {job.estimatedHours &&
                                    ` (${job.estimatedHours}h)`}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {calendarView === "month" && (
        <div className="h-[600px] border rounded-md p-4 bg-white">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <div key={i} className="font-medium text-sm">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 gap-1 h-[calc(100%-2rem)]">
            {Array.from({ length: 35 }).map((_, i) => {
              const dayOfMonth = i - 3; // Adjust to start month on correct day
              const hasJobs =
                dayOfMonth > 0 && dayOfMonth < 29 && Math.random() > 0.6;
              const jobCount = hasJobs ? Math.floor(Math.random() * 3) + 1 : 0;

              return (
                <div
                  key={i}
                  className={cn(
                    "border rounded-md p-1 h-full overflow-hidden",
                    dayOfMonth <= 0 || dayOfMonth > 28
                      ? "bg-gray-50"
                      : "hover:bg-muted/10 cursor-pointer",
                  )}
                  onClick={() => {
                    if (dayOfMonth > 0 && dayOfMonth <= 28 && hasJobs) {
                      // Simulate clicking on a job for this day
                      const randomJobIndex = Math.floor(
                        Math.random() * jobEvents.length,
                      );
                      handleJobClick(jobEvents[randomJobIndex]);
                    }
                  }}
                >
                  {dayOfMonth > 0 && dayOfMonth <= 28 && (
                    <>
                      <div className="text-xs font-medium mb-1">
                        {dayOfMonth}
                      </div>
                      {hasJobs && (
                        <div className="space-y-1">
                          {Array.from({ length: jobCount }).map((_, j) => (
                            <div
                              key={j}
                              className={cn(
                                "text-xs px-1 py-0.5 rounded truncate",
                                j === 0
                                  ? "bg-blue-100"
                                  : j === 1
                                    ? "bg-yellow-100"
                                    : "bg-green-100",
                              )}
                            >
                              {j === 0
                                ? "Business Cards"
                                : j === 1
                                  ? "Brochures"
                                  : "Flyers"}
                            </div>
                          ))}
                          {jobCount > 0 && (
                            <div className="text-xs text-right text-muted-foreground">
                              {jobCount * 2}h
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Job Details Dialog */}
      <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <DialogDescription>Job details and information</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="pdf">Job Ticket</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Customer</Label>
                    <div className="col-span-3 font-medium">
                      {selectedJob.customer}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Time</Label>
                    <div className="col-span-3">
                      {formatTimeDisplay(selectedJob.time)} -{" "}
                      {selectedJob.endTime
                        ? formatTimeDisplay(selectedJob.endTime)
                        : "N/A"}
                    </div>
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
                  {selectedJob.description && (
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right">Description</Label>
                      <div className="col-span-3">
                        {selectedJob.description}
                      </div>
                    </div>
                  )}
                  {selectedJob.productType && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Product Type</Label>
                      <div className="col-span-3">
                        {selectedJob.productType}
                      </div>
                    </div>
                  )}
                  {selectedJob.quantity && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Quantity</Label>
                      <div className="col-span-3">{selectedJob.quantity}</div>
                    </div>
                  )}
                  {selectedJob.estimatedHours && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Estimated Hours</Label>
                      <div className="col-span-3">
                        {selectedJob.estimatedHours} hours
                      </div>
                    </div>
                  )}
                  {selectedJob.assignedTo && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Assigned To</Label>
                      <div className="col-span-3">{selectedJob.assignedTo}</div>
                    </div>
                  )}
                  {selectedJob.createdBy && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Created By</Label>
                      <div className="col-span-3">{selectedJob.createdBy}</div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pdf">
                  {selectedJob.pdfTicket ? (
                    <div className="space-y-4">
                      <div className="border rounded-md p-4 bg-muted/20 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 mr-3 text-blue-500" />
                          <div>
                            <p className="font-medium">
                              {selectedJob.pdfTicket}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Job ticket PDF
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleViewPdf}
                        >
                          <Info className="h-4 w-4 mr-2" /> View
                        </Button>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Download PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-muted-foreground">
                      No PDF job ticket attached to this job.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      <Dialog open={showPdfPreview} onOpenChange={setShowPdfPreview}>
        <DialogContent className="sm:max-w-[700px] sm:h-[600px]">
          <DialogHeader>
            <DialogTitle>PDF Job Ticket: {selectedJob?.pdfTicket}</DialogTitle>
          </DialogHeader>
          <div className="h-[450px] border rounded-md bg-muted/10 flex items-center justify-center">
            {/* This would be a PDF viewer in a real application */}
            <div className="text-center p-4">
              <FileText className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <p className="text-lg font-medium">PDF Preview</p>
              <p className="text-sm text-muted-foreground mb-4">
                In a real application, the PDF would be displayed here using a
                PDF viewer component.
              </p>
              <p className="text-sm font-medium">{selectedJob?.title}</p>
              <p className="text-sm">{selectedJob?.customer}</p>
              <p className="text-sm">
                {selectedJob?.productType} - Qty: {selectedJob?.quantity}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPdfPreview(false)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </DialogFooter>
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
