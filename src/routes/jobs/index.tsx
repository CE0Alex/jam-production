import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditJobDialog from "@/components/jobs/EditJobDialog";
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
import { Search, Filter, Plus, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobsPage() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
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

        <Tabs defaultValue="all">
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
            {[
              {
                id: "1",
                title: "Business Cards",
                customer: "John Smith",
                dueDate: "Tomorrow",
                status: "In Production",
                priority: "Medium",
                assignedTo: "Jane Smith",
              },
              {
                id: "2",
                title: "Brochures",
                customer: "Acme Corp",
                dueDate: "In 2 days",
                status: "Pending",
                priority: "High",
                assignedTo: "John Doe",
              },
              {
                id: "3",
                title: "Banners",
                customer: "City Event",
                dueDate: "In 3 days",
                status: "Not Started",
                priority: "High",
                assignedTo: "Mike Johnson",
              },
              {
                id: "4",
                title: "Flyers",
                customer: "Local Business",
                dueDate: "In 5 days",
                status: "Pending",
                priority: "Low",
                assignedTo: "Sarah Williams",
              },
              {
                id: "5",
                title: "Postcards",
                customer: "Travel Agency",
                dueDate: "Last week",
                status: "Completed",
                priority: "Medium",
                assignedTo: "Jane Smith",
              },
            ].map((job) => (
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
                <div className="col-span-2">{job.dueDate}</div>
                <div className="col-span-2">{job.assignedTo}</div>
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
          console.log("Saving updated job:", updatedJob);
          // In a real app, this would update the job in the database
          alert(`Job "${updatedJob.title}" updated successfully!`);
          setShowEditDialog(false);
        }}
      />
    </div>
  );
}
