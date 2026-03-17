import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    // Set global atOptions for Adsterra
    (window as any).atOptions = {
      'key' : 'da93e29a20facc3f5805777e5413612f',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };

    // Clear previous content
    bannerRef.current.innerHTML = '';

    // Create the invoke script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.highperformanceformat.com/da93e29a20facc3f5805777e5413612f/invoke.js';
    
    // Append script to the ref div
    bannerRef.current.appendChild(script);
    
    return () => {
      if (bannerRef.current) {
        bannerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full my-4 overflow-hidden min-h-[90px]">
      <div ref={bannerRef} />
    </div>
  );
}
