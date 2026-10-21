import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/** Layout for the public landing page: sticky header, content, footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
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
