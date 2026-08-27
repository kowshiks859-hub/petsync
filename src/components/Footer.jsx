import { PawPrint } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-8 border-t-2 border-secondary mt-auto relative overflow-hidden">
      <PawPrint className="absolute top-4 left-8 w-20 h-20 text-white opacity-[0.03] rotate-12" />
      <PawPrint className="absolute bottom-4 right-12 w-16 h-16 text-white opacity-[0.03] -rotate-12" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center relative z-10">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h3 className="font-heading font-extrabold text-xl mb-1">Blue Cross of India</h3>
          <p className="text-blue-200 text-sm">Dedicated to the voiceless since 1964</p>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-sm text-center md:text-left">
          <a 
            href="https://bluecrossofindia.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-secondary transition-colors"
          >
            Official Website
          </a>
          <a 
            href="https://instagram.com/blue_cross_rescues" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-secondary transition-colors"
          >
            @blue_cross_rescues
          </a>
        </div>
      </div>
    </footer>
  );
}
