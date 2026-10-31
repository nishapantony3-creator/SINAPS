import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "SINAPS Live Admin Dashboard | School Management Portal",
  description: "Live Website CMS & Management Portal for St. Ignatius Nursery & Primary School",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script src="/tailwind.min.js" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.tailwind = window.tailwind || {};
            window.tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    brand: {
                      blue: '#1E3A5F',
                      yellow: '#FBBF24',
                      green: '#22C55E',
                      orange: '#FF6B1A',
                    }
                  }
                }
              }
            };
          `,
        }}
      />
      <div className="admin-body min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </div>
    </>
  );
}
