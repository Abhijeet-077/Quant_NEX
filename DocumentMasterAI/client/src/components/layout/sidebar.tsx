import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Biohazard, 
  Upload,
  User, 
  FlaskConical, 
  TrendingUp, 
  Syringe, 
  ActivitySquare,
  LayoutDashboard,
  FileText
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

function SidebarLink({ href, icon, label, isActive, isCollapsed }: SidebarLinkProps) {
  return (
    <li className="mb-2">
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={href}>
                <a className={cn(
                  "flex items-center justify-center p-2 mx-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-primary"
                )}>
                  <span className="text-xl">{icon}</span>
                </a>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Link href={href}>
          <a className={cn(
            "flex items-center justify-start p-2 pl-6 mx-2 rounded-lg transition-colors",
            isActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground/80 hover:bg-sidebar-primary"
          )}>
            <span className="text-xl mr-3">{icon}</span>
            <span>{label}</span>
          </a>
        </Link>
      )}
    </li>
  );
}

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <aside className={cn(
      "bg-sidebar h-full flex flex-col transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-center md:justify-start p-4 h-16">
        <Biohazard className="text-3xl text-white" />
        {!isCollapsed && (
          <h1 className="ml-2 text-xl font-heading font-bold text-white">Quantum-AI Oncology</h1>
        )}
        <button 
          onClick={toggleSidebar}
          className="ml-auto text-white/70 hover:text-white p-1"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-4">
        <ul>
          <SidebarLink 
            href="/dashboard" 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
            isActive={location === "/dashboard"}
            isCollapsed={isCollapsed}
          />
          <SidebarLink 
            href="/patients" 
            icon={<User />} 
            label="Patients" 
            isActive={location === "/patients"}
            isCollapsed={isCollapsed}
          />
          <SidebarLink 
            href="/upload" 
            icon={<Upload />} 
            label="Image Upload" 
            isActive={location === "/upload"}
            isCollapsed={isCollapsed}
          />
          <SidebarLink 
            href="/diagnosis" 
            icon={<FlaskConical />} 
            label="Diagnosis" 
            isActive={location === "/diagnosis"}
            isCollapsed={isCollapsed}
          />
          <SidebarLink 
            href="/prognosis" 
            icon={<TrendingUp />} 
            label="Prognosis" 
            isActive={location === "/prognosis"}
            isCollapsed={isCollapsed}
          />
          <SidebarLink 
            href="/treatment" 
            icon={<Syringe />} 
            label="Treatment" 
            isActive={location === "/treatment"}
            isCollapsed={isCollapsed}
          />
          <SidebarLink 
            href="/monitoring" 
            icon={<ActivitySquare />} 
            label="Monitoring" 
            isActive={location === "/monitoring"}
            isCollapsed={isCollapsed}
          />
          <SidebarLink 
            href="/documentation" 
            icon={<FileText />} 
            label="Documentation" 
            isActive={location === "/documentation"}
            isCollapsed={isCollapsed}
          />
        </ul>
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <img 
            className="h-10 w-10 rounded-full border-2 border-white/20" 
            src={user?.profileImage || "https://ui-avatars.com/api/?name=Doctor&background=0D47A1&color=fff"}
            alt="Doctor profile" 
          />
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-semibold text-white">{user?.fullName || "Doctor"}</p>
              <p className="text-xs text-white/70">{user?.title || "Oncologist"}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
