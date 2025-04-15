import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function Layout({ children, title = 'HandcraftBK' }: LayoutProps) {
  const router = useRouter();
  const isChatbotPage = router.pathname === '/chatbot';

  return (
    <>
      <Head>
        <title>{title} | HandcraftBK</title>
        <meta name="description" content="Discover unique handcrafted products for your home" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!isChatbotPage && <Navbar />}
      <main>{children}</main>
      {!isChatbotPage && <Footer />}
    </>
  );
}
