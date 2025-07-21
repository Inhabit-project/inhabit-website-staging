import React, { useRef, useEffect, useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LoadingContext } from "../App";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiNewsletter } from "@/hooks/api/newsletter";
import { SubscriptionDto } from "@/services/dtos/subscription.dto";
import confetti from "canvas-confetti";

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .trim()
          .email(t("mainPage.footer.newsletter.email.validations.invalid"))
          .min(5, t("mainPage.footer.newsletter.email.validations.required")),
        privacy: z
          .boolean()
          .refine(
            (val) => val,
            t("mainPage.footer.newsletter.privacy.validations.required")
          ),
      }),
    [t]
  );

  type Form = z.infer<typeof schema>;

  // hooks
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // external hooks
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Form>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", privacy: false },
  });

  const { subscribe: subscribeHook } = useApiNewsletter();
  const { mutate: subscribe, isPending: isSubscribing } = subscribeHook;

  // variables
  const formDisabled = isSubmitting || isSubscribing;

  // functions
  const onSubscribe = async (data: Form) => {
    const params: SubscriptionDto = {
      email: data.email,
    };

    subscribe(params, {
      onSuccess: () => {
        alert("✅ " + t("mainPage.footer.newsletter.success"));
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        reset();
      },

      onError: (error) => {
        console.error("❌", error.message);
        alert(t("mainPage.footer.newsletter.error", { error: error.message }));
      },
    });
  };

  // effects
  useEffect(() => {
    gsap.set(logoRef.current, { opacity: 0, y: 50 });
    gsap.set(
      [
        connectRef.current,
        locationRef.current,
        newsletterRef.current,
        socialRef.current,
        menuRef.current,
      ],
      { opacity: 0, y: 50 }
    );
    gsap.set(copyrightRef.current, { opacity: 0, y: 20 });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setCanAnimate(true), 1500);
      return () => clearTimeout(timer);
    }
    setCanAnimate(false);
  }, [isLoading]);

  useEffect(() => {
    if (!canAnimate || !footerRef.current) return;

    const ctx = gsap.context(() => {
      timelineRef.current?.kill();
      scrollTriggerRef.current?.kill();

      timelineRef.current = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      timelineRef.current
        .to(logoRef.current, { opacity: 1, y: 0, duration: 0.8 })
        .to(
          [connectRef.current, locationRef.current],
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          "-=0.4"
        )
        .to(newsletterRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
        .to(socialRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
        .to(menuRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(copyrightRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 75%",
        end: "center center",
        toggleActions: "restart none none none",
        animation: timelineRef.current,
        id: `footer-${Date.now()}`,
      });

      ScrollTrigger.refresh();
    }, footerRef);

    return () => {
      ctx.revert();
      timelineRef.current?.kill();
      scrollTriggerRef.current?.kill();
    };
  }, [canAnimate]);

  return (
    <footer
      ref={footerRef}
      className="relative w-full min-h-screen bg-secondary no-snap"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/assets/FOOTER.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col py-[5rem]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row px-6 lg:px-0">
          {/* Left Side - Logo */}
          <div className="w-full lg:w-[45%] pt-16 lg:pl-[clamp(1.5rem,5vw,6.25rem)]">
            <img
              ref={logoRef}
              src="/assets/figma-images/logo-footer.svg"
              alt="INHABIT"
              className="h-[4rem]"
            />
          </div>

          {/* Right Side Content */}
          <div className="w-full lg:w-[55%] flex flex-col mt-16 lg:mt-0">
            <div className="flex-1 flex flex-col lg:flex-row lg:pr-[clamp(1.5rem,5vw,6.25rem)] gap-16 lg:gap-24">
              {/* Combined Section */}
              <div className="w-full lg:w-[45%] flex flex-col justify-between lg:py-16">
                {/* Top Group */}
                <div className="space-y-8">
                  {/* Connect */}
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

                  {/* Location */}
                  <div ref={locationRef}>
                    <h3 className="eyebrow text-light mb-2">
                      {t("mainPage.footer.location")}
                    </h3>
                    <p className="base-text text-light">
                      {t("mainPage.footer.locationText")}
                    </p>
                  </div>
                </div>

                {/* Newsletter */}
                <div ref={newsletterRef} className="my-16 lg:my-0">
                  <h3 className="eyebrow text-light mb-2">
                    {t("mainPage.footer.newsletter.title")}
                  </h3>
                  <p className="base-text text-light mb-4">
                    {t("mainPage.footer.newsletter.text")}
                  </p>

                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(onSubscribe)}
                  >
                    <fieldset disabled={formDisabled} className="contents">
                      {/* Email */}
                      <input
                        type="email"
                        placeholder={t(
                          "mainPage.footer.newsletter.email.placeholder"
                        )}
                        className="input-main"
                        {...register("email")}
                      />
                      {errors.email && (
                        <div className="text-orange-400 text-xs">
                          {errors.email.message}
                        </div>
                      )}

                      {/* Privacy */}
                      <label className="flex gap-2 items-start">
                        <input
                          type="checkbox"
                          className="mt-1"
                          {...register("privacy")}
                        />
                        <span className="base-text text-light">
                          {t("mainPage.footer.acceptPolicy")}
                        </span>
                      </label>
                      {errors.privacy && (
                        <div className="text-orange-400 text-xs">
                          {errors.privacy.message}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="btn-primary-sm mt-2 w-[12rem]"
                        disabled={isSubmitting || isSubscribing}
                      >
                        {isSubmitting || isSubscribing
                          ? t("mainPage.footer.newsletter.subscribing")
                          : t("mainPage.footer.newsletter.subscribe")}
                      </button>
                    </fieldset>
                  </form>
                </div>

                {/* Social Links */}
                <div ref={socialRef}>
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

              {/* Menu */}
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

        {/* Copyright */}
        <div
          ref={copyrightRef}
          className="h-[5.5rem] px-6 lg:pl-[clamp(1.5rem,5vw,6.25rem)] flex items-center"
        >
          <p className="nav-text text-light text-xs">
            {t("mainPage.footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
