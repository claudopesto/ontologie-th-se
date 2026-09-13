import { AXES } from '@/lib/axes';

export default function AxeSummary({ selectedAxe }) {
  if (selectedAxe === 'all') return null;

  const axe = AXES.find((a) => a.id === selectedAxe);
  if (!axe) return null;

  return (
    <div
      className="absolute top-3 left-3 right-16 z-10 bg-white/97 rounded-lg shadow-lg p-3 max-w-md"
      style={{ borderLeft: `4px solid ${axe.color}` }}
    >
      <span
        className="inline-block text-white text-[0.68rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1"
        style={{ backgroundColor: axe.color }}
      >
        {axe.shortLabel}
      </span>
      <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{axe.label}</h3>
      <p className="text-xs text-gray-600 leading-snug">{axe.description}</p>
    </div>
  );
}