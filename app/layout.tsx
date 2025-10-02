import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import StyledJsxRegistry from './registry';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


/* const inter = Roboto({
  subsets: ['latin'],
  weight: '100'
}); */
const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export default function RootLayout({
  children, title
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="gs">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content="Developed by Nards IT"></meta>
        <meta name="author" content="Nards IT"></meta>
        <link rel="author" href="https://nards.it"></link>
      </head>
      <body className={inter.className}>
        <Providers>
          <StyledJsxRegistry>
            <Navbar />
            <main style={{ width: '1496px', margin: '0 auto' }}>{children}</main>
            <Footer />
          </StyledJsxRegistry>
        </Providers>
      </body>
    </html>
  );
}
