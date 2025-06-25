import React, { useRef, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { subscribeToMailchimp } from "@/services/mailchimpService";
import { handleNewsletterSubmit } from "@/utils/newsletter";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  
  // Refs for animations
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;

    // Set initial states
    gsap.set(logoRef.current, {
      opacity: 0,
      y: 50
    });

    gsap.set([connectRef.current, locationRef.current, newsletterRef.current, socialRef.current, menuRef.current], {
      opacity: 0,
      y: 50
    });

    gsap.set(copyrightRef.current, {
      opacity: 0,
      y: 20
    });

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top center",
        end: "center center",
        toggleActions: "play none none reverse"
      }
    });

    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .to([connectRef.current, locationRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.4")
    .to(newsletterRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    .to(socialRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    .to(menuRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6")
    .to(copyrightRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4");

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoading]);

  return (
    <footer ref={footerRef} className="relative w-full min-h-screen bg-secondary no-snap">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/assets/footer-bg.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
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
            <img ref={logoRef} src="/assets/figma-images/logo-footer.svg" alt="INHABIT" className="h-[4rem]" />
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
                  <div ref={connectRef}>
                    <h3 className="eyebrow text-light mb-2">
                      {t("mainPage.footer.connect")}
                    </h3>
                    <a
                      href="mailto:hello@inhabit.one"
                      className="base-text text-light hover:opacity-80"
                    >
                      hello@inhabit.one
                    </a>
                  </div>

                  {/* Location Section */}
                  <div ref={locationRef}>
                    <h3 className="eyebrow text-light mb-2">
                      {t("mainPage.footer.location")}
                    </h3>
                    <p className="base-text text-light">
                      {t("mainPage.footer.locationText")}
                    </p>
                  </div>
                </div>

                {/* Middle Group */}
                <div ref={newsletterRef} className="my-16 lg:my-0">
                  {/* Newsletter Section */}
                  <div>
                    <h3 className="eyebrow text-light mb-2">
                      {t("mainPage.footer.newsletter.title")}
                    </h3>
                    <p className="base-text text-light mb-4">
                      {t("mainPage.footer.newsletter.text")}
                    </p>
                    <Formik
                      initialValues={{ email: "", privacy: false }}
                      validationSchema={Yup.object({
                        email: Yup.string()
                          .email(
                            t(
                              "mainPage.footer.newsletter.email.validations.invalid"
                            )
                          )
                          .required(
                            t(
                              "mainPage.footer.newsletter.email.validations.required"
                            )
                          ),
                        privacy: Yup.boolean().oneOf(
                          [true],
                          t(
                            "mainPage.footer.newsletter.privacy.validations.required"
                          )
                        ),
                      })}
                      onSubmit={(values, actions) =>
                        handleNewsletterSubmit(
                          values,
                          actions,
                          t,
                          subscribeToMailchimp,
                          i18n.language
                        )
                      }
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        status,
                      }) => (
                        <form
                          onSubmit={handleSubmit}
                          className="flex flex-col gap-3"
                        >
                          <input
                            type="email"
                            name="email"
                            placeholder={t(
                              "mainPage.footer.newsletter.email.placeholder"
                            )}
                            className="input-main"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                          />
                          {errors.email && touched.email && (
                            <div className="text-orange-400 text-xs">
                              {errors.email}
                            </div>
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
                              <span
                                className={`absolute left-0 top-0 w-full h-full flex items-center justify-center pointer-events-none ${
                                  values.privacy ? "" : "hidden"
                                }`}
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3 7L6 10L11 4"
                                    stroke="#F6FFEA"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            </div>
                            <span className="base-text text-light text-xs ">
                              {t("mainPage.footer.acceptPolicy")}
                            </span>
                          </label>
                          {errors.privacy && touched.privacy && (
                            <div className="text-orange-400 text-xs">
                              {errors.privacy}
                            </div>
                          )}
                          <button
                            type="submit"
                            className="btn-primary-sm mt-2 w-[12rem]"
                            disabled={isSubmitting}
                          >
                            {isSubmitting
                              ? t("mainPage.footer.newsletter.subscribing")
                              : t("mainPage.footer.newsletter.subscribe")}
                          </button>
                          {status && (
                            <div className="text-green-400 text-xs mt-2">
                              {status}
                            </div>
                          )}
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>

                {/* Bottom Group */}
                <div ref={socialRef}>
                  {/* Social Links */}
                  <div className="flex gap-12">
                    <a
                      href="https://x.com/Inhabit_Hubs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-5 h-5 hover:opacity-80"
                    >
                      <img
                        src="/assets/icons/twitter.svg"
                        alt="Twitter"
                        className="w-full h-full"
                      />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/inhabithubs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-5 h-5 hover:opacity-80"
                    >
                      <img
                        src="/assets/icons/linkedin.svg"
                        alt="LinkedIn"
                        className="w-full h-full"
                      />
                    </a>
                    <a
                      href="https://medium.com/@INHABIT_hubs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-5 h-5 hover:opacity-80"
                    >
                      <img
                        src="/assets/icons/medium.svg"
                        alt="Medium"
                        className="w-full h-full"
                      />
                    </a>
                    <a
                      href="https://www.instagram.com/inhabit_hubs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-5 h-5 hover:opacity-80"
                    >
                      <img
                        src="/assets/icons/instagram.svg"
                        alt="Instagram"
                        className="w-full h-full"
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* Menu Section */}
              <div ref={menuRef} className="w-full lg:w-[45%] lg:py-16">
                <h3 className="eyebrow text-light mb-2">
                  {t("mainPage.footer.menu")}
                </h3>
                <nav className="flex flex-col gap-4">
                  {[
                    { label: t("navigation.home"), path: "/" },
                    { label: t("navigation.hubs"), path: "/hubs" },
                    {
                      label: t("navigation.stewardshipNFT"),
                      path: "/stewardship-nft",
                    },
                    { label: t("navigation.aboutUs"), path: "/about" },
                    { label: t("navigation.projects"), path: "/projects" },
                    { label: t("navigation.blog"), path: "/blog" },
                    { label: t("navigation.contact"), path: "/contact" },
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
        <div ref={copyrightRef} className="h-[5.5rem] px-6 lg:pl-[clamp(1.5rem,5vw,6.25rem)] flex items-center">
          <p className="nav-text text-light text-xs">
            {t("mainPage.footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
