import React from "react";

const StewardshipNFTCard: React.FC = () => {
  return (
    <div className="relative w-full max-w-[27rem] mx-auto">
      {/* Flip Card Container */}
      <div className="flip-card-container w-full max-w-[622px] h-[800px] perspective-1000">
        {/* Flip Card */}
        <div className="flip-card w-full h-full relative transform-style-preserve-3d transition-transform duration-700 ease-in-out">
          
          {/* Front Card */}
          <div className="card-front absolute inset-0 bg-white rounded-[57px] border-2 border-[#3A8F54] overflow-hidden backface-hidden z-10 flex flex-col items-center justify-center">
            {/* Background Gradient */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, rgba(0, 61, 21, 1) 2%, rgba(21, 73, 0, 1) 51%, rgba(0, 58, 20, 1) 99%)'
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col items-center h-full justify-center">
              {/* Header Text */}
              <div className="flex flex-col items-center gap-2 mb-6">
                <h3 className="text-[#F6FFEA] font-abel eyebrow font-normal uppercase tracking-[0.07em] text-center">
                  STEWARDSHIP
                </h3>
                <h2 className="text-[#F6FFEA] font-montserrat text-2xl font-normal leading-[1em] text-center">
                  NFTS
                </h2>
              </div>

              {/* NFT Illustration */}
              <div className="relative w-full max-w-[400px] mb-6">
                <img
                  src="/assets/stewardship-nft.avif"
                  alt="Stewardship NFT illustration"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Description Text */}
              <p className="text-[#F6FFEA] font-nunito-sans body-M font-light leading-[1.3em] text-left max-w-[500px]">
                Your digital key to lifelong stewardship of unique ecosystems. Each NFT represents a direct connection to a specific conservation area, granting you rights and exclusive access to biocultural experiences.
              </p>
            </div>
          </div>

          {/* Back Card */}
          <div className="card-back absolute inset-0 bg-white rounded-[57px] border-2 border-[#3A8F54] overflow-hidden backface-hidden z-0 rotate-y-180 flex flex-col items-center justify-center">
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
                <h3 className="text-[#F6FFEA] font-abel text-sm font-normal uppercase tracking-[0.07em] text-left mb-1">
                  STEWARDSHIP
                </h3>
                <h2 className="text-[#F6FFEA] font-montserrat text-lg font-normal leading-[1em] text-left">
                  Rights and Benefits
                </h2>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                {/* Land rights and protector */}
                <div>
                  <h4 className="text-[#F6FFEA] font-montserrat text-base font-semibold mb-1">
                    Land rights and protector
                  </h4>
                  <p className="text-[#F6FFEA] font-nunito-sans text-sm font-light leading-[1.3em]">
                    As a lifelong steward you join a legal system of guarantee that recognises Nature as a subject with rights.
                  </p>
                </div>

                {/* Exclusive Access */}
                <div>
                  <h4 className="text-[#F6FFEA] font-montserrat text-base font-semibold mb-1">
                    Exclusive Access
                  </h4>
                  <p className="text-[#F6FFEA] font-nunito-sans text-sm font-light leading-[1.3em]">
                    Enjoy bio-cultural experiences, events, and workshops.
                  </p>
                </div>

                {/* Impact Monitoring */}
                <div>
                  <h4 className="text-[#F6FFEA] font-montserrat text-base font-semibold mb-1">
                    Impact Monitoring
                  </h4>
                  <p className="text-[#F6FFEA] font-nunito-sans text-sm font-light leading-[1.3em]">
                    Track protection progress through real-time data, geolocation, visual mapping, and key indicators.
                  </p>
                </div>

                {/* Stewardship by proxy */}
                <div>
                  <h4 className="text-[#F6FFEA] font-montserrat text-base font-semibold mb-1">
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
        
        .flip-card-container:hover .flip-card {
          transform: rotateY(180deg);
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
