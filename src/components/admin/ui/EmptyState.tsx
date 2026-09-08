import { ComponentType, ReactNode } from "react";

interface EmptyStateProps {
  icon?: ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-full glass flex items-center justify-center mb-4">
          <Icon size={20} className="text-ink-500" />
        </div>
      )}
      <h3 className="text-ink-100 font-medium mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-500 max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  );
}
