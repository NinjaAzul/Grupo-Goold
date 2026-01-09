import React from 'react';

interface ChevronDownIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({
  className = 'w-5 h-5',
  stroke = '#737373',
  ...props
}) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke={stroke}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

