// app/layout.tsx
import '../styles/globals.css';
import Link from 'next/link';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <header className="bg-blue-600 p-4">
        <nav className="flex justify-between">
          <Link href="/" className="text-white font-bold">Home</Link>
          <Link href="/history" className="text-white">History</Link>
          <Link href="/settings" className="text-white">Settings</Link>
          <Link href="/test" className='text-white'>Test</Link>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;
