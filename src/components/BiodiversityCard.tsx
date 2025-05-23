import React from 'react';
import { motion } from 'framer-motion';
import biodiversityIcon from '../assets/icons/biodiversity-icon.svg';

interface BiodiversityCardProps {
  number?: string;
  title?: string;
  description?: string;
  index?: number;
  isInView?: boolean;
}

const cardVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
};

const BiodiversityCard: React.FC<BiodiversityCardProps> = ({
  number = "001",
  title = "Biodiversity\nHotspots",
  description = "Every HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times.\n\nThese \"living seed hubs\" can be used by animals and humans to transport and disperse seeds, spreading biodiversity throughout the Corridor.",
  index = 0,
  isInView = true
}) => {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="w-full bg-[#DBEAB2] border border-[#B6B6B6] radius-2xl p-6 md:p-[50px]"
    >
      <div className="flex flex-col md:flex-row items-start justify-between">
        <span className="font-nunito-sans font-light text-base tracking-[-0.04em] text-black mb-6 md:mb-0">
          {number}
        </span>
        <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-8 md:gap-[227px]">
          <div className="w-full md:w-[620px] flex flex-col gap-6 md:gap-[31px]">
            <h3 className="font-prompt font-light text-[32px] md:text-[40px] leading-[1.2] text-[#1C3625] whitespace-pre-line">
              {title}
            </h3>
            <p className="font-nunito-sans font-light text-base leading-[1.24] text-black whitespace-pre-line">
              {description}
            </p>
          </div>
          <div className="w-[160px] h-[160px] md:w-[227px] md:h-[227px] flex items-center justify-center self-center">
            <img 
              src={biodiversityIcon} 
              alt="Biodiversity Icon"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BiodiversityCard; 