import { useState, useEffect, useRef } from 'react';

export default function DogFrameSequence() {
  const [currentFrame, setCurrentFrame] = useState(1);
  const totalFrames = 250;
  const canvasRef = useRef(null);
  
  // Preload frames to avoid flickering
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const imgArray = [];
    
    // For a hackathon prototype, preloading all 250 frames might be heavy,
    // but doing it for smooth playback.
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      // Format number to 3 digits e.g. 001
      const frameNumber = String(i).padStart(3, '0');
      // The images are in public/dogs/ or just served statically.
      // We will copy the dogs folder to public/dogs
      img.src = `/dogs/ezgif-frame-${frameNumber}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setLoaded(true);
        }
      };
      imgArray.push(img);
    }
    setImages(imgArray);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    
    let animationFrameId;
    let frameIdx = 0;
    
    const renderLoop = () => {
      frameIdx = (frameIdx + 1) % totalFrames;
      setCurrentFrame(frameIdx);
      
      const canvas = canvasRef.current;
      if (canvas && images[frameIdx]) {
        const ctx = canvas.getContext('2d');
        
        // Calculate smooth zoom
        // E.g., zoom from 1.0 to 1.05 over the sequence
        const progress = frameIdx / totalFrames;
        const scale = 1.0 + (progress * 0.05); // 5% zoom max
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image with zoom centered
        const w = canvas.width;
        const h = canvas.height;
        ctx.save();
        ctx.translate(w/2, h/2);
        ctx.scale(scale, scale);
        ctx.drawImage(images[frameIdx], -w/2, -h/2, w, h);
        ctx.restore();
      }
      
      // Control frame rate (e.g., 30fps)
      setTimeout(() => {
        animationFrameId = requestAnimationFrame(renderLoop);
      }, 1000 / 30);
    };
    
    renderLoop();
    
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [loaded, images]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
      {!loaded && <div className="text-gray-400 font-medium absolute z-10">Loading hero...</div>}
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className={`w-full h-full object-cover transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
