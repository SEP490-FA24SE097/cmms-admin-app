"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { getSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
// import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const LoginSchema = z.object({
    userName: z
      .string()
      .min(1, "Tên đăng nhập phải nhiều hơn 1 ký tự")
      .max(28, "Tên đăng nhập không được nhiều hơn 28 ký tự"),
    password: z.string().min(1, "Mật khẩu không được để trống"),
  });

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setLoading(true); // Set loading to true when the submission starts
    try {
      const res = await signIn("credentials", {
        redirect: false,
        userName: values.userName,
        password: values.password,
        callbackUrl,
      });

      if (!res?.error) {
        const session = await getSession(); // Lấy session hiện tại
        const token = session?.user?.accessToken;
        let userRole = "";
        if (token) {
          try {
            const decodedToken = jwtDecode<any>(token);
            userRole =
              decodedToken[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ] || "No role found";
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
        if (userRole === "Shipper_Store") {
          router.push("/shipper");
        } else {
          router.push("/home");
        }
        // router.push("/home");
        toast({
          title: "Đăng nhập thành công",
          description: "Bạn đã đăng nhập thành công!",
          style: { backgroundColor: "#73EC8B", color: "#ffffff" },
        });
        form.reset();
      } else {
        toast({
          title: "Lỗi đăng nhập",
          description: "Tên đăng nhập hoặc mật khẩu sai",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra rồi",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Set loading to false when the submission completes
    }
  };

  const { toast } = useToast();
  //   const handleNavigation = (path: string) => {
  //     setIsLoadingPage(true);
  //     router.push(path);
  //   };
  return (
    <main className="bg-[#26313c] h-screen flex items-center justify-center p-10">
      {isLoadingPage && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500">
          <div
            className="h-full bg-blue-700 transition-all duration-300"
            style={{ width: "100%" }}
          ></div>
        </div>
      )}
      <div className="grid w-full h-full grid-cols-1 bg-white md:grid-cols-2 box-animate">
        <div className="bg-[#16202a] text-white flex items-center justify-center flex-col">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="my-4 flex items-center flex-col">
            <h1 className="text-3xl font-bold lg:text-4xl">Đăng nhập</h1>
            <p className="mt-2 text-xs text-slate-400">
              Chào mừng bạn đến với trang web của chúng tôi!
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button
                className="flex items-center w-full mb-4 gap-4 px-10 bg-transparent"
                variant="outline"
              >
                <FcGoogle />
                Đăng nhập bằng google
              </Button>

              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-base font-bold text-gray-200 mb-1">
                      Tên đăng nhập
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="block w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-150 ease-in-out"
                        placeholder="Nhập tên đăng nhập"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="block mt-2 text-base font-bold text-gray-200 mb-1">
                      Mật khẩu
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="block w-full px-4 py-3 pr-10 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-150 ease-in-out"
                        placeholder="Nhập mật khẩu"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <a className="text-sm mt-1 flex justify-end font-medium text-primary-600 hover:underline dark:text-primary-500">
                Quên mật khẩu?
              </a>

              {loading && loading ? (
                <Button
                  type="submit"
                  className="w-full mt-5 rounded-full font-bold bg-gray-600  "
                >
                  Đang tải...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full mt-5 rounded-full font-bold bg-indigo-600 hover:bg-indigo-700 "
                >
                  Đăng nhập
                </Button>
              )}
              <p className="mt-3 flex justify-center text-sm font-light text-gray-500 dark:text-gray-400">
                Tôi chưa có tài khoản?&nbsp;
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Đăng ký
                </Link>
              </p>
            </form>
          </Form>
        </div>
        <div className="relative hidden md:block">
          <Image
            src="/bg.jpg"
            className="object-cover"
            fill={true}
            alt="Picture of the author"
          />
        </div>
      </div>
    </main>
  );
}
