"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  animationData?: unknown;
  url?: string;
  className?: string;
  loop?: boolean;
}

export function LottieAnimation({ animationData, url, className, loop = true }: LottieAnimationProps) {
  const [data, setData] = useState<unknown>(animationData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (url) {
      fetch(url)
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error("Lottie fetch error:", err));
    }
  }, [url]);

  if (!mounted || (!data && !animationData)) return <div className={className} />;

  return (
    <Lottie 
      animationData={data || animationData} 
      className={className} 
      loop={loop} 
    />
  );
}
