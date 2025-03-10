import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Plus,
  Users,
  Clock,
  X,
  Calendar,
  Settings,
} from "lucide-react";
import { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function StaffPage() {
  // Staff data
  const staffMembers: User[] = [
    {
      id: "1",
      name: "Isaac Johnson",
      email: "isaac@printshop.com",
      role: "production",
      department: "Production",
      capacity: 480, // 8 hours in minutes
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isaac",
    },
    {
      id: "2",
      name: "Aaron Smith",
      email: "aaron@printshop.com",
      role: "production",
      department: "Production",
      capacity: 480, // 8 hours in minutes
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aaron",
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike@printshop.com",
      role: "sales",
      department: "Sales",
      capacity: 480, // 8 hours in minutes
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
    {
      id: "4",
      name: "Jordan Davis",
      email: "jordan@printshop.com",
      role: "sales",
      department: "Sales",
      capacity: 480, // 8 hours in minutes
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    },
  ];

  // Workload data
  const workloadData = [
    {
      id: "1",
      assigned: 360, // 6 hours in minutes
      remaining: 120, // 2 hours in minutes
      blockedTime: [], // Array of blocked time slots
    },
    {
      id: "2",
      assigned: 300, // 5 hours in minutes
      remaining: 180, // 3 hours in minutes
      blockedTime: ["13:00-14:00", "16:00-17:00"], // Lunch and end of day meeting
    },
    {
      id: "3",
      assigned: 240, // 4 hours in minutes
      remaining: 240, // 4 hours in minutes
      blockedTime: ["09:00-10:30"], // Morning meeting
    },
    {
      id: "4",
      assigned: 270, // 4.5 hours in minutes
      remaining: 210, // 3.5 hours in minutes
      blockedTime: ["15:00-16:30"], // Afternoon meeting
    },
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
        blockedTime: [],
      }
    );
  };

  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [showStaffSettings, setShowStaffSettings] = useState(false);
  const [availabilitySettings, setAvailabilitySettings] = useState<{
    defaultStartTime: string;
    defaultEndTime: string;
    blockedTimes: string[];
    dailySettings: {
      monday: { startTime: string; endTime: string; enabled: boolean };
      tuesday: { startTime: string; endTime: string; enabled: boolean };
      wednesday: { startTime: string; endTime: string; enabled: boolean };
      thursday: { startTime: string; endTime: string; enabled: boolean };
      friday: { startTime: string; endTime: string; enabled: boolean };
      saturday: { startTime: string; endTime: string; enabled: boolean };
      sunday: { startTime: string; endTime: string; enabled: boolean };
    };
  }>({
    defaultStartTime: "09:00",
    defaultEndTime: "17:00",
    blockedTimes: [],
    dailySettings: {
      monday: { startTime: "09:00", endTime: "17:00", enabled: false },
      tuesday: { startTime: "09:00", endTime: "17:00", enabled: false },
      wednesday: { startTime: "09:00", endTime: "17:00", enabled: false },
      thursday: { startTime: "09:00", endTime: "17:00", enabled: false },
      friday: { startTime: "09:00", endTime: "17:00", enabled: false },
      saturday: { startTime: "09:00", endTime: "17:00", enabled: false },
      sunday: { startTime: "09:00", endTime: "17:00", enabled: false },
    },
  });

  const handleEditStaff = (staff: User) => {
    setSelectedStaff(staff);
    const workload = getWorkloadForStaff(staff.id);
    setAvailabilitySettings({
      defaultStartTime: "09:00",
      defaultEndTime: "17:00",
      blockedTimes: workload.blockedTime || [],
      dailySettings: {
        monday: { startTime: "09:00", endTime: "17:00", enabled: false },
        tuesday: { startTime: "09:00", endTime: "17:00", enabled: false },
        wednesday: { startTime: "09:00", endTime: "17:00", enabled: false },
        thursday: { startTime: "09:00", endTime: "17:00", enabled: false },
        friday: { startTime: "09:00", endTime: "17:00", enabled: false },
        saturday: { startTime: "09:00", endTime: "17:00", enabled: false },
        sunday: { startTime: "09:00", endTime: "17:00", enabled: false },
      },
    });
    setShowStaffSettings(true);
  };

  const handleSaveSettings = () => {
    if (!selectedStaff) return;

    // In a real app, this would update the database
    alert(`Settings saved for ${selectedStaff.name}`);
    setShowStaffSettings(false);
  };

  const handleAddBlockedTime = () => {
    setAvailabilitySettings((prev) => ({
      ...prev,
      blockedTimes: [...prev.blockedTimes, "12:00-13:00"],
    }));
  };

  const handleRemoveBlockedTime = (index: number) => {
    setAvailabilitySettings((prev) => ({
      ...prev,
      blockedTimes: prev.blockedTimes.filter((_, i) => i !== index),
    }));
  };

  const handleBlockedTimeChange = (index: number, value: string) => {
    setAvailabilitySettings((prev) => {
      const newBlockedTimes = [...prev.blockedTimes];
      newBlockedTimes[index] = value;
      return {
        ...prev,
        blockedTimes: newBlockedTimes,
      };
    });
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {staffMembers.map((staff) => {
          const workload = getWorkloadForStaff(staff.id);
          const utilizationPercentage =
            (workload.assigned / staff.capacity) * 100;

          return (
            <Card key={staff.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    {staff.avatar ? (
                      <AvatarImage src={staff.avatar} alt={staff.name} />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(staff.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle>{staff.name}</CardTitle>
                    <CardDescription>
                      <Badge
                        variant={
                          staff.role === "production" ? "default" : "secondary"
                        }
                      >
                        {staff.department}
                      </Badge>
                    </CardDescription>
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
                    {workload.blockedTime &&
                      workload.blockedTime.length > 0 && (
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">
                            Blocked Time:
                          </span>
                          <span>{workload.blockedTime.join(", ")}</span>
                        </div>
                      )}
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
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
                <Button size="sm" onClick={() => handleEditStaff(staff)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Staff Settings Dialog */}
      <Dialog open={showStaffSettings} onOpenChange={setShowStaffSettings}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Staff Settings: {selectedStaff?.name}</DialogTitle>
            <DialogDescription>
              Configure availability and capacity settings for this staff member
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Availability Settings</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium mb-2">
                    Default Weekly Hours
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultStartTime">
                        Default Start Time
                      </Label>
                      <Select
                        value={availabilitySettings.defaultStartTime}
                        onValueChange={(value) =>
                          setAvailabilitySettings((prev) => ({
                            ...prev,
                            defaultStartTime: value,
                          }))
                        }
                      >
                        <SelectTrigger id="defaultStartTime">
                          <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {["08:00", "08:30", "09:00", "09:30", "10:00"].map(
                            (time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="defaultEndTime">Default End Time</Label>
                      <Select
                        value={availabilitySettings.defaultEndTime}
                        onValueChange={(value) =>
                          setAvailabilitySettings((prev) => ({
                            ...prev,
                            defaultEndTime: value,
                          }))
                        }
                      >
                        <SelectTrigger id="defaultEndTime">
                          <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                        <SelectContent>
                          {["16:00", "16:30", "17:00", "17:30", "18:00"].map(
                            (time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium mb-2">
                    Daily Overrides
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure specific hours for individual days that differ
                    from the default schedule
                  </p>

                  <div className="space-y-4">
                    {Object.entries(availabilitySettings.dailySettings).map(
                      ([day, settings]) => (
                        <div key={day} className="border rounded-md p-3">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-base capitalize">
                              {day}
                            </Label>
                            <Switch
                              checked={settings.enabled}
                              onCheckedChange={(checked) => {
                                setAvailabilitySettings((prev) => ({
                                  ...prev,
                                  dailySettings: {
                                    ...prev.dailySettings,
                                    [day]: {
                                      ...prev.dailySettings[day],
                                      enabled: checked,
                                    },
                                  },
                                }));
                              }}
                            />
                          </div>

                          {settings.enabled && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`${day}StartTime`}>
                                  Start Time
                                </Label>
                                <Select
                                  value={settings.startTime}
                                  onValueChange={(value) =>
                                    setAvailabilitySettings((prev) => ({
                                      ...prev,
                                      dailySettings: {
                                        ...prev.dailySettings,
                                        [day]: {
                                          ...prev.dailySettings[day],
                                          startTime: value,
                                        },
                                      },
                                    }))
                                  }
                                >
                                  <SelectTrigger id={`${day}StartTime`}>
                                    <SelectValue placeholder="Select start time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[
                                      "08:00",
                                      "08:30",
                                      "09:00",
                                      "09:30",
                                      "10:00",
                                      "Off",
                                    ].map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`${day}EndTime`}>
                                  End Time
                                </Label>
                                <Select
                                  value={settings.endTime}
                                  onValueChange={(value) =>
                                    setAvailabilitySettings((prev) => ({
                                      ...prev,
                                      dailySettings: {
                                        ...prev.dailySettings,
                                        [day]: {
                                          ...prev.dailySettings[day],
                                          endTime: value,
                                        },
                                      },
                                    }))
                                  }
                                >
                                  <SelectTrigger id={`${day}EndTime`}>
                                    <SelectValue placeholder="Select end time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[
                                      "16:00",
                                      "16:30",
                                      "17:00",
                                      "17:30",
                                      "18:00",
                                      "Off",
                                    ].map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="capacity">Daily Capacity (hours)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    className="w-20 text-right"
                    defaultValue={
                      selectedStaff
                        ? (selectedStaff.capacity / 60).toString()
                        : "8"
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Blocked Time Periods</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddBlockedTime}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>

                <div className="space-y-2 mt-2">
                  {availabilitySettings.blockedTimes.map((time, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={time}
                        onChange={(e) =>
                          handleBlockedTimeChange(index, e.target.value)
                        }
                        placeholder="e.g. 12:00-13:00"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveBlockedTime(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {availabilitySettings.blockedTimes.length === 0 && (
                    <div className="text-sm text-muted-foreground italic">
                      No blocked time periods. Add periods when this staff
                      member is unavailable.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Settings</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive job assignments via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Schedule Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Daily schedule notification
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Capacity Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when schedule exceeds capacity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStaffSettings(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
