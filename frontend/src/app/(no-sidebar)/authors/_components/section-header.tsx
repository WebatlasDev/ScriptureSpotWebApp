'use client';

interface SectionHeaderProps {
  title: string;
  color: string;
  icon?: React.ReactNode;
}

export default function SectionHeader({ title, color, icon }: SectionHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        {icon ? (
          <div className="text-2xl">{icon}</div>
        ) : (
          <div 
            className="w-6 h-6 rounded"
            style={{ backgroundColor: color }}
          />
        )}
        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>
      </div>
      <div 
        className="h-0.5 rounded-full mb-6 transition-all duration-300"
        style={{ 
          background: `linear-gradient(to right, ${color}40, transparent)` 
        }}
      />
    </>
  );
}