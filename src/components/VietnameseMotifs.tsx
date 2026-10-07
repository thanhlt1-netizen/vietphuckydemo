import React from 'react';

export const VietnameseMotifs: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none" aria-hidden="true">
      {/* Deep Earth Brown base with soft warm atmospheric ambient radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#322318] via-[#201711] to-[#150E0A] opacity-100" />

      {/* Luminous Morning Sun Aura & Fresh Jade spheres */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-gradient-to-b from-[#B8935A]/25 via-[#627C56]/15 to-transparent blur-3xl" />
      <div className="absolute top-1/2 -left-48 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#627C56]/20 via-[#465A3D]/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-[#8C6D49]/25 via-[#553E2B]/15 to-transparent blur-3xl" />

      {/* Faint Dong Son bronze drum cosmic ring motif in warm gold / army green tint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-[#78976A]/15 pointer-events-none">
        <div className="absolute inset-8 rounded-full border border-dashed border-[#B8935A]/15" />
        <div className="absolute inset-24 rounded-full border border-[#78976A]/12" />
        <div className="absolute inset-44 rounded-full border border-dashed border-[#B8935A]/12" />
        <div className="absolute inset-64 rounded-full border border-[#78976A]/10" />
      </div>

      {/* Subtle traditional stylized cloud / wave corner accents */}
      <svg
        className="absolute top-6 left-6 w-36 h-36 text-[#78976A]/15 select-none"
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M10 60 C30 40, 50 80, 70 60 C90 40, 110 70, 110 70" />
        <path d="M20 75 C40 55, 60 95, 80 75" opacity="0.7" />
      </svg>

      <svg
        className="absolute bottom-6 right-6 w-44 h-44 text-[#B8935A]/20 select-none"
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="60" cy="60" r="50" strokeDasharray="3 4" />
        <circle cx="60" cy="60" r="34" />
        <circle cx="60" cy="60" r="18" strokeDasharray="2 3" />
      </svg>
    </div>
  );
};
