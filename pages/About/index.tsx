import dynamic from 'next/dynamic';

const AboutUs = dynamic(() => import('@/app/components/About'), { ssr: false });

const Aboutus: React.FC = () => {
  return <AboutUs />;
};

export default Aboutus;