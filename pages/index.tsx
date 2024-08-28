import dynamic from 'next/dynamic';

const Homepage = dynamic(() => import('@/app/components/homepage'), { ssr: false });

const Home: React.FC = () => {
  return <Homepage />;
};

export default Home;