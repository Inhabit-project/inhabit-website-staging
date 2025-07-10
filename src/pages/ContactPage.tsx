import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { LoadingContext } from '../App';

interface ContactPageProps {
  onPageReady?: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onPageReady }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '', kyc: false, terms: false });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Animation refs
  const mainRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Set initial states
  useEffect(() => {
    gsap.set([titleRef.current?.children || []], {
      opacity: 0,
      y: 50
    });

    gsap.set([formRef.current, infoRef.current], {
      opacity: 0,
      y: 50,
      scale: 0.95
    });
  }, []);

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

  // Handle animations
  useEffect(() => {
    if (!canAnimate) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out"
        }
      });

      // Title and subtitle animation first
      tl.to(titleRef.current?.children || [], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1
      })
      // Add a brief pause before the next animations
      .addLabel("contentStart", "+=0.2")
      // Info section animation
      .to(infoRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out"
      }, "contentStart")
      // Form section animation with a slight delay
      .to(formRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out"
      }, "contentStart+=0.1");
    }, mainRef);

    if (onPageReady) onPageReady();
    return () => ctx.revert();
  }, [canAnimate, onPageReady]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = t('contactPage.form.errors.nameRequired');
    }
    if (!form.email.trim()) {
      newErrors.email = t('contactPage.form.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t('contactPage.form.errors.emailInvalid');
    }
    if (!form.message.trim()) {
      newErrors.message = t('contactPage.form.errors.messageRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: handle form submission (API call, etc.)
      setSubmitted(true);
    }
  };

  return (
    <div ref={mainRef} className="min-h-screen background-gradient-light">
      <Menu />
      <main className="w-full flex flex-col items-center justify-center py-20 md:py-32 pt-32 background-gradient-light" aria-labelledby="contact-title">
        <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)]">
          <div ref={titleRef} className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h1 id="contact-title" className="heading-2 text-secondary max-w-[40.9375rem]">
              <span dangerouslySetInnerHTML={{ __html: t('contactPage.title') }} />
            </h1>
            <p className="body-M text-secondary max-w-[36rem]">
              {t('contactPage.description')}
            </p>
          </div>
        </div>
        <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col md:flex-row gap-12 md:gap-24 items-start justify-between">
          {/* Left Info Section */}
          <aside ref={infoRef} className="flex-1 max-w-xl" aria-label={t('contactPage.reachOutIf')}>
            <div className="mt-8 mb-6">
              <h2 className="text-xl font-medium mb-2 text-secondary">{t('contactPage.reachOutIf')}</h2>
              <ul className="list-none space-y-1 text-base text-secondary" role="list">
                <li>● {t('contactPage.bullet1')}</li>
                <li>● {t('contactPage.bullet2')}</li>
                <li>● {t('contactPage.bullet3')}</li>
                <li>● {t('contactPage.bullet4')}</li>
                <li>● {t('contactPage.bullet5')}</li>
              </ul>
              <p className="mt-4 font-bold body-M text-secondary">{t('contactPage.seed')}</p>
            </div>
            <address className="not-italic space-y-4 text-base text-secondary mt-8">
              <ul className="space-y-4" role="list">
                <li className="flex items-center gap-4">
                  <img src="/assets/icons/envelope.svg" alt="" className="w-5 h-5" aria-hidden="true" />
                  <a href="mailto:hello@inhabit.one" className="underline focus:outline-none focus:ring-2 focus:ring-primary" aria-label={t('contactPage.email')}>{t('contactPage.email')}</a>
                </li>
                <li className="flex items-center gap-4">
                  <img src="/assets/icons/phone.svg" alt="" className="w-5 h-5" aria-hidden="true" />
                  <a href="tel:+15550000000" className="underline focus:outline-none focus:ring-2 focus:ring-primary" aria-label={t('contactPage.phone')}>{t('contactPage.phone')}</a>
                </li>
                <li className="flex items-start gap-4">
                  <img src="/assets/icons/location.svg" alt="" className="w-5 h-5 mt-1" aria-hidden="true" />
                  <span dangerouslySetInnerHTML={{ __html: t('contactPage.location') }} />
                </li>
              </ul>
            </address>
          </aside>

          {/* Right Form Section */}
          <section ref={formRef} className="flex-1 w-full max-w-xl background-gradient-dark rounded-xl p-8 md:p-12 shadow-md" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title" className="sr-only">{t('contactPage.title')}</h2>
            {submitted ? (
              <div className=" font-semibold text-center py-8" role="alert" aria-live="polite">{t('contactPage.successMessage')}</div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit} aria-describedby="contact-form-title" noValidate>
                <div>
                  <label className="block text-light font-medium mb-1" htmlFor="name">{t('contactPage.form.name')}</label>
                  <input
                    className={`w-full rounded-md px-4 py-2 bg-white/30 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder={t('contactPage.form.namePlaceholder')}
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-light font-medium mb-1" htmlFor="email">{t('contactPage.form.email')}</label>
                  <input
                    className={`w-full rounded-md px-4 py-2 bg-white/30 border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder={t('contactPage.form.emailPlaceholder')}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-light font-medium mb-1" htmlFor="message">{t('contactPage.form.message')}</label>
                  <textarea
                    className={`w-full rounded-md px-4 py-2 bg-white/30 border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]`}
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t('contactPage.form.messagePlaceholder')}
                    aria-multiline="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-red-500 text-sm mt-1" role="alert">{errors.message}</p>
                  )}
                </div>
                <fieldset className="space-y-2" aria-labelledby="agreement-legend">
                  <legend id="agreement-legend" className="sr-only">{t('contactPage.form.terms')}</legend>
                  <label className="flex items-start gap-2 text-xs text-light">
                    <input
                      type="checkbox"
                      name="kyc"
                      checked={form.kyc}
                      onChange={handleChange}
                      className="mt-1"
                      id="kyc"
                      aria-describedby="kyc-description"
                    />
                    <span id="kyc-description">{t('contactPage.form.kyc')}</span>
                  </label>
                  <label className="flex items-start gap-2 text-xs text-light">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={form.terms}
                      onChange={handleChange}
                      className="mt-1"
                      required
                      id="terms"
                      aria-required="true"
                      aria-describedby="terms-description"
                    />
                    <span id="terms-description">{t('contactPage.form.terms')}</span>
                  </label>
                </fieldset>
                <button
                  type="submit"
                  className="w-full bg-[#E07A1B] hover:bg-[#d06a0b] text-white font-semibold rounded-full py-3 mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!form.terms}
                  aria-disabled={!form.terms}
                >
                  {t('contactPage.form.send')}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage; 