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
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@/types/user";

interface LoginFormProps {
  onLogin?: (email: string, password: string, role: UserRole) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate login process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, determine role based on email
      let role: UserRole = "sales";
      if (email.includes("production")) {
        role = "production";
      } else if (email.includes("admin")) {
        role = "admin";
      }

      if (onLogin) {
        onLogin(email, password, role);
      }

      // Redirect to dashboard is handled by the router in routes/index.tsx
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Print Shop Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the production scheduler
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" className="p-0 h-auto text-sm">
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me for 30 days
            </Label>
          </div>
          {error && (
            <div className="text-sm text-red-500 font-medium">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          <span>Login with these demo accounts:</span>
          <ul className="mt-2 space-y-1">
            <li>
              <code>sales@printshop.com</code> - Sales view
            </li>
            <li>
              <code>production@printshop.com</code> - Production view
            </li>
            <li>
              <code>admin@printshop.com</code> - Admin view
            </li>
            <li>
              Password: <code>password</code>
            </li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  );
}
