import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, Plus, Users } from "lucide-react";
import { User } from "@/types/user";

export default function StaffPage() {
  // Sample staff data
  const staffMembers: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@printshop.com",
      role: "admin",
      department: "Production",
      capacity: 480, // 8 hours
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@printshop.com",
      role: "production",
      department: "Production",
      capacity: 480,
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@printshop.com",
      role: "production",
      department: "Finishing",
      capacity: 480,
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.williams@printshop.com",
      role: "production",
      department: "Production",
      capacity: 360, // 6 hours (part-time)
    },
    {
      id: "5",
      name: "Robert Chen",
      email: "robert.chen@printshop.com",
      role: "sales",
      department: "Sales",
      capacity: 480,
    },
    {
      id: "6",
      name: "Lisa Garcia",
      email: "lisa.garcia@printshop.com",
      role: "sales",
      department: "Sales",
      capacity: 480,
    },
  ];

  // Sample workload data
  const workloadData = [
    { id: "1", assigned: 420, remaining: 60 }, // 7 hours assigned, 1 hour remaining
    { id: "2", assigned: 360, remaining: 120 }, // 6 hours assigned, 2 hours remaining
    { id: "3", assigned: 240, remaining: 240 }, // 4 hours assigned, 4 hours remaining
    { id: "4", assigned: 180, remaining: 180 }, // 3 hours assigned, 3 hours remaining
    { id: "5", assigned: 300, remaining: 180 }, // 5 hours assigned, 3 hours remaining
    { id: "6", assigned: 240, remaining: 240 }, // 4 hours assigned, 4 hours remaining
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getWorkloadForStaff = (staffId: string) => {
    return (
      workloadData.find((data) => data.id === staffId) || {
        assigned: 0,
        remaining: 480,
      }
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">
            Manage staff members and workload allocation
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Staff Member
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search staff..."
              className="pl-8 w-full"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Staff</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {staffMembers.map((staff) => {
          const workload = getWorkloadForStaff(staff.id);
          const utilizationPercentage =
            (workload.assigned / staff.capacity) * 100;

          return (
            <Card key={staff.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(staff.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{staff.name}</CardTitle>
                    <CardDescription>{staff.department}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{staff.email}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="capitalize">{staff.role}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">
                        Daily Capacity:
                      </span>
                      <span>{staff.capacity / 60} hours</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Today's Workload</span>
                      <span>
                        {workload.assigned / 60} / {staff.capacity / 60} hours
                      </span>
                    </div>
                    <Progress value={utilizationPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Assigned: {workload.assigned / 60} hours</span>
                      <span>Available: {workload.remaining / 60} hours</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      View Schedule
                    </Button>
                    <Button size="sm">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
