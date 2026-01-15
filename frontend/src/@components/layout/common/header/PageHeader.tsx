interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">{title}</h1>
      {description && (
        <p className="text-sm lg:text-base text-gray-600">{description}</p>
      )}
    </div>
  );
}

