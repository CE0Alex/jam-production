import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import EditJobDialog from "@/components/jobs/EditJobDialog";
import DeleteJobDialog from "@/components/jobs/DeleteJobDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Search, Filter, Plus, ArrowUpDown, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobsPage() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // Load jobs from localStorage when component mounts
  useEffect(() => {
    try {
      const storedJobs = localStorage.getItem("jobs");
      if (storedJobs) {
        setJobs(JSON.parse(storedJobs));
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
  }, []);
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            View and manage all print jobs
          </p>
        </div>
        <Button onClick={() => navigate("/jobs/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Job
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs..."
              className="pl-8 w-full"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-production">In Production</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader className="px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle>Job List</CardTitle>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b bg-muted/50 px-6 py-3 grid grid-cols-12 text-sm font-medium">
            <div className="col-span-4">Job Details</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-2">Assigned To</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>
          <div className="divide-y">
            {jobs
              .filter(
                (job) =>
                  activeTab === "all" ||
                  (activeTab === "pending" && job.status === "Pending") ||
                  (activeTab === "in-production" &&
                    job.status === "In Production") ||
                  (activeTab === "completed" && job.status === "Completed"),
              )
              .map((job) => (
                <div
                  key={job.id}
                  className="px-6 py-4 grid grid-cols-12 items-center hover:bg-muted/50 cursor-pointer"
                >
                  <div className="col-span-4">
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {job.customer}
                    </div>
                  </div>
                  <div className="col-span-2">
                    {job.dueDate
                      ? new Date(job.dueDate).toLocaleDateString()
                      : "Not set"}
                  </div>
                  <div className="col-span-2">
                    {job.assignedTo || "Unassigned"}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
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
                  </div>
                  <div className="col-span-2 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log(`View job ${job.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedJob(job);
                        setShowEditDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setSelectedJob(job);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Job Dialog */}
      <EditJobDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        job={selectedJob}
        onSave={(updatedJob) => {
          // Update the job in the local state
          const updatedJobs = jobs.map((job) =>
            job.id === selectedJob.id ? { ...job, ...updatedJob } : job,
          );
          setJobs(updatedJobs);

          // Also update the job in localStorage
          try {
            const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
            const updatedStoredJobs = storedJobs.map((job) =>
              job.id === selectedJob.id ? { ...job, ...updatedJob } : job,
            );
            localStorage.setItem("jobs", JSON.stringify(updatedStoredJobs));
            alert(`Job "${updatedJob.title}" updated successfully!`);
          } catch (error) {
            console.error("Error updating job:", error);
            alert("Error updating job. Please try again.");
          }
          setShowEditDialog(false);
        }}
      />

      {/* Delete Job Dialog */}
      <DeleteJobDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        jobTitle={selectedJob?.title || ""}
        onDelete={() => {
          if (!selectedJob) return;

          // Remove the job from local state
          const updatedJobs = jobs.filter((job) => job.id !== selectedJob.id);
          setJobs(updatedJobs);

          // Also remove from localStorage
          try {
            const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
            const updatedStoredJobs = storedJobs.filter(
              (job) => job.id !== selectedJob.id,
            );
            localStorage.setItem("jobs", JSON.stringify(updatedStoredJobs));
            alert(`Job "${selectedJob.title}" deleted successfully!`);
          } catch (error) {
            console.error("Error deleting job:", error);
            alert("Error deleting job. Please try again.");
          }

          setShowDeleteDialog(false);
        }}
      />
    </div>
  );
}
