import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-6 py-16">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-12">
        <h1 className="text-3xl font-semibold tracking-tight">Placeholder</h1>
        <p className="text-base text-muted-foreground">App skeleton ready</p>
        <Button size="lg">Get started</Button>
      </div>
    </main>
  );
}
