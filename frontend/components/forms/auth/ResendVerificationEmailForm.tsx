"use client";

import { handleBackendFormErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import SubmitFormButton from "@/components/shared/SubmitFormButton";
import { toast } from "@/hooks/use-toast";
import { postData } from "@/lib/actions/data.action";

const ResendVerificationEmailRequest = z.object({
  email: z.string().email(),
})

const ResendVerificationEmailForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof ResendVerificationEmailRequest>>({
    resolver: zodResolver(ResendVerificationEmailRequest),
    defaultValues: {
      email: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof ResendVerificationEmailRequest>) => {
    setIsSubmitting(true);

    const response = await postData({
      url: "/email/verification-notification",
      data: values,
      path: "/verify-email",
    });

    setIsSubmitting(false);

    if (response && !response.success) {
      handleBackendFormErrors({
        setError: form.setError,
        error: response.error,
        toast,
      });
      return;
    }

    router.push("/verify-email");

    toast({
      variant: "success",
      description: response?.result?.message || "Email sent successfully",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>
                Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  className="background-light900_dark text-slate900_light800 placeholder no-focus slate-border outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitFormButton
          isSubmitting={isSubmitting}
          submitLabel="Resend email"
        />
      </form>
    </Form>
  );
};

export default ResendVerificationEmailForm;
