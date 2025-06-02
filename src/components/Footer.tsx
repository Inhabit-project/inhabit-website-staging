import React from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

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
                    <Formik
                      initialValues={{ email: '', privacy: false }}
                      validationSchema={Yup.object({
                        email: Yup.string().email('Invalid email address').required('Required'),
                        privacy: Yup.boolean().oneOf([true], 'You must accept the privacy policy'),
                      })}
                      onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
                        setStatus(undefined);
                        try {
                          // Mailchimp POST URL (replace with your own Mailchimp form action URL)
                          const mailchimpUrl = 'https://YOUR_MAILCHIMP_URL';
                          const formData = new FormData();
                          formData.append('EMAIL', values.email);
                          // Add other fields if needed
                          const response = await fetch(mailchimpUrl, {
                            method: 'POST',
                            mode: 'no-cors',
                            body: formData,
                          });
                          setStatus('Thank you for subscribing!');
                          resetForm();
                        } catch (error) {
                          setStatus('There was an error. Please try again.');
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                    >
                      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, status }) => (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                          <input
                            type="email"
                            name="email"
                            placeholder="Your email"
                            className="input-main"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                          />
                          {errors.email && touched.email && (
                            <div className="text-orange-400 text-xs">{errors.email}</div>
                          )}
                          <label className="flex items-center gap-2 cursor-pointer">
                            <div className="relative w-[1.125rem] h-[1.125rem] border-[0.5px] border-[#F6FFEA] rounded bg-white/5 backdrop-blur-lg">
                              <input
                                type="checkbox"
                                name="privacy"
                                className="absolute opacity-0 w-full h-full cursor-pointer"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                checked={values.privacy}
                              />
                              <span className={`absolute left-0 top-0 w-full h-full flex items-center justify-center pointer-events-none ${values.privacy ? '' : 'hidden'}`}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 7L6 10L11 4" stroke="#F6FFEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </span>
                            </div>
                            <span className="base-text text-light text-xs ">
                              I accept the privacy policy
                            </span>
                          </label>
                          {errors.privacy && touched.privacy && (
                            <div className="text-orange-400 text-xs">{errors.privacy}</div>
                          )}
                          <button type="submit" className="btn-primary-sm mt-2 w-[12rem]" disabled={isSubmitting}>
                            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                          </button>
                          {status && <div className="text-green-400 text-xs mt-2">{status}</div>}
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>

                {/* Bottom Group */}
                <div>
                  {/* Social Links */}
                  <div className="flex gap-12">
                    <a href="https://x.com/Inhabit_Hubs" target="_blank" rel="noopener noreferrer" className="w-5 h-5 hover:opacity-80">
                      <img src="/assets/icons/twitter.svg" alt="Twitter" className="w-full h-full" />
                    </a>
                    <a href="https://www.linkedin.com/company/inhabithubs" target="_blank" rel="noopener noreferrer" className="w-5 h-5 hover:opacity-80">
                      <img src="/assets/icons/linkedin.svg" alt="LinkedIn" className="w-full h-full" />
                    </a>
                    <a href="https://medium.com/@INHABIT_hubs" target="_blank" rel="noopener noreferrer" className="w-5 h-5 hover:opacity-80">
                      <img src="/assets/icons/medium.svg" alt="Medium" className="w-full h-full" />
                    </a>
                    <a href="https://www.instagram.com/inhabit_hubs" target="_blank" rel="noopener noreferrer" className="w-5 h-5 hover:opacity-80">
                      <img src="/assets/icons/instagram.svg" alt="Instagram" className="w-full h-full" />
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