import { Inter } from 'next/font/google';
import Head from 'next/head';
import { Providers } from '../providers';
import StyledJsxRegistry from '../registry';
import Navbar from './Navbar';
import Footer from './Footer';
import ConsentProvider from './ConsentProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function PageLayout({
  children,
  title,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content="Developed by Nards IT" />
        <meta name="author" content="Nards IT" />
        <link rel="author" href="https://nards.it" />
      </Head>
      <Providers>
        <ConsentProvider>
          <StyledJsxRegistry>
            <div
              className={`${inter.className} gs`}
              style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}
            >
              <Navbar />
              <main style={{ width: '1496px', margin: '0 auto', flex: '1 0 auto' }}>{children}</main>
              <Footer />
            </div>
          </StyledJsxRegistry>
        </ConsentProvider>
      </Providers>
    </>
  );
}
