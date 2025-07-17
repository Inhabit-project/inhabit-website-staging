import { JSX, RefObject, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { useApiContact } from "@/hooks/api/contact";
import { ContactDto } from "@/services/dtos/contact.dto";

const COOLDOWN_KEY = "contactFormCooldown"; // localStorage key
const COOLDOWN_SEC = 180; // 3 min

type Props = { formRef: RefObject<HTMLDivElement | null> };

export function SendMessage(props: Props): JSX.Element {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t("contact.form.errors.nameRequired")),
        email: z
          .string()
          .trim()
          .email(t("contact.form.errors.emailInvalid"))
          .min(5, t("contact.form.errors.emailRequired")),
        message: z
          .string()
          .trim()
          .min(1, t("contact.form.errors.messageRequired")),
      }),
    [t]
  );

  type Form = z.infer<typeof schema>;

  // props
  const { formRef } = props;

  // hooks
  const [cooldown, setCooldown] = useState<number>(0);

  // external hooks
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<Form>({ resolver: zodResolver(schema), mode: "onChange" });

  const { contact: contactHook } = useApiContact();
  const { mutate: contact, isPending: isContacting } = contactHook;

  // variables
  const formDisabled = isSubmitting || isContacting || cooldown > 0;

  // functions
  const onContact = (data: Form) => {
    const params: ContactDto = {
      email: data.email,
      name: data.name,
      message: data.message,
    };

    contact(params, {
      onSuccess: () => {
        alert("✅ " + t("contact.successMessage"));
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

        // inicia cool‑down
        const expiresAt = Date.now() + COOLDOWN_SEC * 1000;
        localStorage.setItem(COOLDOWN_KEY, expiresAt.toString());
        setCooldown(COOLDOWN_SEC);

        reset();
      },
      onError: (error) => {
        console.error("❌", error);
        alert(t("contact.errors.generic"));
      },
    });
  };

  const onError = (formErrors: Record<string, { message?: string }>) => {
    const msgs = Object.values(formErrors)
      .map((e) => e.message)
      .filter(Boolean) as string[];
    if (msgs.length) alert(msgs.join("\n"));
  };

  // effects
  useEffect(() => {
    const saved = localStorage.getItem(COOLDOWN_KEY);
    if (saved) {
      const expiresAt = Number(saved);
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      if (remaining > 0) setCooldown(remaining);
      else localStorage.removeItem(COOLDOWN_KEY);
    }
  }, []);

  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(COOLDOWN_KEY);
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  return (
    <section
      ref={formRef}
      className="flex-1 w-full max-w-xl background-gradient-dark rounded-xl p-8 md:p-12 shadow-md"
    >
      <h2 className="sr-only">{t("contact.title")}</h2>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onContact, onError)}
      >
        <fieldset disabled={formDisabled} className="contents">
          {/* Name */}
          <div>
            <label className="body-S block text-light font-semibold mb-1">
              {t("contact.form.name")}
            </label>
            <input
              className="input-main"
              placeholder={t("contact.form.namePlaceholder")}
              autoComplete="name"
              {...register("name")}
            />
          </div>

          {/* Email */}
          <div>
            <label className="body-S block text-light font-semibold mb-1">
              {t("contact.form.email")}
            </label>
            <input
              className="input-main"
              type="email"
              placeholder={t("contact.form.emailPlaceholder")}
              autoComplete="email"
              {...register("email")}
            />
          </div>

          {/* Message */}
          <div>
            <label className="body-S block text-light font-semibold mb-1">
              {t("contact.form.message")}
            </label>
            <textarea
              className="input-main p-3 min-h-[120px]"
              placeholder={t("contact.form.messagePlaceholder")}
              {...register("message")}
            />
          </div>

          {/* Submit */}
          <button
            className="btn-secondary w-full mt-2"
            type="submit"
            disabled={isSubmitting || isContacting || cooldown > 0}
          >
            {isSubmitting || isContacting
              ? t("contact.form.sending")
              : cooldown > 0
              ? `${t("contact.form.cooldown", {
                  time: `${Math.floor(cooldown / 60)
                    .toString()
                    .padStart(1, "0")}:${(cooldown % 60)
                    .toString()
                    .padStart(2, "0")}`,
                })}`
              : t("contact.form.send")}
          </button>
        </fieldset>
      </form>
    </section>
  );
}
