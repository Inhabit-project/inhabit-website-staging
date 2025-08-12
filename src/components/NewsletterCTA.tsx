import React, { useRef, useEffect, useContext, useState, useMemo } from "react";
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

const NewsletterCTA: React.FC = () => {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .trim()
          .email(t("mainPage.footer.newsletter.email.validations.invalid"))
          .min(5, t("mainPage.footer.newsletter.email.validations.required")),
      }),
    [t]
  );

  type Form = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<Form>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const emailValue = watch("email");

  const { subscribe: subscribeHook } = useApiNewsletter();
  const { mutate: subscribe, isPending: isSubscribing } = subscribeHook;

  const onSubscribe = async (data: Form) => {
    const params: SubscriptionDto = { email: data.email };

    subscribe(params, {
      onSuccess: () => {
        alert("✅ " + t("mainPage.footer.newsletter.success"));
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        reset();
      },
      onError: (error: any) => {
        console.error("❌", error.message);
        alert(t("mainPage.footer.newsletter.error", { error: error.message }));
      },
    });
  };

  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Pre‑set initial styles once
  useEffect(() => {
    gsap.set([titleRef.current, descRef.current], { opacity: 0, y: 50 });
    gsap.set(formRef.current, { opacity: 0, y: 50 });
    gsap.set(buttonRef.current, { opacity: 0, scale: 0.95 });
  }, []);

  // Wait for global loader end before allowing scroll animation
  useEffect(() => {
    if (!isLoading) {
      setCanAnimate(true);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Build ScrollTrigger timeline
  useEffect(() => {
    if (!canAnimate || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "center center",
          toggleActions: "play none none reverse",
          id: `newsletter-cta-${Date.now()}`,
        },
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .to(
          descRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          formRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [canAnimate]);

  const [inputFocused, setInputFocused] = useState(false);
  const formDisabled = isSubmitting || isSubscribing;

  return (
    <section
      ref={sectionRef}
      className="w-full flex justify-center items-center py-16 bg-none"
    >
      <div
        className="w-full container rounded-3xl shadow-xl mx-auto flex flex-col items-start px-12 py-16 relative overflow-hidden"
        style={{
          minHeight: 420,
          backgroundImage: "url('/assets/CTA.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Blur overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full">
          <h2
            ref={titleRef}
            className="mb-4 max-w-6xl text-left text-light font-normal"
          >
            <span className="text-accent font-semibold">
              {t("mainPage.blog.newsletterCTA.stay_connected")}
            </span>{" "}
            {t("mainPage.blog.newsletterCTA.subtitle")}
          </h2>

          <p ref={descRef} className="body-S text-light text-lg mb-8 max-w-3xl">
            {t("mainPage.blog.newsletterCTA.description")}
          </p>

          <form
            ref={formRef}
            className="flex flex-col sm:flex-row w-full max-w-3xl items-center bg-white/10 rounded-3xl shadow-md gap-3 sm:gap-0"
            onSubmit={handleSubmit(onSubscribe)}
            aria-label="Newsletter signup"
          >
            {/* Mobile icon inside input */}
            <div className="relative flex-1 w-full">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-light opacity-70 pointer-events-none block sm:hidden"
                style={{ zIndex: 2 }}
              >
                {/* Envelope icon */}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M3 6.75C3 5.50736 4.00736 4.5 5.25 4.5H18.75C19.9926 4.5 21 5.50736 21 6.75V17.25C21 18.4926 19.9926 19.5 18.75 19.5H5.25C4.00736 19.5 3 18.4926 3 17.25V6.75Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3.75 7.5L12 13.5L20.25 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>

              <input
                type="email"
                placeholder={t("mainPage.footer.newsletter.email.placeholder")}
                {...register("email")}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="flex-1 py-5 px-12 sm:px-6 rounded-3xl border-none text-base font-nunito bg-transparent text-light focus:outline-none mr-2 min-w-0 w-full"
                aria-label="Email address"
                autoComplete="email"
                disabled={formDisabled}
              />
              {/* Animated cursor */}
              {!(emailValue || inputFocused) && (
                <span
                  className="absolute left-12 sm:left-6 top-1/2 -translate-y-1/2 text-light animate-blink pointer-events-none select-none text-base"
                  style={{ fontFamily: "monospace", opacity: 0.7 }}
                >
                  |
                </span>
              )}
            </div>

            {/* Desktop icon outside input */}
            <span className="hidden sm:flex items-center pl-6 text-light opacity-70">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M3 6.75C3 5.50736 4.00736 4.5 5.25 4.5H18.75C19.9926 4.5 21 5.50736 21 6.75V17.25C21 18.4926 19.9926 19.5 18.75 19.5H5.25C4.00736 19.5 3 18.4926 3 17.25V6.75Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M3.75 7.5L12 13.5L20.25 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>

            <button
              ref={buttonRef}
              type="submit"
              className="btn-primary button-text rounded-3xl py-4 px-9 mt-3 sm:mt-0 w-full sm:w-auto"
              disabled={formDisabled}
            >
              {formDisabled
                ? t("mainPage.footer.newsletter.subscribing")
                : t("mainPage.footer.newsletter.join_newsletter")}
            </button>
          </form>
          {errors.email && (
            <div className="text-primary text-xs">
              {errors.email.message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
