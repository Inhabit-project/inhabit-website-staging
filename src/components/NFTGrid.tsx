import React from 'react';

const NFTGrid: React.FC = () => {
  return (
    <section className="relative w-full bg-[#D57300] mt-0">
      <div className="max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-40">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-[13.3125rem] w-full mb-[2.5rem]">
            <h2 className="heading-2 text-light max-w-[40.9375rem]">
            Our innovative <br /><strong>NFTs</strong>
            </h2>
            <p className="body-M text-light max-w-[35rem]">
            Stewardship NFTs are blockchain-verified contracts that give fractional rights 
            to protect ecosystems on tokenized plots of land.
            </p>
          </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* NFT Card 1 */}
          <div className="relative bg-white rounded-[36.71px] p-8 border border-[#1C3625]">
            <div className="absolute inset-0 bg-[#162F08] rounded-[36.71px] opacity-80" />
            <div className="relative flex flex-col items-end gap-4">
              <div className="w-full flex flex-col gap-8">
                <h3 className="text-[2.94rem] font-medium text-center text-white">TITI</h3>
                <div className="relative w-full aspect-[4/3] rounded-[14.68px] overflow-hidden border border-white/15">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0C] to-transparent" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-[3.44rem] font-medium text-center text-white tracking-[-2.5%]">$ 50 USD</p>
                    <div className="flex justify-center items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#DBEAB2" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-[1rem] text-center text-[#DBEAB2] tracking-[-2.5%]">2439 Available membership</p>
                </div>
                <button className="w-full bg-[#D57300] backdrop-blur-[5.36px] rounded-[58.09px] p-2">
                  <div className="flex items-center justify-center gap-2 px-4 py-2">
                    <span className="text-[1.12rem] text-[#F5F5F5] tracking-[2%]">CHECK THIS NFT</span>
                  </div>
                </button>
              </div>
              <div className="absolute top-2 right-2">
                <div className="bg-white/20 backdrop-blur-[31.64px] rounded-[37.97px] p-3 border border-[#1C3625]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5L5 19M5 5L19 19" stroke="#1C3625" strokeWidth="1.9"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* NFT Card 2 */}
          <div className="relative bg-white rounded-[36.71px] p-8 border border-[#1C3625]">
            <div className="absolute inset-0 bg-[#162F08] rounded-[36.71px] opacity-80" />
            <div className="relative flex flex-col items-end gap-4">
              <div className="w-full flex flex-col gap-8">
                <h3 className="text-[2.94rem] font-medium text-center text-white">TITI</h3>
                <div className="relative w-full aspect-[4/3] rounded-[14.68px] overflow-hidden border border-white/15">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0C] to-transparent" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-[3.44rem] font-medium text-center text-white tracking-[-2.5%]">$ 50 USD</p>
                    <div className="flex justify-center items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#DBEAB2" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-[1rem] text-center text-[#DBEAB2] tracking-[-2.5%]">2439 Available membership</p>
                </div>
                <button className="w-full bg-[#D57300] backdrop-blur-[5.36px] rounded-[58.09px] p-2">
                  <div className="flex items-center justify-center gap-2 px-4 py-2">
                    <span className="text-[1.12rem] text-[#F5F5F5] tracking-[2%]">CHECK THIS NFT</span>
                  </div>
                </button>
              </div>
              <div className="absolute top-2 right-2">
                <div className="bg-white/20 backdrop-blur-[31.64px] rounded-[37.97px] p-3 border border-[#1C3625]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5L5 19M5 5L19 19" stroke="#1C3625" strokeWidth="1.9"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* NFT Card 3 */}
          <div className="relative bg-white rounded-[36.71px] p-8 border border-[#1C3625]">
            <div className="absolute inset-0 bg-[#162F08] rounded-[36.71px] opacity-80" />
            <div className="relative flex flex-col items-end gap-4">
              <div className="w-full flex flex-col gap-8">
                <h3 className="text-[2.94rem] font-medium text-center text-white">TITI</h3>
                <div className="relative w-full aspect-[4/3] rounded-[14.68px] overflow-hidden border border-white/15">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0C] to-transparent" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-[3.44rem] font-medium text-center text-white tracking-[-2.5%]">$ 50 USD</p>
                    <div className="flex justify-center items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#DBEAB2" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-[1rem] text-center text-[#DBEAB2] tracking-[-2.5%]">2439 Available membership</p>
                </div>
                <button className="w-full bg-[#D57300] backdrop-blur-[5.36px] rounded-[58.09px] p-2">
                  <div className="flex items-center justify-center gap-2 px-4 py-2">
                    <span className="text-[1.12rem] text-[#F5F5F5] tracking-[2%]">CHECK THIS NFT</span>
                  </div>
                </button>
              </div>
              <div className="absolute top-2 right-2">
                <div className="bg-white/20 backdrop-blur-[31.64px] rounded-[37.97px] p-3 border border-[#1C3625]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5L5 19M5 5L19 19" stroke="#1C3625" strokeWidth="1.9"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* NFT Card 4 */}
          <div className="relative bg-white rounded-[36.71px] p-8 border border-[#1C3625]">
            <div className="absolute inset-0 bg-[#162F08] rounded-[36.71px] opacity-80" />
            <div className="relative flex flex-col items-end gap-4">
              <div className="w-full flex flex-col gap-8">
                <h3 className="text-[2.94rem] font-medium text-center text-white">TITI</h3>
                <div className="relative w-full aspect-[4/3] rounded-[14.68px] overflow-hidden border border-white/15">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0C] to-transparent" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-[3.44rem] font-medium text-center text-white tracking-[-2.5%]">$ 50 USD</p>
                    <div className="flex justify-center items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#DBEAB2" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-[1rem] text-center text-[#DBEAB2] tracking-[-2.5%]">2439 Available membership</p>
                </div>
                <button className="w-full bg-[#D57300] backdrop-blur-[5.36px] rounded-[58.09px] p-2">
                  <div className="flex items-center justify-center gap-2 px-4 py-2">
                    <span className="text-[1.12rem] text-[#F5F5F5] tracking-[2%]">CHECK THIS NFT</span>
                  </div>
                </button>
              </div>
              <div className="absolute top-2 right-2">
                <div className="bg-white/20 backdrop-blur-[31.64px] rounded-[37.97px] p-3 border border-[#1C3625]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5L5 19M5 5L19 19" stroke="#1C3625" strokeWidth="1.9"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NFTGrid; 