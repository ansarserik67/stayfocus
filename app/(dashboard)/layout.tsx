import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/** Layout for the personal cabinet: same chrome, its own content column. */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
