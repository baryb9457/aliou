interface KamLogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

const sizeMap = {
  sm: { box: 'h-8 w-8', text: 'text-lg', initials: 'text-[0.7rem]' },
  md: { box: 'h-10 w-10', text: 'text-xl', initials: 'text-xs' },
  lg: { box: 'h-14 w-14', text: 'text-2xl', initials: 'text-sm' },
};

export default function KamLogo({
  className = '',
  markClassName = '',
  textClassName = '',
  size = 'md',
  showWordmark = true,
}: KamLogoProps) {
  const current = sizeMap[size];

  return (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      <span className={`relative ${current.box} ${markClassName}`.trim()}>
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500 shadow-[0_16px_30px_rgba(20,184,166,0.24)]" />
        <span className="absolute inset-[1.5px] rounded-[15px] border border-white/20" />
        <span className={`absolute inset-0 flex items-center justify-center font-black tracking-[0.28em] text-white ${current.initials}`.trim()}>
          KAM
        </span>
      </span>

      {showWordmark && (
        <span className={`flex flex-col leading-none ${textClassName}`.trim()}>
          <span className={`font-black tracking-[0.22em] ${current.text}`.trim()}>KAM</span>
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] opacity-70">Services</span>
        </span>
      )}
    </span>
  );
}