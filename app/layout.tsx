import './globals.css';
import { ReactNode } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}