"use client";
import NotFound from "@/components/ui/NotFound";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { useParams, useRouter } from "next/navigation";
import React, { useActionState, useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/alert/Alert";
import { TrashBinIcon } from "@/icons";
import ModelActions from "@/components/ui/modal/ModelActions";

const page = () => {
  const t = useTranslations("bannersPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb || key);

  const router = useRouter();
  const { bannerId } = useParams();
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isDel, openModal: openDel, closeModal: closeDel } = useModal();

  const { loading, fetchBannerById, editBanner, deleteBanner } = useContext(ContextAdmin);

  const [banner, setBanner] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const loadBanner = async () => {
    const res = await fetchBannerById(bannerId);
    if (res?.data) setBanner(res.data);
    setPageLoading(false);
  };

  useEffect(() => {
    loadBanner();
  }, [bannerId]);

  const handleBannerUpdate = (updatedBanner) => {
    setBanner(updatedBanner);
  };

  const deleteFunc = async () => {
    const data = await deleteBanner(bannerId);
    if (data?.success) {
      closeDel();
      router.push("/banners");
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!banner) {
    return (
      <NotFound
        heading={gt("BannerNotFound", "Banner Not Found")}
        desc=""
        loading={false}
        loadingText=""
        loadingDesc=""
      />
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-row items-center justify-between w-full mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
            {gt("BannerDetails", "Banner Details")}
          </h3>
          <p className="bk-16 !text-gray-800 dark:!text-gray-300">
            {gt("BannerDetailsSubtitle", "View and manage banner information")}
          </p>
        </div>
        {/* Buttons - Both have same fixed height (h-[35px]) */}
        <div className="flex items-center gap-2">
          <Button
            size="md"
            className="h-[35px]"
            onClick={openModal}
          >
            {gt("Edit", "Edit")}
          </Button>
          <Button
            startIcon={<TrashBinIcon />}
            className="bg-error-600 h-[35px] hover:bg-error-700"
            onClick={openDel}
          >
            {gt("Delete", "Delete")}
          </Button>
        </div>
      </div>

      {/* Preview Banner Image */}
      {banner.image && (
        <div className="mb-5">
          <img
            src={banner.image}
            alt={banner.name}
            className="w-full max-h-96 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
          />
        </div>
      )}

      {/* Banner Info */}
      <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
        <InfoRow label={gt("BannerName", "Banner Name")} value={banner.name} />
        <InfoRow
          label={gt("Status", "Status")}
          comp
          value={
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                banner.isActive
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {banner.isActive ? gt("Active", "Active") : gt("Inactive", "Inactive")}
            </span>
          }
        />
        <InfoRow label={gt("Order", "Display Order")} value={`#${banner.order || 0}`} />
        {banner.link && (
          <InfoRow
            label={gt("Link", "Link")}
            comp
            value={
              <a
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-500 hover:text-brand-600 underline text-sm"
              >
                {banner.link}
              </a>
            }
          />
        )}

        <div className="col-span-2 border-t border-t-[#D5D6DD] py-5 dark:border-t-gray-700">
          <p className="mb-2 med-14">{gt("Description", "Description")}</p>
          <p className="bk-14 !text-gray-700 dark:!text-gray-300 whitespace-pre-wrap">
            {banner.description}
          </p>
        </div>

        <InfoRow
          label={gt("CreatedAt", "Created At")}
          value={new Date(banner.createdAt).toLocaleString()}
        />
        {banner.updatedAt && banner.updatedAt !== banner.createdAt && (
          <InfoRow
            label={gt("UpdatedAt", "Last Updated")}
            value={new Date(banner.updatedAt).toLocaleString()}
          />
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] max-h-[85vh] overflow-y-scroll"
      >
        <EditForm
          gt={gt}
          banner={banner}
          editBanner={editBanner}
          onUpdate={handleBannerUpdate}
          closeModal={closeModal}
        />
      </Modal>

      {/* Delete Modal */}
      <ModelActions
        isOpen={isDel}
        onClose={closeDel}
        className="max-w-md m-4"
        selectedIds={[bannerId]}
        type={gt("Delete", "Delete")}
        name={gt("Banner", "Banner")}
        loading={loading}
        clickFunc={deleteFunc}
        des={gt("DeleteWarning", "This cannot be undone.")}
      />
    </div>
  );
};

export default page;

const InfoRow = ({ label, value, comp }) => (
  <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-[#D5D6DD] dark:border-t-gray-700">
    <p className="med-14 whitespace-nowrap w-[20ch]">{label}</p>
    {comp ? value : <p className="bk-14">{value || "N/A"}</p>}
  </div>
);

const EditForm = ({ gt, banner, editBanner, onUpdate, closeModal }) => {
  const [image, setImage] = useState(banner?.image || null);
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const [state, action, isPending] = useActionState(async (prev, formData) => {
    try {
      const data = {
        bannerId: banner._id,
        name: formData.get("name"),
        description: formData.get("description"),
        image,
        link: formData.get("link") || null,
        order: parseInt(formData.get("order")) || 0,
        isActive,
      };
      const res = await editBanner(data);
      if (res?.success) {
        onUpdate(res.data);
        closeModal();
        return { success: true, msg: res.message };
      }
      return { success: false, msg: res?.message || "Failed" };
    } catch {
      return { success: false, msg: "Error" };
    }
  }, null);

  return (
    <form action={action} className="grid grid-cols-1 md:grid-cols-2 pt-[50px] pb-[20px] px-[24px] gap-[20px]">
      <div className="col-span-2">
        <Label>{gt("BannerName", "Banner Name")} *</Label>
        <Input name="name" defaultValue={banner?.name} required />
      </div>

      <div className="col-span-2">
        <Label>{gt("Description", "Description")} *</Label>
        <textarea
          name="description"
          defaultValue={banner?.description}
          required
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />
      </div>

      <div className="col-span-2 md:col-span-1">
        <Label>{gt("Link", "Link (Optional)")}</Label>
        <Input name="link" defaultValue={banner?.link} type="url" />
      </div>

      <div className="col-span-2 md:col-span-1">
        <Label>{gt("Order", "Display Order")}</Label>
        <Input name="order" type="number" min="0" defaultValue={banner?.order || 0} />
      </div>

      <div className="col-span-2">
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

      <div className="col-span-2">
        <Label>{gt("BannerImage", "Banner Image")}</Label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />
        {image && (
          <div className="mt-3 relative inline-block">
            <img src={image} alt="" className="w-full max-w-md h-40 object-cover rounded-lg border" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
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

      <div className="flex items-center col-span-2 gap-3 px-2 lg:justify-end">
        <Button size="sm" disabled={isPending} type="submit">
          {isPending ? "..." : gt("Save", "Save")}
        </Button>
      </div>
    </form>
  );
};