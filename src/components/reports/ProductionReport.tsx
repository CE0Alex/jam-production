import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Download,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";

export default function ProductionReport() {
  const [reportType, setReportType] = useState("production");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  });
  const [chartType, setChartType] = useState("bar");

  const handleExport = (format: string) => {
    // Simulate export process
    console.log(`Exporting ${reportType} report as ${format}...`);
    // In a real app, this would trigger an API call to generate the export
    setTimeout(() => {
      alert(
        `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported as ${format.toUpperCase()}`,
      );
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Production Reports
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
            <CardDescription>Configure report parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">
                    Production Capacity
                  </SelectItem>
                  <SelectItem value="staff">Staff Utilization</SelectItem>
                  <SelectItem value="jobs">Job Completion</SelectItem>
                  <SelectItem value="products">Product Types</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange(range as { from: Date; to: Date });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Type</label>
              <div className="flex space-x-2">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setChartType("bar")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" /> Bar
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setChartType("line")}
                >
                  <LineChart className="h-4 w-4 mr-2" /> Line
                </Button>
                <Button
                  variant={chartType === "pie" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setChartType("pie")}
                >
                  <PieChart className="h-4 w-4 mr-2" /> Pie
                </Button>
              </div>
            </div>

            <Button className="w-full mt-4">Generate Report</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {reportType === "production"
                ? "Production Capacity Report"
                : reportType === "staff"
                  ? "Staff Utilization Report"
                  : reportType === "jobs"
                    ? "Job Completion Report"
                    : "Product Types Report"}
            </CardTitle>
            <CardDescription>
              {format(dateRange.from, "MMM d, yyyy")} to{" "}
              {format(dateRange.to, "MMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="space-y-4">
                {/* Placeholder for chart - in a real app, use a charting library */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  {chartType === "bar" && (
                    <div className="w-full h-full p-8 flex items-end justify-around">
                      {[65, 40, 85, 30, 55, 25, 70].map((value, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div
                            className="bg-primary w-12 rounded-t-md transition-all duration-500"
                            style={{ height: `${value}%` }}
                          />
                          <div className="text-xs mt-2">
                            {
                              ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                                i
                              ]
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {chartType === "line" && (
                    <div className="w-full h-full p-8 relative">
                      <svg width="100%" height="100%" viewBox="0 0 700 300">
                        <polyline
                          points="0,240 100,180 200,120 300,200 400,100 500,150 600,80"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                        />
                        {[0, 100, 200, 300, 400, 500, 600].map((x, i) => (
                          <g key={i}>
                            <circle
                              cx={x}
                              cy={[240, 180, 120, 200, 100, 150, 80][i]}
                              r="5"
                              fill="hsl(var(--primary))"
                            />
                            <text
                              x={x}
                              y="280"
                              textAnchor="middle"
                              fontSize="12"
                            >
                              {
                                [
                                  "Mon",
                                  "Tue",
                                  "Wed",
                                  "Thu",
                                  "Fri",
                                  "Sat",
                                  "Sun",
                                ][i]
                              }
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  )}

                  {chartType === "pie" && (
                    <div className="w-full h-full p-8 flex items-center justify-center">
                      <svg width="200" height="200" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="hsl(var(--primary))"
                          strokeWidth="20"
                          strokeDasharray="75 25"
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="hsl(var(--primary) / 0.7)"
                          strokeWidth="20"
                          strokeDasharray="25 75"
                          strokeDashoffset="-25"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="hsl(var(--primary) / 0.4)"
                          strokeWidth="20"
                          strokeDasharray="15 85"
                          strokeDashoffset="-50"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="hsl(var(--primary) / 0.2)"
                          strokeWidth="20"
                          strokeDasharray="10 90"
                          strokeDashoffset="-65"
                        />
                      </svg>
                      <div className="ml-8 space-y-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-primary rounded-full mr-2" />
                          <span className="text-sm">Completed (30%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-primary/70 rounded-full mr-2" />
                          <span className="text-sm">In Progress (25%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-primary/40 rounded-full mr-2" />
                          <span className="text-sm">Pending (15%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-primary/20 rounded-full mr-2" />
                          <span className="text-sm">Not Started (10%)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Jobs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">42</div>
                      <p className="text-xs text-muted-foreground">
                        +8 from previous period
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Completion Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">87%</div>
                      <Progress value={87} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Avg. Production Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3.2 hours</div>
                      <p className="text-xs text-muted-foreground">
                        -0.5 hours from average
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Staff Utilization
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">76%</div>
                      <Progress value={76} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="border rounded-md">
                  <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                    <div>Date</div>
                    <div>Jobs Completed</div>
                    <div>Production Hours</div>
                    <div>Staff Utilization</div>
                    <div>Efficiency</div>
                  </div>
                  <div className="divide-y">
                    {[
                      {
                        date: "Mon, Jun 10",
                        completed: 8,
                        hours: 32,
                        utilization: "85%",
                        efficiency: "92%",
                      },
                      {
                        date: "Tue, Jun 11",
                        completed: 6,
                        hours: 28,
                        utilization: "70%",
                        efficiency: "88%",
                      },
                      {
                        date: "Wed, Jun 12",
                        completed: 9,
                        hours: 36,
                        utilization: "90%",
                        efficiency: "95%",
                      },
                      {
                        date: "Thu, Jun 13",
                        completed: 5,
                        hours: 24,
                        utilization: "60%",
                        efficiency: "80%",
                      },
                      {
                        date: "Fri, Jun 14",
                        completed: 7,
                        hours: 30,
                        utilization: "75%",
                        efficiency: "85%",
                      },
                      {
                        date: "Sat, Jun 15",
                        completed: 4,
                        hours: 16,
                        utilization: "80%",
                        efficiency: "90%",
                      },
                      {
                        date: "Sun, Jun 16",
                        completed: 3,
                        hours: 12,
                        utilization: "60%",
                        efficiency: "75%",
                      },
                    ].map((day, i) => (
                      <div key={i} className="grid grid-cols-5 p-3 text-sm">
                        <div>{day.date}</div>
                        <div>{day.completed}</div>
                        <div>{day.hours}</div>
                        <div>{day.utilization}</div>
                        <div>{day.efficiency}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
