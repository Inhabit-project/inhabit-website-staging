import { MailchimpSubscriber } from "@/types/mailchimp";

const MAILCHIMP_API_URL = import.meta.env.VITE_MAILCHIMP_API_URL;

/**
 * Subscribes a user to a Mailchimp mailing list.
 *
 * @param {MailchimpSubscriber} subscriber - The subscriber data to be added
 * @param {string} subscriber.email - Required email address of the subscriber
 * @param {string} [subscriber.first_name] - Optional first name
 * @param {string} [subscriber.last_name] - Optional last name
 * @param {string} [subscriber.language] - Optional language
 * @returns {Promise<{success: boolean, message: string}>} Subscription result object
 * @returns {boolean} success - Whether the subscription was successful
 * @returns {string} message - Response message from the API or error description
 *
 * @throws {Error} When network request fails (handled internally, returns error response)
 *
 * @example
 * const result = await subscribeToMailchimp({
 *   email: 'user@example.com',
 *   first_name: 'John',
 *   last_name: 'Doe'
 * });
 * if (result.success) {
 *   alert('Subscription successful!');
 * }
 */
export async function subscribeToMailchimp(
  subscriber: MailchimpSubscriber
): Promise<{ success: boolean; message: string }> {
  if (!subscriber.email) {
    return {
      success: false,
      message: "Email address is required",
    };
  }

  try {
    const response = await fetch(
      `${MAILCHIMP_API_URL}/api/v1/mailchimp/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriber),
      }
    );

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.error.statusCode,
      };
    }

    return {
      success: true,
      message: data.message ?? "Subscription successful",
    };
  } catch (error) {
    console.error("Error subscribing to Mailchimp:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}
