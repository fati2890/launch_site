import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import SiteHeader from "@/components/layout/site-header";
import Footer from "@/components/layout/site-footer"; // <= ton composant footerimport { getPage } from "@/lib/page";
import { getLayout } from "@/lib/layout";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
   const { site, footer } = await getLayout();

  return (
    <html lang="en" suppressHydrationWarning>
      
        <body className="min-h-screen flex flex-col">
          <ThemeProvider>
        <SiteHeader site={site} />
        <main className="flex-1">{children}</main>
        {footer ? <Footer text={footer.text} links={footer.links} /> : null}
        </ThemeProvider>
      </body>
        
  
    </html>
  );
}
