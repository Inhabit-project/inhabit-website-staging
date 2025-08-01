import { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react';
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import { LoadingContext } from "../../App";
import { SendMessage } from "./_components/SendMessage";

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

interface Props {
  onPageReady?: () => void;
}

export default function ContactPage(props: Props) {
  const { onPageReady } = props;
  const { t } = useTranslation();

  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Animation refs
  const mainRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Set initial states with useGSAP
  useGSAP(() => {
    gsap.set([titleRef.current?.children || []], {
      opacity: 0,
      y: 50,
    });

    gsap.set([formRef.current, infoRef.current], {
      opacity: 0,
      y: 50,
      scale: 0.95,
    });
  }, { scope: mainRef });

  // Handle loading state change
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Handle animations with useGSAP
  useGSAP(() => {
    if (!canAnimate) return;

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // Title and subtitle animation first
    tl.to(titleRef.current?.children || [], {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
    })
      // Add a brief pause before the next animations
      .addLabel("contentStart", "+=0.2")
      // Info section animation
      .to(
        infoRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
        },
        "contentStart"
      )
      // Form section animation with a slight delay
      .to(
        formRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
        },
        "contentStart+=0.1"
      );

    if (onPageReady) onPageReady();
  }, { scope: mainRef, dependencies: [canAnimate, onPageReady] });

  return (
    <div ref={mainRef} className="min-h-screen background-gradient-light">
      <Menu />
      <main
        className="w-full flex flex-col items-center justify-center py-20 md:py-32 pt-32 background-gradient-light"
        aria-labelledby="contact-title"
      >
        <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)]">
          <div
            ref={titleRef}
            className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]"
          >
            <h1
              id="contact-title"
              className="heading-2 text-secondary max-w-[40.9375rem]"
            >
              <span
                dangerouslySetInnerHTML={{ __html: t("contactPage.title") }}
              />
            </h1>
            <p className="body-M text-secondary max-w-[36rem]">
              {t("contactPage.description")}
            </p>
          </div>
        </div>
        <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col md:flex-row gap-12 md:gap-24 items-start justify-between">
          {/* Left Info Section */}
          <aside
            ref={infoRef}
            className="flex-1 max-w-xl"
            aria-label={t("contactPage.reachOutIf")}
          >
            <div className="mt-8 mb-6">
              <h2 className="text-xl font-medium mb-2 text-secondary">
                {t("contactPage.reachOutIf")}
              </h2>
              <ul
                className="list-none space-y-1 text-base text-secondary"
                role="list"
              >
                <li>● {t("contactPage.bullet1")}</li>
                <li>● {t("contactPage.bullet2")}</li>
                <li>● {t("contactPage.bullet3")}</li>
                <li>● {t("contactPage.bullet4")}</li>
                <li>● {t("contactPage.bullet5")}</li>
              </ul>
              <p className="mt-4 font-bold body-M text-secondary">
                {t("contactPage.seed")}
              </p>
            </div>
            <address className="not-italic space-y-4 text-base text-secondary mt-8">
              <ul className="space-y-4" role="list">
                <li className="flex items-center gap-4">
                  <img
                    src="/assets/icons/envelope.svg"
                    alt=""
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                  <a
                    href="mailto:hello@inhabit.one"
                    className="underline focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={t("contactPage.email")}
                  >
                    {t("contactPage.email")}
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <img
                    src="/assets/icons/location.svg"
                    alt=""
                    className="w-5 h-5 mt-1"
                    aria-hidden="true"
                  />
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("contactPage.location"),
                    }}
                  />
                </li>
              </ul>
            </address>
          </aside>

          {/* Right Form Section */}
          <SendMessage formRef={formRef} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
