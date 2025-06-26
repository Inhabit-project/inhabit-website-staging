import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { handleNewsletterSubmit } from "@/utils/newsletter";
import { subscribeToMailchimp } from "@/services/mailchimpService";

const NewsletterCTA: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full flex justify-center items-center py-16 bg-none">
      <div
        className="w-full container rounded-3xl shadow-xl mx-auto flex flex-col items-start px-12 py-16 relative overflow-hidden"
        style={{
          minHeight: 420,
          backgroundImage: "url('/assets/CTA5.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Blur/gradient overlay */}
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
          <h2 className="mb-4 max-w-6xl text-left text-light font-normal">
            <span className="text-accent font-semibold">Stay connected</span> to
            a global network restoring land, culture, and systems.
          </h2>
          <p className="body-S text-light text-lg mb-8 max-w-3xl">
            Get updates that actually matter, shaping a sustainable future.
            Become a steward today and make a lasting impact.
          </p>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email(
                  t("mainPage.footer.newsletter.email.validations.invalid")
                )
                .required(
                  t("mainPage.footer.newsletter.email.validations.required")
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
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form
                className="flex flex-row w-full max-w-xl items-center bg-white/10 rounded-3xl shadow-md"
                onSubmit={handleSubmit}
                aria-label="Newsletter signup"
              >
                <span className="flex items-center pl-6 text-light opacity-70">
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
                  name="email"
                  type="email"
                  placeholder={t(
                    "mainPage.footer.newsletter.email.placeholder"
                  )}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  required
                  className="flex-1 py-5 px-6 rounded-3xl border-none text-base font-nunito bg-transparent text-light focus:outline-none mr-2 min-w-0"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="btn-primary button-text rounded-3xl py-4 px-9 ml-2 text-base font-abel font-normal uppercase"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("mainPage.footer.newsletter.subscribing")
                    : t("mainPage.footer.newsletter.join_newsletter")}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
