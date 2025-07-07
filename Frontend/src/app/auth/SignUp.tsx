import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

function SignUp() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      dob: undefined,
      email: "",
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log(data);
  };

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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-2 w-full text-base font-semibold h-12 bg-[#367AFF] hover:bg-[#367AFF] cursor-pointer"
            >
              Sign up
            </Button>
          </form>
        </Form>
        <div className="text-center text-[#969696] text-base  font-light">
          Already have an account??
          <Link
            to="/signin"
            className="text-[#367AFF] underline font-medium cursor-pointer pl-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default SignUp;
