import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Block Post Manager",
  description: "Create, block/unblock, and delete posts in an admin dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mt-6">{children}</main>
      </body>
    </html>
  );
}
