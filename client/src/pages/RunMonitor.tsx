import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RunMonitor() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();

  const mockLogs = [
    { timestamp: '2024-11-03 10:23:45', level: 'INFO', message: 'Starting agent execution...' },
    { timestamp: '2024-11-03 10:23:46', level: 'INFO', message: 'Loading model: gpt-4' },
    { timestamp: '2024-11-03 10:23:48', level: 'INFO', message: 'Processing user input...' },
    { timestamp: '2024-11-03 10:23:50', level: 'INFO', message: 'Generating response...' },
    { timestamp: '2024-11-03 10:23:52', level: 'SUCCESS', message: 'Response generated successfully' },
    { timestamp: '2024-11-03 10:23:52', level: 'INFO', message: 'Tokens used: 450 (prompt: 200, completion: 250)' },
    { timestamp: '2024-11-03 10:23:52', level: 'INFO', message: 'Cost: $0.023' },
    { timestamp: '2024-11-03 10:23:52', level: 'SUCCESS', message: 'Execution completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/agents')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Run Monitor</h1>
            <p className="text-muted-foreground">
              Run ID: {params.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" data-testid="button-refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status="success" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">RAG Service</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">45s</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">$0.023</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="bg-black text-green-400 font-mono text-xs p-4 space-y-1">
              {mockLogs.map((log, i) => (
                <div key={i} className="flex gap-2" data-testid={`log-entry-${i}`}>
                  <span className="text-gray-500">{log.timestamp}</span>
                  <span className={
                    log.level === 'ERROR' ? 'text-red-400' :
                    log.level === 'SUCCESS' ? 'text-green-400' :
                    'text-blue-400'
                  }>[{log.level}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
