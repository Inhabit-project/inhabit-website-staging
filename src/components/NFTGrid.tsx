import React from 'react';
import { Link } from 'react-router-dom';

const NFTGrid: React.FC = () => {
  return (
    <section className="relative w-full background-gradient-dark mt-0">
      <div className="max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-40">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
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
          <div className="relative" style={{ background: 'var(--color-bright-green)' , borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
            <div className="absolute top-2 right-2 hover-scale-up">
              <a href="#" className="block ">
                <div className="bg-white/20 backdrop-blur-2xl rounded-[var(--radius-3xl)] p-1 border">
                  <svg 
                    width="35" 
                    height="35" 
                    viewBox="0 0 35 35" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M10.5039 24.543L24.4709 10.576" 
                      stroke="#F6FFEA" 
                      strokeWidth="2.01125" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M10.5039 10.576L24.4709 10.576L24.4709 24.543" 
                      stroke="#F6FFEA" 
                      strokeWidth="2.01125" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </a>
            </div>
            <div className="absolute inset-0 rounded-[var(--radius-2xl)] opacity-80" />
            <div className="relative flex flex-col items-end gap-4">
              <div className="w-full flex flex-col gap-8">
                <h3 className="text-[2rem] font-montserrat text-center text-white">TITI</h3>
                <div className="relative w-full aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden border border-white/15">
                  <img
                    src="/assets/NFT-CARD-1.png"
                    alt="NFT Card 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-[3.5rem] font-abel text-center text-white tracking-[-2px]">$ 50 USD</p>
                    <div className="flex justify-center items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#DBEAB2" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[1rem] text-center text-green-soft tracking-[-2.5%]">2439 Available membership</p>
                </div>
                <Link to="/checkout" className="btn-primary w-full flex items-center justify-center group">
                  <span className="button-text group-hover:text-secondary transition-colors duration-300">
                    CHECK THIS NFT
                  </span>
                </Link>
              </div>
            </div>
          </div>
          {/* NFT Card 2 */}
          <div className="relative" style={{ background: 'var(--color-bright-green)' , borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
            <div className="absolute top-2 right-2 hover-scale-up">
              <a href="#" className="block ">
                <div className="bg-white/20 backdrop-blur-2xl rounded-[var(--radius-3xl)] p-1 border">
                  <svg 
                    width="35" 
                    height="35" 
                    viewBox="0 0 35 35" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M10.5039 24.543L24.4709 10.576" 
                      stroke="#F6FFEA" 
                      strokeWidth="2.01125" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M10.5039 10.576L24.4709 10.576L24.4709 24.543" 
                      stroke="#F6FFEA" 
                      strokeWidth="2.01125" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </a>
            </div>
            <div className="absolute inset-0 rounded-[var(--radius-2xl)] opacity-80" />
            <div className="relative flex flex-col items-end gap-4">
              <div className="w-full flex flex-col gap-8">
                <h3 className="text-[2rem] font-montserrat text-center text-white">TITI</h3>
                <div className="relative w-full aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden border border-white/15">
                  <img
                    src="/assets/NFT-CARD-1.png"
                    alt="NFT Card 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-[3.5rem] font-abel text-center text-white tracking-[-2px]">$ 50 USD</p>
                    <div className="flex justify-center items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#DBEAB2" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[1rem] text-center text-green-soft tracking-[-2.5%]">2439 Available membership</p>
                </div>
                <Link to="/checkout" className="btn-primary w-full flex items-center justify-center group">
                  <span className="button-text group-hover:text-secondary transition-colors duration-300">
                    CHECK THIS NFT
                  </span>
                </Link>
              </div>
            </div>
          </div>
          {/* NFT Card 3 */}
          <div className="relative" style={{ background: 'var(--color-bright-green)' , borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
            <div className="absolute top-2 right-2 hover-scale-up">
              <a href="#" className="block ">
                <div className="bg-white/20 backdrop-blur-2xl rounded-[var(--radius-3xl)] p-1 border">
                  <svg 
                    width="35" 
                    height="35" 
                    viewBox="0 0 35 35" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M10.5039 24.543L24.4709 10.576" 
                      stroke="#F6FFEA" 
                      strokeWidth="2.01125" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M10.5039 10.576L24.4709 10.576L24.4709 24.543" 
                      stroke="#F6FFEA" 
                      strokeWidth="2.01125" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </a>
            </div>
            <div className="absolute inset-0 rounded-[var(--radius-2xl)] opacity-80" />
            <div className="relative flex flex-col items-end gap-4">
              <div className="w-full flex flex-col gap-8">
                <h3 className="text-[2rem] font-montserrat text-center text-white">TITI</h3>
                <div className="relative w-full aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden border border-white/15">
                  <img
                    src="/assets/NFT-CARD-1.png"
                    alt="NFT Card 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-[3.5rem] font-abel text-center text-white tracking-[-2px]">$ 50 USD</p>
                    <div className="flex justify-center items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#DBEAB2" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[1rem] text-center text-green-soft tracking-[-2.5%]">2439 Available membership</p>
                </div>
                <Link to="/checkout" className="btn-primary w-full flex items-center justify-center group">
                  <span className="button-text group-hover:text-secondary transition-colors duration-300">
                    CHECK THIS NFT
                  </span>
                </Link>
              </div>
            </div>
          </div>
         
          {/* NFT Card 4 */}
          <div className="relative" style={{ background: 'var(--color-bright-green)' , borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
            <div className="absolute top-2 right-2 hover-scale-up">
              <a href="#" className="block ">
                <div className="bg-white/20 backdrop-blur-2xl rounded-[var(--radius-3xl)] p-1 border">
                  <svg 
                    width="35" 
                    height="35" 
                    viewBox="0 0 35 35" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M10.5039 24.543L24.4709 10.576" 
                      stroke="#F6FFEA" 
                      strokeWidth="2.01125" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M10.5039 10.576L24.4709 10.576L24.4709 24.543" 
                      stroke="#F6FFEA" 
                      strokeWidth="2.01125" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </a>
            </div>
            <div className="absolute inset-0 rounded-[var(--radius-2xl)] opacity-80" />
            <div className="relative flex flex-col items-end gap-4">
              <div className="w-full flex flex-col gap-8">
                <h3 className="text-[2rem] font-montserrat text-center text-white">TITI</h3>
                <div className="relative w-full aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden border border-white/15">
                  <img
                    src="/assets/NFT-CARD-1.png"
                    alt="NFT Card 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-[3.5rem] font-abel text-center text-white tracking-[-2px]">$ 50 USD</p>
                    <div className="flex justify-center items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#DBEAB2" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B6B6B6" strokeWidth="0.45" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[1rem] text-center text-green-soft tracking-[-2.5%]">2439 Available membership</p>
                </div>
                <Link to="/checkout" className="btn-primary w-full flex items-center justify-center group">
                  <span className="button-text group-hover:text-secondary transition-colors duration-300">
                    CHECK THIS NFT
                  </span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NFTGrid; 