import Image from 'next/image';
import { CSSProperties } from 'react';

const LOGO_WIDTH = 589;
const LOGO_HEIGHT = 118;

interface LogoImageProps {
  height?: number;
  className?: string;
  style?: CSSProperties;
}

export default function LogoImage({ height = 40, className, style }: LogoImageProps) {
  const width = Math.round((height / LOGO_HEIGHT) * LOGO_WIDTH);
  return (
    <Image
      src="/assets/images/logos/scripture-spot-logo.svg"
      alt="Scripture Spot Logo"
      width={width}
      height={height}
      priority
      className={className}
      style={style}
    />
  );
}
