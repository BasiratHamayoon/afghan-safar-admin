"use client";
import React, { useActionState, useContext, useState } from "react";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { useTranslations } from "next-intl";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { useRouter } from "next/navigation";

const page = () => {
  const t = useTranslations("bannersPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb || key);
  const router = useRouter();
  const { createBanner } = useContext(ContextAdmin);

  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const cleanStr = (val) => (val && val.toString().trim() !== "" ? val.toString().trim() : undefined);

  const [state, action, isPending] = useActionState(async (prev, formData) => {
    try {
      if (!image) {
        return { success: false, msg: gt("ImageRequiredError", "Please upload a banner image.") };
      }

      const data = {
        name: cleanStr(formData.get("name")),
        description: cleanStr(formData.get("description")),
        image,
        link: cleanStr(formData.get("link")) || null,
        order: parseInt(formData.get("order")) || 0,
        isActive,
      };

      const res = await createBanner(data);
      if (res?.success) {
        setTimeout(() => router.push("/banners"), 1500);
        return { success: true, msg: res.message || "Banner created successfully!" };
      } else {
        let msg = res?.message || "Failed to create banner.";
        if (res?.errors) {
          res.errors.forEach((e) => {
            msg += `\n${e.msg}`;
          });
        }
        return { success: false, msg };
      }
    } catch (err) {
      return { success: false, msg: "Something went wrong." };
    }
  }, null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90 mb-5">
        {gt("AddBanner", "Add Banner")}
      </h3>

      <form action={action} className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {/* Banner Name */}
        <div className="col-span-2">
          <Label>{gt("BannerName", "Banner Name")} *</Label>
          <Input required name="name" id="name" placeholder={gt("BannerNamePlaceholder", "e.g., Summer Promotion 2025")} />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <Label>{gt("Description", "Description")} *</Label>
          <textarea
            required
            name="description"
            id="description"
            rows={3}
            placeholder={gt("DescriptionPlaceholder", "Provide a brief description of the banner...")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        {/* Action Link */}
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Link", "Link (Optional)")}</Label>
          <Input name="link" id="link" type="url" placeholder="https://example.com/promo" />
        </div>

        {/* Order */}
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Order", "Display Order")}</Label>
          <Input name="order" id="order" type="number" min="0" defaultValue="0" />
        </div>

        {/* Status */}
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Status", "Status")}</Label>
          <Select
            options={[
              { label: gt("Active", "Active"), value: "true" },
              { label: gt("Inactive", "Inactive"), value: "false" },
            ]}
            defaultValue="true"
            onChange={(v) => setIsActive(v === "true")}
          />
        </div>

        {/* Upload Banner Image */}
        <div className="col-span-2">
          <Label>{gt("BannerImage", "Banner Image")} *</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
          />
          {image && (
            <div className="mt-3 relative inline-block">
              <img src={image} alt="Preview" className="w-full max-w-xl h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {state && (
          <div className="col-span-2">
            <Alert
              message={state.msg}
              title={state.success ? gt("Success", "Success") : gt("Error", "Error")}
              variant={state.success ? "success" : "error"}
            />
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center col-span-2 gap-3 px-2 lg:justify-end">
          <Button
            size="sm"
            onClick={() => router.push("/banners")}
            variant="outline"
            type="button"
            disabled={isPending}
          >
            {gt("Cancel", "Cancel")}
          </Button>
          <Button size="sm" disabled={isPending} type="submit">
            {isPending ? "..." : gt("Save", "Save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;