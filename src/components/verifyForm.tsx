"use client";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useForm, FieldValues } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";

export default function VerifyForm() {
  const router = useRouter();
  const params = useParams<{ email: string }>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        email: params.email,
        code: data.code,
      });

      toast(response.data.message, {
        className: "",
        type: "success",
        data: response.data.message,
      });

      router.replace("/signin");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        {
          className: "",
          type: "error",
          data:
            axiosError.response?.data.message ??
            "An error occurred. Please try again.",
        }
      );
    }
  };

  const inputclass =
    "text-[#343666] w-full h-[6vh] p-2 outline-none rounded-xl bg-white/80 mb-6 mt-1";
  const buttonClass =
    "w-full h-[6vh] flex items-center justify-center p-2 outline-none border-none bg-white/30 active:bg-white/60 rounded-xl";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="code">Verification Code</label>
      <input
        className={inputclass}
        {...register("code")}
        data-error={errors.code?.message}
        type="number"
        id="code"
        placeholder="OTP"
        name="code"
      />
      <button className={buttonClass} type="submit">
        Verify
      </button>
    </form>
  );
}
