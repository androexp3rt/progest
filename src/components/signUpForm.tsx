"use client";
import React, { useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  emailValidation,
  passwordValidation,
  signUpValidationSchema,
} from "@/schemas/signUpSchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import * as z from "zod";
import { Button } from "./ui/button";

export default function SignUpForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkUsernameUnique = async () => {
    setIsCheckingEmail(true);
    setEmailMessage(""); // Reset message
    try {
      const response = await axios.get<ApiResponse>(
        `/api/check-email-unique?email=${email}`
      );
      setEmailMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setEmailMessage(
        axiosError.response?.data.message ?? "Error checking Email"
      );
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const form = useForm<z.infer<typeof signUpValidationSchema>>({
    resolver: zodResolver(signUpValidationSchema),
  });

  const onSubmit = async (data: z.infer<typeof signUpValidationSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);
      toast(response.data.message, {
        className: "",
        type: "success",
        data: response.data.message,
      });
      router.replace(`/verify/${data.email}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign-up:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      // Default error message
      const errorMessage =
        axiosError.response?.data.message ??
        "There was a problem with your sign up. Please try again.";
      toast(errorMessage, {
        className: "",
        type: "error",
        data: errorMessage,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="text-[#343666] space-y-3"
      >
        <FormField
          name="companyName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Input
                {...field}
                name="companyName"
                placeholder="Company Name"
                className="outline-none placeholder:text-white"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="fullName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Input
                {...field}
                name="fullName"
                placeholder="Full Name"
                className="outline-none placeholder:text-white"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Input
                {...field}
                name="email"
                placeholder="Email Address"
                className="outline-none placeholder:text-white"
                onChange={(e) => {
                  field.onChange(e);
                  setEmail(e.target.value);
                  checkUsernameUnique();
                }}
              />
              {isCheckingEmail && <Loader2 className="animate-spin" />}
              {!isCheckingEmail && emailMessage && (
                <p
                  className={`text-sm ${
                    emailMessage === "Email is unique"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {emailMessage}
                </p>
              )}
              <p className="text-muted text-sm">
                We will send you a verification code
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Input
                type="password"
                placeholder="Password"
                {...field}
                name="password"
                className="outline-none placeholder:text-white"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Input
                type="password"
                placeholder="Confirm Password"
                {...field}
                name="confirmPassword"
                className="outline-none placeholder:text-white"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#343666] h-10"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </Form>
  );
}
