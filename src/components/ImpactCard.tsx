import React from 'react';

interface ImpactCardProps {
  number: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ number, icon, title, subtitle, description }) => (
  <div className="relative bg-green-soft rounded-[var(--radius-2xl)] p-10 flex flex-col gap-8 min-h-[340px] shadow-md w-full">
    {/* Icon */}
    <div className="absolute top-10 right-10 w-12 h-12">
      <img src={icon} alt="" className="w-full h-full object-contain" />
    </div>
    {/* Number */}
    <span className="font-abel uppercase tracking-[0.07em] text-base text-secondary">{number}</span>
    {/* Title + Subtitle */}
    <h3
      className="whitespace-pre-line"
      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color: 'var(--color-secondary)', fontSize: '2.5rem', lineHeight: '1.1' }}
    >
      {title}
      <br />
      <span style={{ fontWeight: 400 }}>{subtitle}</span>
    </h3>
    {/* Description */}
    <p className="font-nunito font-light text-[1.3125rem] leading-[1.4] text-secondary">{description}</p>
  </div>
);

export default ImpactCard; 