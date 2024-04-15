import { Inter } from 'next/font/google';
import './globals.css';
import StyledComponentsRegistry from './registry';

const inter = Inter({ subsets: ['latin'] });

// components
import NavigationBar from './components/NavigationBar';

export const metadata = {
  title: 'Baypath Volunteer Ops',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <NavigationBar />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
