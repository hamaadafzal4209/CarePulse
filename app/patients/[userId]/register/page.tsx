import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  return (
    <div>
      <div className="flex h-screen max-h-screen">
        <section className="remove-scrollbar container ">
          <div className="sub-container max-w-3xl flex-1 w-full">
            <Image
              width={1000}
              height={1000}
              src="/assets/icons/logo-full.svg"
              alt="CarePulse"
              className="h-10 w-fit mb-8"
            />

            <RegisterForm user={user} />

            <div className="text-14-regular mt-20">
              <p className="text-dark-600 pb-8">© 2024 CarePualse </p>
            </div>
          </div>
        </section>
        <Image
          width={1000}
          height={1000}
          src="/assets/images/register-img.png"
          alt="Patient"
          className="side-img max-w-[50%]"
        />
      </div>
    </div>
  );
};

export default Register;
