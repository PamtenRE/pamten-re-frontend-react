'use client';

import Lottie from 'lottie-react';
import animationData from '@/lottie/sample.json';

export default function AnimatedLottie() {
  return (
    <div className="w-full flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-2xl">
        <Lottie
          animationData={animationData}
          loop
          className="w-full h-auto"
          style={{ background: 'transparent' }}
        />
      </div>
    </div>
  );
}
