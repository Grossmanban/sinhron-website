import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-x pt-14 md:pt-16">
      <div className="lg:flex lg:gap-10 lg:pt-10 xl:gap-14">
        <DocsSidebar />
        <div className="min-w-0 flex-1 pb-24 pt-8 lg:pt-0">{children}</div>
      </div>
    </div>
  );
}
