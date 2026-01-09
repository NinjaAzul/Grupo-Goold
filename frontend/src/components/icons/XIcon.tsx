import React from 'react';

interface XIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const XIcon: React.FC<XIconProps> = ({
  className = 'w-3 h-3',
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      className={className}
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.64622 6.00017L9.88722 0.816668C10.0622 0.603168 10.0302 0.288168 9.81622 0.113168C9.60222 -0.0608321 9.28772 -0.0303321 9.11272 0.184168L5.00022 5.21067L0.887216 0.183668C0.711716 -0.0308321 0.397216 -0.0613321 0.183716 0.112668C-0.0302838 0.288168 -0.061784 0.602668 0.112716 0.816168L4.35422 6.00017L0.113216 11.1837C-0.0617839 11.3972 -0.0297839 11.7122 0.184216 11.8872C0.396716 12.0612 0.712216 12.0312 0.887716 11.8162L5.00022 6.78967L9.11322 11.8162C9.28872 12.0312 9.60422 12.0607 9.81672 11.8872C10.0307 11.7117 10.0622 11.3972 9.88772 11.1837L5.64622 6.00017Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

