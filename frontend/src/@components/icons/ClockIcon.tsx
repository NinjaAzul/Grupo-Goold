import React from 'react';

interface ClockIconProps {
  className?: string;
}

export const ClockIcon: React.FC<ClockIconProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_31385_2590)">
        <path
          d="M7.5 15C3.36437 15 0 11.6356 0 7.5C0 3.36437 3.36437 0 7.5 0C11.6356 0 15 3.36437 15 7.5C15 11.6356 11.6356 15 7.5 15ZM7.5 1.25C4.05375 1.25 1.25 4.05375 1.25 7.5C1.25 10.9462 4.05375 13.75 7.5 13.75C10.9462 13.75 13.75 10.9462 13.75 7.5C13.75 4.05375 10.9462 1.25 7.5 1.25ZM7.8125 8.04125C8.00625 7.92938 8.125 7.72312 8.125 7.5V3.75C8.125 3.40438 7.845 3.125 7.5 3.125C7.155 3.125 6.875 3.40438 6.875 3.75V6.4175L5.6475 5.70875C5.34875 5.53562 4.96625 5.63875 4.79375 5.9375C4.62125 6.23625 4.72375 6.61875 5.0225 6.79125L7.1875 8.04125C7.28438 8.09688 7.39187 8.125 7.5 8.125C7.60813 8.125 7.71562 8.09688 7.8125 8.04125Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_31385_2590">
          <rect width="15" height="15" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
