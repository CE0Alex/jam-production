import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PDFUploader from "@/components/pdf-parser/PDFUploader";
import { Job, JobPriority, JobStatus } from "@/types/job";

export default function NewJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Job>>({
    status: "Not Started" as JobStatus,
    priority: "Medium" as JobPriority,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dueDate: date,
      }));
    }
  };

  const handleExtractedData = (data: Partial<Job>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleSubmit = () => {
    // In a real app, this would save to a database
    console.log("Submitting job:", formData);

    try {
      // Create a basic job without scheduling details
      const basicJob = {
        ...formData,
        id: `job-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Set default values for required fields
        status: formData.status || "Not Started",
        priority: formData.priority || "Medium",
      };

      // For demo purposes, store in localStorage
      const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      jobs.push(basicJob);
      localStorage.setItem("jobs", JSON.stringify(jobs));

      // No need for an alert here as we'll show guidance on the calendar page

      // Navigate to the interactive calendar view
      navigate("/", { state: { showCalendar: true, newJobId: basicJob.id } });
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Error creating job. Please try again.");
      // Stay on the page if there's an error
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add New Job</h1>
        <p className="text-muted-foreground">
          Create a new print job and add it to the production schedule
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Enter the basic information about this print job
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="Business Cards"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input
                    id="customer"
                    placeholder="John Smith"
                    value={formData.customer || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job requirements"
                  rows={3}
                  value={formData.description || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) =>
                      handleSelectChange("jobType", value)
                    }
                  >
                    <SelectTrigger id="jobType">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Digital Printing">
                        Digital Printing
                      </SelectItem>
                      <SelectItem value="Wide Format">Wide Format</SelectItem>
                      <SelectItem value="Screen Printing">
                        Screen Printing
                      </SelectItem>
                      <SelectItem value="DTF">DTF</SelectItem>
                      <SelectItem value="Embroidery">Embroidery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productType">Product</Label>
                  <Select
                    value={formData.productType}
                    onValueChange={(value) =>
                      handleSelectChange("productType", value)
                    }
                  >
                    <SelectTrigger id="productType">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.jobType === "Digital Printing" && (
                        <>
                          <SelectItem value="Business Cards">
                            Business Cards
                          </SelectItem>
                          <SelectItem value="Brochures">Brochures</SelectItem>
                          <SelectItem value="Flyers">Flyers</SelectItem>
                        </>
                      )}
                      {formData.jobType === "Wide Format" && (
                        <>
                          <SelectItem value="Posters">Posters</SelectItem>
                          <SelectItem value="Banners">Banners</SelectItem>
                        </>
                      )}
                      {formData.jobType === "Screen Printing" && (
                        <>
                          <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                        </>
                      )}
                      {formData.jobType === "DTF" && (
                        <>
                          <SelectItem value="Transfer Prints">
                            Transfer Prints
                          </SelectItem>
                        </>
                      )}
                      {formData.jobType === "Embroidery" && (
                        <>
                          <SelectItem value="Custom Hats">
                            Custom Hats
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="500"
                    value={formData.quantity || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">
                    Total Production Time (hours)
                  </Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    placeholder="2"
                    value={
                      formData.estimatedTime ? formData.estimatedTime / 60 : ""
                    }
                    onChange={(e) => {
                      const hours = parseFloat(e.target.value) || 0;
                      // Convert hours to minutes for storage
                      const minutes = Math.round(hours * 60);
                      setFormData((prev) => ({
                        ...prev,
                        estimatedTime: minutes,
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate ? (
                          format(formData.dueDate, "PPP")
                        ) : (
                          <span>Pick a date (optional)</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleSelectChange("priority", value as JobPriority)
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">
                    Estimated Production Time (hours)
                  </Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    placeholder="2"
                    value={
                      formData.estimatedTime ? formData.estimatedTime / 60 : ""
                    }
                    onChange={(e) => {
                      const hours = parseFloat(e.target.value) || 0;
                      // Convert hours to minutes for storage
                      const minutes = Math.round(hours * 60);
                      setFormData((prev) => ({
                        ...prev,
                        estimatedTime: minutes,
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To (Optional)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    You can assign staff later in the calendar view
                  </p>
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(value) =>
                      handleSelectChange("assignedTo", value)
                    }
                  >
                    <SelectTrigger id="assignedTo">
                      <SelectValue placeholder="Select staff member (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unassigned">Unassigned</SelectItem>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                      <SelectItem value="Sarah Williams">
                        Sarah Williams
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Production Notes</CardTitle>
              <CardDescription>
                Add any special instructions or production notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                placeholder="Enter any special instructions or production notes"
                rows={4}
                value={formData.notes || ""}
                onChange={handleInputChange}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <PDFUploader onExtractedData={handleExtractedData} />

          <Card>
            <CardHeader>
              <CardTitle>Job Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleSelectChange("status", value as JobStatus)
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Production">In Production</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
              <CardDescription>
                Summary of the job to be created
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.title && formData.estimatedTime ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-md border-l-4 border-blue-500 bg-blue-50">
                    <div className="font-medium">
                      {formData.title || "New Job"}
                    </div>
                    {formData.dueDate && (
                      <div className="text-sm text-muted-foreground">
                        Due: {format(formData.dueDate, "PPP")}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Estimated time:{" "}
                      {formData.estimatedTime
                        ? (formData.estimatedTime / 60).toFixed(1)
                        : 0}{" "}
                      hours
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Status: {formData.status || "Not Started"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Priority: {formData.priority || "Medium"}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    After creating this job, you'll be directed to the calendar
                    to schedule it.
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Fill in job details to see job summary
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate("/jobs")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Create Job</Button>
      </div>
    </div>
  );
}
