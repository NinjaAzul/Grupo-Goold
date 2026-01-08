import { LogoIcon } from '@/components/icons';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export function Loading({ className = '', size = 'md' }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin`}>
        <LogoIcon className="w-full h-full text-primary" />
      </div>
    </div>
  );
}

