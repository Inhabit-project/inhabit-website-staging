import React, { useState } from "react";

const StewardshipNFTCard: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <div className="relative w-full max-w-[27rem] mx-auto">
      {/* Flip Card Container */}
      <div 
        className={`flip-card-container w-full max-w-[622px] h-[800px] mobile-h-screen perspective-1000 ${isFlipped ? 'flipped' : ''}`}
        onClick={handleCardClick}
      >
        {/* Flip Card */}
        <div className="flip-card w-full h-full relative transform-style-preserve-3d transition-transform duration-700 ease-in-out">
          
          {/* Front Card */}
          <div className="card-front absolute inset-0 bg-white rounded-[2rem] border border-[#3A8F54] overflow-hidden backface-hidden z-10 flex flex-col items-center justify-center ">
            {/* Background Gradient */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, rgba(0, 61, 21, 1) 2%, rgba(21, 73, 0, 1) 51%, rgba(0, 58, 20, 1) 99%)'
              }} 
            />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center h-full justify-between">
              {/* Header Text */}
              <div className="flex flex-col items-center gap-2 pt-16 px-8">
                <h3 className="text-[#F6FFEA] font-abel eyebrow font-normal uppercase tracking-[0.07em] text-center">
                  STEWARDSHIP
                </h3>
                <h2 className="text-[#F6FFEA] font-montserrat text-2xl font-normal leading-[1em] text-center">
                  NFTS
                </h2>
              </div>

              {/* NFT Illustration */}
              <div className="relative w-full flex-1 flex items-center justify-center">
                <img
                  src="/assets/stewardship-nft.avif"
                  alt="Stewardship NFT illustration"
                  className="w-full h-auto max-h-[350px] object-cover"
                />
              </div>

              {/* Description Text */}
              <div className="flex items-center justify-center px-8 pb-16">
                <p className="text-[#F6FFEA] font-nunito-sans text-base font-light leading-[1.3em] text-left max-w-[500px]">
                  Your digital key to lifelong stewardship of unique ecosystems. Each NFT represents a direct connection to a specific conservation area, granting you rights and exclusive access to biocultural experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Back Card */}
          <div className="card-back absolute inset-0 bg-white rounded-[2rem] border border-[#3A8F54] overflow-hidden backface-hidden z-0 rotate-y-180 flex flex-col items-center justify-center">
            {/* Background Gradient */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, rgba(0, 61, 21, 1) 2%, rgba(21, 73, 0, 1) 51%, rgba(0, 58, 20, 1) 99%)'
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col items-start w-full h-full justify-center overflow-y-auto">
              {/* Header Text */}
              <div className="mb-4">
                <h3 className="text-[#F6FFEA] font-abel text-sm font-normal uppercase tracking-[0.07em] text-center mb-1">
                  STEWARDSHIP
                </h3>
                <h2 className="text-[#F6FFEA] font-montserrat text-2xl font-normal leading-[1em] text-center mb-14">
                  Rights and Benefits
                </h2>
              </div>

              {/* Benefits List */}
              <div className="space-y-8">
                {/* Land rights and protector */}
                <div>
                  <h4 className="text-[#F6FFEA] font-montserrat body-M font-semibold mb-1">
                    Land rights and protector
                  </h4>
                  <p className="text-[#F6FFEA] font-nunito-sans text-sm font-light leading-[1.3em]">
                    As a lifelong steward you join a legal system of guarantee that recognises Nature as a subject with rights.
                  </p>
                </div>

                {/* Exclusive Access */}
                <div>
                  <h4 className="text-[#F6FFEA] font-montserrat body-M font-semibold mb-1">
                    Exclusive Access
                  </h4>
                  <p className="text-[#F6FFEA] font-nunito-sans text-sm font-light leading-[1.3em]">
                    Enjoy bio-cultural experiences, events, and workshops.
                  </p>
                </div>

                {/* Impact Monitoring */}
                <div>
                  <h4 className="text-[#F6FFEA] font-montserrat body-M font-semibold mb-1">
                    Impact Monitoring
                  </h4>
                  <p className="text-[#F6FFEA] font-nunito-sans text-sm font-light leading-[1.3em]">
                    Track protection progress through real-time data, geolocation, visual mapping, and key indicators.
                  </p>
                </div>

                {/* Stewardship by proxy */}
                <div>
                  <h4 className="text-[#F6FFEA] font-montserrat body-M font-semibold mb-1">
                    Stewardship by proxy
                  </h4>
                  <p className="text-[#F6FFEA] font-nunito-sans text-sm font-light leading-[1.3em]">
                    Governance rights allow you to have a say in decisions on land-use changes and Hub management shifts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for flip animation */}
      <style>{`
        .flip-card-container {
          perspective: 1000px;
        }
        
        .flip-card {
          transform-style: preserve-3d;
          transition: transform 0.6s ease-in-out;
        }
        
        /* Mobile height */
        @media (max-width: 768px) {
          .mobile-h-screen {
            height: 85vh;
          }
        }
        
        /* Desktop hover behavior */
        @media (hover: hover) and (pointer: fine) {
          .flip-card-container:hover .flip-card {
            transform: rotateY(180deg);
          }
        }
        
        /* Mobile click behavior */
        @media (hover: none) and (pointer: coarse) {
          .flip-card-container.flipped .flip-card {
            transform: rotateY(180deg);
          }
        }
        
        .card-front,
        .card-back {
          backface-visibility: hidden;
        }
        
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default StewardshipNFTCard;
