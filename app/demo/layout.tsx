import Sidebar from "./sidebar";
import AssistantWidget from "./assistant-widget";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</div>
      </div>
      <AssistantWidget />
    </div>
  );
}
