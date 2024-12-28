import TaskManagementApp from "@/components/TaskManagementApp";
import { ModeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full  items-center justify-between font-mono text-sm">
        <div className="flex flex-col items-center mb-8 justify-between gap-4 md:flex-row">
          <h1 className="text-2xl md:text-4xl font-bold  text-center">
            Task Management App
          </h1>
          <ModeToggle />
        </div>

        <TaskManagementApp />
      </div>
    </main>
  );
}
