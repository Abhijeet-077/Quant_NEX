import { Bell, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="h-16 bg-white dark:bg-background border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center">
        <h2 className="text-xl font-heading text-foreground font-medium">{title}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </span>
          <Input 
            type="text" 
            placeholder="Search patients..." 
            className="pl-10 w-48 md:w-64"
          />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
