import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../components/AuthProvider';
import Navbar from '../components/Navbar';
import AiChatbot from '../components/AiChatbot';

export const metadata: Metadata = {
  title: 'Kodemy — Learn at your own pace',
  description: 'World-class courses taught by expert instructors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <AiChatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
