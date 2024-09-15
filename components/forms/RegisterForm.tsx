"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { userFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import toast from "react-hot-toast";
import { FormFieldType } from "./PatientForm";
import { FileUploader } from "../FileUploader";
import { Doctors, GenderOptions, IdentificationTypes } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof userFormValidation>>({
    resolver: zodResolver(userFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof userFormValidation>) {
    setIsLoading(true);

    try {
      const userData = { name, email: email.trim().toLowerCase(), phone };

      const user = await createUser(userData);

      if (user && user.$id) {
        // Appwrite uses $id for the user ID
        router.push(`/patients/${user.$id}/register`);
      } else {
        console.error("User ID is undefined");
      }
      toast.success("User created successfully");
      console.log("User data:", userData);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 space-y-12"
        >
          <section className="space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Personal Information</h2>
            </div>

            {/* NAME */}

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              placeholder="John Doe"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
            />

            {/* EMAIL & PHONE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email address"
                placeholder="johndoe@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* BirthDate & Gender */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Date of birth"
              />

              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gender"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-11 gap-4 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {GenderOptions.map((option, i) => (
                        <div key={option + i} className="radio-group">
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>

            {/* Address & Occupation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="14 street, New york, NY - 5101"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Occupation"
                placeholder=" Software Engineer"
              />
            </div>

            {/* Emergency Contact Name & Emergency Contact Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                label="Emergency contact name"
                placeholder="Guardian's name"
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Emergency contact number"
                placeholder="(555) 123-4567"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medical Information</h2>
            </div>

            {/* PRIMARY CARE PHYSICIAN */}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Primary care physician"
              placeholder="Select a physician"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            {/* INSURANCE & POLICY NUMBER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insuranceProvider"
                label="Insurance provider"
                placeholder="BlueCross BlueShield"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                label="Insurance policy number"
                placeholder="ABC123456789"
              />
            </div>

            {/* ALLERGY & CURRENT MEDICATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="allergies"
                label="Allergies (if any)"
                placeholder="Peanuts, Penicillin, Pollen"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="currentMedication"
                label="Current medications"
                placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
              />
            </div>

            {/* FAMILY MEDICATION & PAST MEDICATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="familyMedicalHistory"
                label=" Family medical history"
                placeholder="Mother had brain cancer, Father has hypertension"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Past medical history"
                placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification and Verfication</h2>
            </div>

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="identificationType"
              label="Identification Type"
              placeholder="Select identification type"
            >
              {IdentificationTypes.map((type, i) => (
                <SelectItem key={type + i} value={type}>
                  {type}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="identificationNumber"
              label="Identification Number"
              placeholder="123456789"
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="identificationDocument"
              label="Scanned Copy of Identification Document"
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange} />
                </FormControl>
              )}
            />
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Consent and Privacy</h2>
            </div>

            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name="treatmentConsent"
              label="I consent to receive treatment for my health condition."
            />

            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name="disclosureConsent"
              label="I consent to the use and disclosure of my health
            information for treatment purposes."
            />

            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name="privacyConsent"
              label="I acknowledge that I have reviewed and agree to the
            privacy policy"
            />
          </section>

          <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
