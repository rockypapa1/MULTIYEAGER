import { useEffect, useRef } from 'react';

export default function SecondaryAdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content to avoid duplicates during re-renders
    containerRef.current.innerHTML = '<div id="container-79c95564f339c4e4da9297fa17c102c5"></div>';

    // Create the invoke script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl28935174.effectivegatecpm.com/79c95564f339c4e4da9297fa17c102c5/invoke.js';
    
    // Append script to the ref div
    containerRef.current.appendChild(script);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full my-4 overflow-hidden min-h-[60px]">
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
}
