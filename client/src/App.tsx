import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import Dashboard from "@/pages/Dashboard";
import Agents from "@/pages/Agents";
import Templates from "@/pages/Templates";
import TemplateDetails from "@/pages/TemplateDetails";
import AgentBuilder from "@/pages/AgentBuilder";
import AgentDetails from "@/pages/AgentDetails";
import Runs from "@/pages/Runs";
import RunMonitor from "@/pages/RunMonitor";
import Registry from "@/pages/Registry";
import RegistryDetails from "@/pages/RegistryDetails";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/agents" component={Agents} />
      <Route path="/agents/new" component={AgentBuilder} />
      <Route path="/agents/:id" component={AgentDetails} />
      <Route path="/templates" component={Templates} />
      <Route path="/templates/:id" component={TemplateDetails} />
      <Route path="/runs" component={Runs} />
      <Route path="/runs/:id" component={RunMonitor} />
      <Route path="/registry" component={Registry} />
      <Route path="/registry/:packageId" component={RegistryDetails} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto p-6">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
