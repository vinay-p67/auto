import React from 'react';
import { AUTO_IMAGES } from '../config/images';

export const WebGLFallback: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#070a10]">
      {/* Workshop lighting ambient gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(230,57,70,0.18),rgba(7,10,16,0.98))]" />
      
      {/* Background imagery with subtle overlay */}
      <div 
        className="absolute inset-0 opacity-25 mix-blend-luminosity bg-cover bg-center"
        style={{ backgroundImage: `url(${AUTO_IMAGES.hero.primary})` }}
      />
      
      {/* Floor reflection grid */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#070a10] via-[#070a10]/80 to-transparent" />
      <div className="absolute inset-0 subtle-grid opacity-30" />
    </div>
  );
};
