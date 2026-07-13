import { getData } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

export default async function Home() {
  const meeting = await getData();
  return (
    <div className="min-h-screen bg-white dark:bg-black text-foreground">
      <Toaster />
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <header className="space-y-2">
          <Badge>Summary</Badge>
          <h1 className="text-3xl font-semibold">{meeting.title}</h1>
          <p className="text-muted-foreground">{meeting.description}</p>
        </header>

        <Card>
          <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {meeting.categoriesMeetingCategory.map((c, idx) => (
                <Badge key={idx} variant="secondary">{c.category.name}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Participants</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {meeting.participant.map((p, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.role}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Decisions</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {meeting.decision.map((d, idx) => (
                <li key={idx}>{d.description}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Action Items</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meeting.actionItem.map((a, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4">
                  <div>
                    <p className={"font-medium " + (a.completed ? "line-through text-muted-foreground" : "")}>{a.description}</p>
                    <p className="text-sm text-muted-foreground">Assignee: {a.assignee} · Due: {a.dueDate}</p>
                  </div>
                  <Badge variant={a.completed ? "outline" : "default"}>{a.completed ? "Done" : "Open"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
