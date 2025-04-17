import React, { useRef, useState, useEffect } from 'react';

export default function LazyImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const obs = new window.IntersectionObserver(([e]) => {
      if (e.isIntersecting) setShow(true);
    });
    if (ref.current) obs.observe(ref.current);
    return () => { if (ref.current) obs.unobserve(ref.current); }
  }, []);

  return <img ref={ref} src={show ? src : undefined} alt={alt} {...props} />;
}