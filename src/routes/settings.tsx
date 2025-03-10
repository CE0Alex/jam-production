import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="america-new_york">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america-new_york">
                      Eastern Time (ET)
                    </SelectItem>
                    <SelectItem value="america-chicago">
                      Central Time (CT)
                    </SelectItem>
                    <SelectItem value="america-denver">
                      Mountain Time (MT)
                    </SelectItem>
                    <SelectItem value="america-los_angeles">
                      Pacific Time (PT)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mm-dd-yyyy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for the interface
                  </p>
                </div>
                <Switch id="dark-mode" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                View system information and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Version</p>
                  <p className="text-sm text-muted-foreground">1.2.0</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">June 15, 2023</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Database Status</p>
                  <p className="text-sm text-green-500">Connected</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Server Status</p>
                  <p className="text-sm text-green-500">Online</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Check for Updates
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="Print Shop Pro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Print Street" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="Printville" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" defaultValue="CA" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" defaultValue="90210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue="United States" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="info@printshoppro.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" defaultValue="www.printshoppro.com" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Settings</CardTitle>
              <CardDescription>
                Configure production capacity and scheduling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="work-hours">Working Hours</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time" className="text-xs">
                      Start Time
                    </Label>
                    <Select defaultValue="8">
                      <SelectTrigger id="start-time">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <SelectItem key={i} value={`${i + 6}`}>
                            {i + 6}:00 AM
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time" className="text-xs">
                      End Time
                    </Label>
                    <Select defaultValue="17">
                      <SelectTrigger id="end-time">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <SelectItem key={i} value={`${i + 12}`}>
                            {i + 12 > 12 ? i : i + 12}:00{" "}
                            {i + 12 > 11 ? "PM" : "AM"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Working Days</Label>
                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center space-y-1"
                      >
                        <Label htmlFor={`day-${i}`} className="text-xs">
                          {day}
                        </Label>
                        <Switch id={`day-${i}`} checked={i < 6} />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="default-capacity">
                  Default Staff Daily Capacity (minutes)
                </Label>
                <Input id="default-capacity" type="number" defaultValue="480" />
                <p className="text-xs text-muted-foreground">
                  Default is 8 hours (480 minutes) per day
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="overbook">Allow Overbooking</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow scheduling beyond staff capacity
                  </p>
                </div>
                <Switch id="overbook" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-assign">Auto-assign Jobs</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically assign jobs based on staff availability
                  </p>
                </div>
                <Switch id="auto-assign" checked={true} />
              </div>

              <Button>Save Production Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-job">New Job Created</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when new jobs are created
                    </p>
                  </div>
                  <Switch id="new-job" checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="job-status">Job Status Changes</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when job status changes
                    </p>
                  </div>
                  <Switch id="job-status" checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="due-date">Due Date Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders for upcoming due dates
                    </p>
                  </div>
                  <Switch id="due-date" checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="capacity">Capacity Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when production capacity is near limit
                    </p>
                  </div>
                  <Switch id="capacity" checked={true} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">System Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show browser notifications for important events
                    </p>
                  </div>
                  <Switch id="browser" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound">Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound for important notifications
                    </p>
                  </div>
                  <Switch id="sound" />
                </div>
              </div>

              <Button>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Users & Permissions</CardTitle>
              <CardDescription>
                Manage user accounts and access permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">User Accounts</h3>
                <Button size="sm">
                  <span className="mr-1">+</span> Add User
                </Button>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-4 bg-muted/50 p-3 text-sm font-medium">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      name: "John Doe",
                      email: "john.doe@printshop.com",
                      role: "Admin",
                    },
                    {
                      name: "Jane Smith",
                      email: "jane.smith@printshop.com",
                      role: "Production",
                    },
                    {
                      name: "Mike Johnson",
                      email: "mike.johnson@printshop.com",
                      role: "Production",
                    },
                    {
                      name: "Sarah Williams",
                      email: "sarah.williams@printshop.com",
                      role: "Production",
                    },
                    {
                      name: "Robert Chen",
                      email: "robert.chen@printshop.com",
                      role: "Sales",
                    },
                    {
                      name: "Lisa Garcia",
                      email: "lisa.garcia@printshop.com",
                      role: "Sales",
                    },
                  ].map((user, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-4 p-3 text-sm items-center"
                    >
                      <div>{user.name}</div>
                      <div>{user.email}</div>
                      <div>{user.role}</div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Role Permissions</h3>

                <div className="border rounded-md">
                  <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                    <div>Permission</div>
                    <div className="text-center">Admin</div>
                    <div className="text-center">Production</div>
                    <div className="text-center">Sales</div>
                    <div className="text-center">Guest</div>
                  </div>
                  <div className="divide-y">
                    {[
                      { name: "View Jobs" },
                      { name: "Create Jobs" },
                      { name: "Edit Jobs" },
                      { name: "Delete Jobs" },
                      { name: "Assign Jobs" },
                      { name: "View Reports" },
                      { name: "Manage Staff" },
                      { name: "Manage Settings" },
                    ].map((permission, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-5 p-3 text-sm items-center"
                      >
                        <div>{permission.name}</div>
                        <div className="text-center">
                          <Switch checked={true} />
                        </div>
                        <div className="text-center">
                          <Switch checked={i < 6} />
                        </div>
                        <div className="text-center">
                          <Switch checked={i < 4} />
                        </div>
                        <div className="text-center">
                          <Switch checked={i === 0} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button>Save Permission Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
