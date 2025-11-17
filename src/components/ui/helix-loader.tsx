import './helix-loader.scss';
import cn from '@/lib/utils/cn';

type HelixLoaderProps = {
  className?: string;
  color?: string;
  size?: number;
};

export default function HelixLoader({ className, color = 'black', size = 45 }: HelixLoaderProps) {
  const css = `
    .container {
      --uib-color: ${color};
      --uib-size: ${size}px;
    }
  `;

  return (
    <div className={cn('container', className)}>
      <style>{css}</style>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
    </div>
  );
}
