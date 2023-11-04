import React from 'react'
import { FC } from 'react';
import Image from 'next/image';


interface CustomImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  otherProps?: any; // Any other image-related props you want to pass
  className?: string;
  layout?: string;
}

const CustomImage: FC<CustomImageProps> = ({ src, alt, width, height,layout, ...otherProps }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width ? width : 400}
      height={height ? height : 400}
      decoding="async"
      loading="lazy"
      sizes="(max-width: 768px) 750vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL={staticBlurDataUrl()}
      {...otherProps}
    />
  );
};

export default CustomImage;


export function staticBlurDataUrl() {
    const blurSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
          <!-- Defining a blurred background rectangle -->
          <rect x="0" y="0" width="100%" height="100%" stroke-width="3" stroke="#CACACA" fill="#FAF4FE" filter="url(#blur)" preserveAspectRatio="none"/>
  
          <!-- Defining a blur filter -->
          <filter id="blur" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>

          <image x="50%" y="50%" width="200" height="200" transform="translate(-100, -100)" href="https://res.cloudinary.com/dpc1nydxn/image/upload/v1698219521/Flowentech/image-gallery_rx1a37.png"></image>
      </svg>
    `;
    
    const toBase64 = (str: string) => {
      return typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);
    }
  
    return `data:image/svg+xml;base64,${toBase64(blurSvg)}`
  }