'use client';

interface HeaderDesktopProps {
  title?: string;
  description?: string;
}

export function HeaderDesktop({ title, description }: HeaderDesktopProps) {
  if (!title) return null;

  return (
    <div className="hidden lg:block bg-background-white border-b border-border">
      <div className="px-8 py-6 h-[96px] flex items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">{title}</h1>
          {description && (
            <p className="text-sm lg:text-base text-gray-600">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

