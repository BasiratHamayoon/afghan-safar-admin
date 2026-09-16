"use client";
import React, { useActionState, useContext, useState } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { ContextAdmin } from "@/context/MainStateAdmin";

const BannerForm = ({ gt, isEdit, banner, onSuccess }) => {
  const { createBanner, editBanner } = useContext(ContextAdmin);
  const [image, setImage] = useState(banner?.image || null);
  const [isActive, setIsActive] = useState(banner?.isActive !== undefined ? banner.isActive : true);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const [state, action, isPending] = useActionState(async (prev, formData) => {
    try {
      if (!image) {
        return { success: false, msg: "Please upload a banner image." };
      }

      const payload = {
        name: formData.get("name"),
        description: formData.get("description"),
        image,
        link: formData.get("link") || null,
        order: parseInt(formData.get("order")) || 0,
        isActive,
      };

      let res;
      if (isEdit) {
        res = await editBanner({ ...payload, bannerId: banner._id });
      } else {
        res = await createBanner(payload);
      }

      if (res?.success) {
        setTimeout(() => onSuccess(), 700);
        return { success: true, msg: res.message };
      }
      return { success: false, msg: res?.message || "Failed" };
    } catch (err) {
      return { success: false, msg: err.message || "Error" };
    }
  }, null);

  return (
    <form action={action} className="pt-[40px] pb-[20px] px-[24px] flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        {isEdit ? gt("EditBanner", "Edit Banner") : gt("AddNewBanner", "Add New Banner")}
      </h3>

      <div>
        <Label>{gt("BannerName", "Banner Name")} *</Label>
        <Input name="name" defaultValue={banner?.name} placeholder="e.g. Summer Sale 2025" required />
      </div>

      <div>
        <Label>{gt("Description", "Description")} *</Label>
        <textarea
          name="description"
          defaultValue={banner?.description}
          rows={3}
          placeholder="Brief description of the banner..."
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />
      </div>

      <div>
        <Label>{gt("Link", "Link (Optional)")}</Label>
        <Input name="link" defaultValue={banner?.link} placeholder="https://example.com/promo" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{gt("Order", "Display Order")}</Label>
          <Input name="order" type="number" min="0" defaultValue={banner?.order || 0} placeholder="0" />
        </div>

        <div>
          <Label>{gt("Status", "Status")}</Label>
          <Select
            options={[
              { label: gt("Active", "Active"), value: "true" },
              { label: gt("Inactive", "Inactive"), value: "false" },
            ]}
            defaultValue={isActive ? "true" : "false"}
            onChange={(v) => setIsActive(v === "true")}
          />
        </div>
      </div>

      <div>
        <Label>{gt("BannerImage", "Banner Image")} *</Label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-500 file:text-white file:cursor-pointer hover:file:bg-brand-600"
        />
        {image && (
          <div className="mt-3 relative">
            <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {state && (
        <Alert
          message={state.msg}
          title={state.success ? gt("Success", "Success") : gt("Error", "Error")}
          variant={state.success ? "success" : "error"}
        />
      )}

      <div className="flex items-center gap-3 justify-end mt-2">
        <Button size="sm" disabled={isPending} type="submit">
          {isPending ? "..." : isEdit ? gt("Save", "Save") : gt("CreateBanner", "Create Banner")}
        </Button>
      </div>
    </form>
  );
};

export default BannerForm;