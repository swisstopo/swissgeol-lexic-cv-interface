import './globals.css';
import { Roboto } from 'next/font/google';
import { Providers } from './providers';
import StyledJsxRegistry from './registry';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { TermData } from './models/termDataInterface';

const inter = Roboto({
  subsets: ['latin'],
  weight: '100'
});

export default function RootLayout({
  children, title, showReleaseGitHub, termData
}: {
  title: string;
  showReleaseGitHub: boolean;
  termData: TermData | null;
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="gs">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </head>
      <body className={inter.className}>
        <Providers>
          <StyledJsxRegistry>
            <Navbar />
            <main>{children}</main>
            <Footer showReleaseGitHub={showReleaseGitHub} termData={termData} />
          </StyledJsxRegistry>
        </Providers>
      </body>
    </html>
  );
}
