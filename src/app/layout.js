import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navBar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stars for Events",
  description: "Stars for Events",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavBar/>
        <main>{children}</main>      
      </body>
    </html>
  );
}
