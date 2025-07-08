import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import PublicLayout from "@/layouts/PublicLayout";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema, type SignInFormValues } from "@/lib/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { apiClient } from "@/lib/api";

export default function SignIn() {
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      otp: "",
      keepLoggedIn: false,
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.signin({
        email: data.email,
        otp: data.otp,
        keepLoggedIn: data.keepLoggedIn,
      });
      if (response.success) {
        toast.success("Login successful!");
        navigate("/notes");
      } else {
        toast.error(response.message || "Login failed");
        form.setValue("otp", "");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      form.setValue("otp", "");
    } finally {
      setIsLoading(false);
    }
  };
``
  const handleRequestOTP = async () => {
    const isEmailValid = await form.trigger("email");
    if (!isEmailValid) return;
    setIsLoading(true);
    try {
      const email = form.getValues("email");
      const response = await apiClient.requestSigninOTP(email);
      if (response.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email!");
        setTimeout(() => {
          const otpInput = document.querySelector(
            'input[name="otp"]'
          ) as HTMLInputElement;
          if (otpInput) otpInput.focus();
        }, 100);
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[#232323] text-center lg:text-start">
            Sign in
          </h1>
          <p className="text-[#969696] text-base font-light text-center lg:text-start">
            Please login to continue to your account.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={
              otpSent
                ? form.handleSubmit(onSubmit)
                : (e) => {
                    e.preventDefault();
                    handleRequestOTP();
                  }
            }
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      className="h-11"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showOtp ? "text" : "password"}
                        placeholder="Enter 6-digit OTP"
                        className="pr-10 h-11"
                        {...field}
                        disabled={isLoading}
                        maxLength={6}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowOtp((v) => !v)}
                      >
                        {showOtp ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="keepLoggedIn"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="keepLoggedIn"
                        className="border-2 border-black"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="keepLoggedIn"
                      className="text-sm font-normal cursor-pointer select-none text-[#232323]"
                    >
                      Keep me logged in
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="mt-2 w-full text-base font-semibold h-12 bg-[#367AFF] hover:bg-[#367AFF]"
              disabled={isLoading}
            >
              {isLoading
                ? otpSent
                  ? "Signing in..."
                  : "Sending OTP..."
                : otpSent
                ? "Sign in"
                : "Get OTP"}
            </Button>
            {otpSent && (
              <button
                type="button"
                onClick={handleRequestOTP}
                disabled={isLoading || !form.watch("email")}
                className="text-[#367AFF] underline text-sm font-medium cursor-pointer hover:no-underline"
              >
                Resend OTP
              </button>
            )}
          </form>
        </Form>
        <div className="text-center text-[#969696] text-base mt-6 font-light">
          Need an account?
          <Link
            to="/auth/signin"
            className="text-[#367AFF] underline font-medium"
          >
            Create one
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
