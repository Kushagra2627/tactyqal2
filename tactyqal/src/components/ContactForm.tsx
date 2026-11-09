"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContact } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Add a subject for your inquiry"),
  message: z.string().min(10, "Message needs at least 10 characters")
});
type F = z.infer<typeof schema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<F>({ resolver: zodResolver(schema) });
  const [ok, setOk] = useState(false);
  const [serverError, setServerError] = useState("");

  const submit = async (values: F) => {
    setServerError("");
    setOk(false);
    try {
      await submitContact(values);
      setOk(true);
      reset();
    } catch (err: any) {
      setServerError(err.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="rounded-2xl border border-line bg-white p-6 shadow-xl transition-all sm:p-8"
      noValidate
    >
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-ink">
            Your Name
          </label>
          <input
            className={`input mt-1.5 transition-all focus:border-lagoon focus:ring-2 focus:ring-lagoon/20 ${
              errors.name ? "border-red-500 bg-red-50/30" : ""
            }`}
            placeholder="John Doe"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-ink">
            Email Address
          </label>
          <input
            type="email"
            className={`input mt-1.5 transition-all focus:border-lagoon focus:ring-2 focus:ring-lagoon/20 ${
              errors.email ? "border-red-500 bg-red-50/30" : ""
            }`}
            placeholder="john@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-ink">
            Subject
          </label>
          <input
            className={`input mt-1.5 transition-all focus:border-lagoon focus:ring-2 focus:ring-lagoon/20 ${
              errors.subject ? "border-red-500 bg-red-50/30" : ""
            }`}
            placeholder="Teen Mentorship Program Inquiry"
            aria-invalid={!!errors.subject}
            {...register("subject")}
          />
          {errors.subject && (
            <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-ink">
            Message
          </label>
          <textarea
            rows={4}
            className={`input mt-1.5 transition-all focus:border-lagoon focus:ring-2 focus:ring-lagoon/20 ${
              errors.message ? "border-red-500 bg-red-50/30" : ""
            }`}
            placeholder="Tell us about your teen's background, app ideas, or any questions..."
            aria-invalid={!!errors.message}
            {...register("message")}
          />
          {errors.message && (
            <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Success Alert */}
        {ok && (
          <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-medium text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>Message sent successfully! Our founder will reach out within 24 hours.</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full gap-2 py-3 shadow-md shadow-lagoon/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending message...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send message
            </>
          )}
        </button>
      </div>
    </form>
  );
}
