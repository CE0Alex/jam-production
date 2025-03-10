import { ReactNode, useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  ClipboardList,
  Settings,
  Plus,
  Users,
  Package,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children?: ReactNode;
}

interface User {
  name: string;
  email: string;
  role: UserRole;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-card p-4">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-bold">Print Shop</h2>
        </div>

        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/") ? "bg-muted" : ""}`}
            asChild
          >
            <Link
              to="/"
              className="flex items-center space-x-2 px-3 py-2 text-primary"
            >
              <CalendarIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/jobs/new") ? "bg-muted" : ""}`}
            asChild
          >
            <Link
              to="/jobs/new"
              className="flex items-center space-x-2 px-3 py-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Job</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/jobs") ? "bg-muted" : ""}`}
            asChild
          >
            <Link to="/jobs" className="flex items-center space-x-2 px-3 py-2">
              <ClipboardList className="h-5 w-5" />
              <span>Jobs</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/products") ? "bg-muted" : ""}`}
            asChild
          >
            <Link
              to="/products"
              className="flex items-center space-x-2 px-3 py-2"
            >
              <Package className="h-5 w-5" />
              <span>Products</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/staff") ? "bg-muted" : ""}`}
            asChild
          >
            <Link to="/staff" className="flex items-center space-x-2 px-3 py-2">
              <Users className="h-5 w-5" />
              <span>Staff</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/reports") ? "bg-muted" : ""}`}
            asChild
          >
            <Link
              to="/reports"
              className="flex items-center space-x-2 px-3 py-2"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Reports</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/settings") ? "bg-muted" : ""}`}
            asChild
          >
            <Link
              to="/settings"
              className="flex items-center space-x-2 px-3 py-2"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </Button>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-muted rounded-md">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role || "guest"}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">{children || <Outlet />}</div>
    </div>
  );
}
