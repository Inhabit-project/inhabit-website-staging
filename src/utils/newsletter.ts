export const handleNewsletterSubmit = async (
  values: { email: string; privacy?: boolean },
  actions: {
    setSubmitting: (isSubmitting: boolean) => void;
    resetForm: () => void;
    setStatus: (status?: string) => void;
  },
  t: (key: string) => string,
  subscribeToMailchimp: (
    subscriber: any
  ) => Promise<{ success: boolean; message: string }>,
  i18nLanguage: string
) => {
  actions.setStatus(undefined);
  try {
    const result = await subscribeToMailchimp({
      email: values.email,
      tags: ["landing-form"],
      language: i18nLanguage,
    });

    if (result.success) {
      actions.resetForm();
      actions.setStatus("✅ " + t("mainPage.footer.newsletter.status.success"));
    } else {
      actions.setStatus(
        "❌ " + t(`mainPage.footer.newsletter.status.errors.${result.message}`)
      );
    }
  } catch (error) {
    console.error(error);
    actions.setStatus(
      `❌ ${t("mainPage.footer.newsletter.status.errors.generic")}`
    );
  } finally {
    actions.setSubmitting(false);
    setTimeout(() => actions.setStatus(undefined), 3000);
  }
};
