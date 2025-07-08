import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { signupSchema, type SignUpFormValues } from "@/lib/schema";
import { apiClient } from "@/lib/api";

function SignUp() {
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      dob: undefined,
      email: "",
      otp: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    if (!otpSent || !data.otp) return;

    setIsLoading(true);
    try {
      const response = await apiClient.verifySignup({
        name: data.name,
        email: data.email,
        dateOfBirth: data.dob!.toISOString(),
        otp: data.otp,
      });

      if (response.success) {
        toast.success("Account created successfully!");
        navigate("/notes");
      } else {
        toast.error(response.message || "Verification failed");
        form.setValue("otp", "");
      }
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
      form.setValue("otp", "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetOTP = async () => {
    const isValid = await form.trigger(["name", "dob", "email"]);
    if (!isValid) return;

    setIsLoading(true);
    try {
      const formData = form.getValues();
      const response = await apiClient.signup({
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dob!.toISOString(),
      });

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

  const handleResendOTP = async () => {
    const formData = form.getValues();
    setIsLoading(true);
    try {
      const response = await apiClient.signup({
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dob!.toISOString(),
      });

      if (response.success) {
        toast.success("OTP resent to your email!");
        form.setValue("otp", "");
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const { name, dob, email } = form.watch();
  const isGetOTPDisabled = !name || !dob || !email;

  return (
    <PublicLayout>
      <div className="flex flex-col gap-6 w-full">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-[#232323] text-center lg:text-start">
            Sign up
          </h1>
          <p className="text-[#969696] text-base font-light text-center lg:text-start">
            Sign up to enjoy the feature of HD
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      {...field}
                      className="p-4 h-11"
                      disabled={isLoading || otpSent}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full p-4 h-11 text-left font-normal justify-start",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading || otpSent}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "dd MMMM yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      className="p-4 h-11"
                      disabled={isLoading || otpSent}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {otpSent && (
              <>
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter OTP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter 6-digit OTP"
                          {...field}
                          className="p-4 h-11"
                          disabled={isLoading}
                          maxLength={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-[#367AFF] underline font-medium hover:no-underline"
                  >
                    Resend OTP
                  </button>
                </div>
              </>
            )}
            {otpSent ? (
              <Button
                type="submit"
                className="mt-2 w-full text-base font-semibold h-12 bg-[#367AFF] hover:bg-[#367AFF]"
                disabled={isLoading || !form.watch("otp")}
              >
                {isLoading ? "Verifying..." : "Sign Up"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleGetOTP}
                disabled={isGetOTPDisabled || isLoading}
                className="mt-2 w-full text-base font-semibold h-12 bg-[#367AFF] hover:bg-[#367AFF]"
              >
                {isLoading ? "Sending..." : "Get OTP"}
              </Button>
            )}
          </form>
        </Form>
        <div className="text-center text-[#969696] text-base font-light">
          Already have an account?{" "}
          <Link
            to="/auth"
            className="text-[#367AFF] underline font-medium cursor-pointer"
          >
            Sign in
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default SignUp;
