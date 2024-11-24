"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { createAccount } from "@/lib/actions/sign_up/action/sign_up";
import { CiMail } from "react-icons/ci";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Define Zod schema for form validation
const registerSchema = z.object({
  fullName: z.string().min(1, "Họ và tên không được bỏ trống."),
  email: z.string().email("Email không hợp lệ."),
  userName: z.string().min(6, "Tên tài khoản phải có ít nhất 6 ký tự."),
  password: z.string().min(1, "Mật khẩu không được bỏ trống."),
  taxCode: z.string().optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userName: "",
    password: "",
    taxCode: undefined,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleCheckboxChange = () => {
    setIsChecked((prev) => {
      // If unchecking, set taxCode to undefined
      if (prev) {
        setFormData((prevData) => ({ ...prevData, taxCode: undefined }));
      }
      return !prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data using Zod schema
    const validationResult = registerSchema.safeParse(formData);
    if (!validationResult.success) {
      // Show validation errors in toast
      validationResult.error.errors.forEach((error) => {
        toast({
          title: "Validation Error",
          description: error.message,
          variant: "destructive",
        });
      });
      return;
    }

    setLoading(true);
    try {
      const response = await createAccount(formData);
      if (response.data.length > 0) {
        setIsRegistered(true);
      } else if (response.error) {
        toast({
          title: "Đăng ký thất bại",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#26313c] h-screen flex items-center justify-center p-10">
      <div className="grid w-full h-full grid-cols-1 bg-white md:grid-cols-2 box-animate">
        <div className="bg-[#16202a] text-white flex items-center justify-center flex-col pb-10">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="my-4 flex items-center flex-col">
            <h1 className="text-3xl font-bold lg:text-4xl">
              Tạo tài khoản mới
            </h1>
          </div>
          <form className="w-56 lg:w-1/3" onSubmit={handleSubmit}>
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              className="mt-2 mb-1 bg-transparent"
              id="fullName"
              placeholder="Họ và tên"
              onChange={handleInputChange}
              value={formData.fullName}
            />
            <Label htmlFor="email">Email</Label>
            <Input
              className="mt-2 mb-1 bg-transparent"
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleInputChange}
              value={formData.email}
            />
            <Label htmlFor="userName">Tài khoản</Label>
            <Input
              className="mt-2 mb-1 bg-transparent"
              id="userName"
              placeholder="Username"
              onChange={handleInputChange}
              value={formData.userName}
            />
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              className="mt-2 mb-1 bg-transparent"
              type="password"
              id="password"
              placeholder="Password"
              onChange={handleInputChange}
              value={formData.password}
            />
            {isChecked && (
              <div>
                <Label htmlFor="taxCode">Mã số thuế</Label>
                <Input
                  className="mt-2 mb-1 bg-transparent"
                  id="taxCode"
                  placeholder="Mã số Thuế"
                  onChange={handleInputChange}
                  value={formData.taxCode}
                />
              </div>
            )}
            <div className="flex gap-3 items-center mt-2">
              <Checkbox
                checked={isChecked}
                onCheckedChange={handleCheckboxChange}
                className="border-white checked:bg-blue-500 checked:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <h1 className="text-[14px] italic underline underline-offset-2 decoration-1">
                Tài khoản doanh nghiệp
              </h1>
            </div>

            {loading ? (
              <Button
                disabled
                className="w-full mt-5 rounded-full font-bold bg-gray-400"
              >
                Loading...
              </Button>
            ) : isRegistered ? (
              <Link href="/login">
                <Button
                  className="w-full mt-5 rounded-full font-bold bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    window.open(
                      "https://mail.google.com/mail",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <CiMail size={20} />
                  Xác nhận
                </Button>
              </Link>
            ) : (
              <Button
                type="submit"
                className="w-full mt-5 rounded-full font-bold bg-indigo-600 hover:bg-indigo-700"
              >
                Đăng ký
              </Button>
            )}
          </form>
        </div>
        <div className="relative hidden md:block">
          <Image
            src="/bg.jpg"
            className="object-cover"
            fill={true}
            alt="Background image"
          />
        </div>
      </div>
    </main>
  );
}
