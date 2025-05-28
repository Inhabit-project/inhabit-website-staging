import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full min-h-screen bg-secondary no-snap">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/assets/footer-bg.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1
        }}
      />

      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-4xl border-[0.5px] border-white/20" />

      {/* Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col py-[5rem]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row px-6 lg:px-0">
          {/* Left Side - Logo */}
          <div className="w-full lg:w-[45%] pt-16 lg:pl-[clamp(1.5rem,5vw,6.25rem)]">
            <img src="/assets/figma-images/logo-footer.svg" alt="INHABIT" className="h-[4rem]" />
          </div>

          {/* Right Side Content */}
          <div className="w-full lg:w-[55%] flex flex-col mt-16 lg:mt-0">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row lg:pr-[clamp(1.5rem,5vw,6.25rem)] gap-16 lg:gap-24">
              {/* Combined Section: Connect, Location, Newsletter, Social */}
              <div className="w-full lg:w-[45%] flex flex-col justify-between lg:py-16">
                {/* Top Group */}
                <div className="space-y-8">
                  {/* Connect Section */}
                  <div>
                    <h3 className="eyebrow text-light mb-2">
                      CONNECT
                    </h3>
                    <a
                      href="mailto:hello@inhabit.one"
                      className="base-text text-light hover:opacity-80"
                    >
                      hello@inhabit.one
                    </a>
                  </div>

                  {/* Location Section */}
                  <div>
                    <h3 className="eyebrow text-light mb-2">
                      LOCATION
                    </h3>
                    <p className="base-text text-light">
                    Tierra Kilwa, Palomino, La Guajira, Colombia
                    </p>
                  </div>
                </div>

                {/* Middle Group */}
                <div className="my-16 lg:my-0">
                  {/* Newsletter Section */}
                  <div>
                    <h3 className="eyebrow text-light mb-2">
                      NEWSLETTER
                    </h3>
                    <p className="base-text text-light mb-4">
                    Suscribe to have the best updates from us!
                    </p>
                    <div className="flex flex-col gap-3">
                      <input
                        type="email"
                        placeholder="Your email"
                        className="input-main"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="relative w-[1.125rem] h-[1.125rem] border-[0.5px] border-[#F6FFEA] rounded bg-white/5 backdrop-blur-lg">
                          <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer" />
                        </div>
                        <span className="base-text text-light text-xs ">
                        I accept the privacy policy
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bottom Group */}
                <div>
                  {/* Social Links */}
                  <div className="flex gap-6">
                    <a href="#" className="w-5 h-5 hover:opacity-80">
                      <img src="/assets/figma-images/twitter.svg" alt="Twitter" className="w-full h-full" />
                    </a>
                    <a href="#" className="w-5 h-5 hover:opacity-80">
                      <img src="/assets/figma-images/linkedin.svg" alt="LinkedIn" className="w-full h-full" />
                    </a>
                    <a href="#" className="w-5 h-5 hover:opacity-80">
                      <img src="/assets/figma-images/medium.svg" alt="Medium" className="w-full h-full" />
                    </a>
                    <a href="#" className="w-5 h-5 hover:opacity-80">
                      <img src="/assets/figma-images/youtube.svg" alt="YouTube" className="w-full h-full" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Menu Section */}
              <div className="w-full lg:w-[45%] lg:py-16">
                <h3 className="eyebrow text-light mb-2">
                  MENU
                </h3>
                <nav className="flex flex-col gap-4 ">
                  {[
                    { label: 'home', path: '/' },
                    { label: 'hubs', path: '/hubs' },
                    { label: 'stewardship Nft', path: '/stewardship-nft' },
                    { label: 'about Us', path: '/about' },
                    { label: 'projects', path: '/projects' },
                    { label: 'blog', path: '/blog' },
                    { label: 'contact', path: '/contact' }
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="base-text text-light hover:opacity-80 capitalize base-text"
                    >
                      <span className="base-text">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="h-[5.5rem] px-6 lg:pl-[clamp(1.5rem,5vw,6.25rem)] flex items-center">
          <p className="nav-text text-light text-xs">
            COPYRIGHT 2025 ALL RIGHTS RESERVED DESIGNED BY FERNANDA HERRERA
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 