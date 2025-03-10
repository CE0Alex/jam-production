import LoginForm from "@/components/auth/LoginForm";
import { UserRole } from "@/types/user";

export default function LoginPage() {
  const handleLogin = (email: string, password: string, role: UserRole) => {
    // In a real app, this would authenticate with a backend
    console.log(`Logging in with ${email} as ${role}`);

    // Store user info in localStorage for demo purposes
    localStorage.setItem(
      "user",
      JSON.stringify({
        email,
        role,
        name: email
          .split("@")[0]
          .split(".")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      }),
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}
