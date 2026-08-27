import { Link } from 'react-router-dom';
import DogFrameSequence from '../components/DogFrameSequence';
import { PawPrint } from 'lucide-react';

export default function Home({ auth }) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-72px)] w-full">
      {/* Left Area - Hero Animation */}
      <div className="w-full md:w-3/5 lg:w-[60%] h-full bg-white flex items-center justify-center relative">
        <div className="w-full h-full relative">
           <DogFrameSequence />
        </div>
      </div>

      {/* Right Area - Brand Blocks */}
      <div className="w-full md:w-2/5 lg:w-[40%] h-full flex flex-col">
        {/* Top Right Blue Block */}
        <div className="bg-primary flex-[1.2] flex flex-col justify-center px-10 lg:px-16 py-12 relative overflow-hidden">
          {/* Decorative Paws — more of them, varied sizes */}
          <PawPrint className="absolute -top-6 -right-6 w-36 h-36 text-white opacity-[0.06] rotate-12" />
          <PawPrint className="absolute bottom-6 right-6 w-28 h-28 text-white opacity-[0.06] -rotate-12" />
          <PawPrint className="absolute top-1/2 left-2 w-22 h-22 text-white opacity-[0.04] rotate-45" />
          <PawPrint className="absolute top-8 left-8 w-14 h-14 text-white opacity-[0.04] -rotate-20" />
          <PawPrint className="absolute bottom-20 left-1/3 w-16 h-16 text-white opacity-[0.03] rotate-30" />
          
          <h1 className="text-white text-5xl lg:text-7xl font-bold leading-[1.1] z-10">
            Blue Cross<br />of India
          </h1>
          
          {!auth.isAuthenticated && (
            <Link 
              to="/login" 
              className="mt-8 bg-secondary text-gray-900 px-8 py-3 rounded-md font-extrabold text-lg hover:bg-yellow-400 transition-colors w-fit shadow-md border-b-4 border-yellow-500 z-10"
            >
              Get Started →
            </Link>
          )}
        </div>
        
        {/* Yellow divider — slightly taller */}
        <div className="h-2 w-full bg-secondary" />

        {/* Bottom Right White Block */}
        <div className="bg-white flex-[0.8] flex items-center px-10 lg:px-16 py-12 relative overflow-hidden">
          {/* Subtle paw on white */}
          <PawPrint className="absolute right-4 bottom-4 w-24 h-24 text-primary opacity-[0.04] rotate-12" />
          <p className="text-primary-dark text-4xl lg:text-5xl font-bold leading-[1.2] z-10">
            Dedicated to<br />the voiceless<br />since 1964
          </p>
        </div>
      </div>
    </div>
  );
}
