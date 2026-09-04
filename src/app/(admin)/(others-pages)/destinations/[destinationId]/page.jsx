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
  const t = useTranslations("destinationsPage");
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const router = useRouter();
  const { destinationId } = useParams();
  const {
    loading,
    destinationsCardsData,
    fetchDestinationById,
    editDestination,
    deleteDestinations,
    companyUser,
  } = useContext(ContextAdmin);

  const [destination, setDestination] = useState(false);
  const [relatedDestinations, setRelatedDestinations] = useState([]);

  // Safe translation helper
  const getTrans = (key, fallback) => (t.has(key) ? t(key) : fallback);

  const getDestinationDetails = async () => {
    const existing = destinationsCardsData?.data?.find(
      (item) => item._id === destinationId
    );
    if (!existing) {
      const res = await fetchDestinationById(destinationId);
      if (res?.data) {
        setDestination(res.data);
        setRelatedDestinations(res.related || []);
      }
    } else {
      setDestination(existing);
    }
  };

  useEffect(() => {
    if (companyUser !== null) getDestinationDetails();
  }, [companyUser]);

  const deleteDestinationFunc = async () => {
    const data = await deleteDestinations({ ids: [destinationId] });
    if (data?.success) {
      closeDeleteModal();
      router.push("/destinations");
    }
  };

  const budget = destination?.estimatedBudget || {};

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      {destination ? (
        <>
          <div className="flex flex-row flex-wrap items-center justify-between">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-col mb-5">
                <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
                  {getTrans("DestinationDetails", "Destination Details")}
                </h3>
                <p className="bk-16 !text-gray-800 dark:!text-gray-300 text-base font-normal leading-normal">
                  {getTrans("DestinationDetailsSubtitle", "View and manage destination details")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size={"md"} onClick={openModal}>
                  {getTrans("Edit", "Edit")}
                </Button>
                <Button
                  startIcon={<TrashBinIcon />}
                  className={"bg-error-600 h-[35px] hover:bg-error-700"}
                  onClick={openDeleteModal}
                >
                  {getTrans("Delete", "Delete")}
                </Button>
              </div>
            </div>

            {/* Images grid */}
            {destination.images && destination.images.length > 0 && (
              <div className="w-full mb-5">
                <p className="mb-2 med-14">{getTrans("Images", "Images")}</p>
                <div className="flex flex-wrap gap-3">
                  {destination.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${destination.title}-${idx}`}
                      className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col w-full">
              <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                <InfoRow label={getTrans("Title", "Title")} value={destination?.title} />
                <InfoRow label={getTrans("Province", "Province")} value={destination?.province} />
                <InfoRow
                  label={getTrans("Category", "Category")}
                  comp={true}
                  value={
                    <span className="px-3 py-1 text-xs rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 w-fit">
                      {destination?.category}
                    </span>
                  }
                />
                <InfoRow
                  label={getTrans("Status", "Status")}
                  comp={true}
                  value={
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          destination.isActive
                            ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                        }`}
                      >
                        {destination.isActive ? getTrans("Active", "Active") : getTrans("Inactive", "Inactive")}
                      </span>
                      {destination.isRecommended && (
                        <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400">
                          ★ {getTrans("Recommended", "Recommended")}
                        </span>
                      )}
                    </div>
                  }
                />
                <InfoRow
                  label={getTrans("BestTime", "Best Time")}
                  value={destination?.bestTimeToVisit}
                />
                <InfoRow
                  label={getTrans("Duration", "Duration")}
                  value={destination?.typicalDuration}
                />
                <InfoRow
                  label={getTrans("EstimatedBudget", "Estimated Budget")}
                  value={`${budget.min || 0} - ${budget.max || 0} ${
                    budget.currency || "AFN"
                  }`}
                />
                <InfoRow
                  label={getTrans("Coordinates", "Coordinates")}
                  value={
                    destination?.coordinates?.lat &&
                    destination?.coordinates?.lng
                      ? `${destination.coordinates.lat}, ${destination.coordinates.lng}`
                      : "N/A"
                  }
                />

                <div className="col-span-2 border-t border-t-[#D5D6DD] py-5">
                  <p className="mb-2 med-14">{getTrans("ShortDescription", "Short Description")}</p>
                  <p className="bk-14 !text-gray-700 dark:!text-gray-300">
                    {destination?.shortDescription || "N/A"}
                  </p>
                </div>

                <div className="col-span-2 border-t border-t-[#D5D6DD] py-5">
                  <p className="mb-2 med-14">{getTrans("Description", "Description")}</p>
                  <p className="bk-14 !text-gray-700 dark:!text-gray-300 whitespace-pre-wrap">
                    {destination?.description}
                  </p>
                </div>

                {destination?.highlights &&
                  destination.highlights.length > 0 && (
                    <div className="col-span-2 border-t border-t-[#D5D6DD] py-5">
                      <p className="mb-2 med-14">{getTrans("Highlights", "Highlights")}</p>
                      <ul className="pl-5 text-sm text-gray-700 list-disc dark:text-gray-300">
                        {destination.highlights.map((h, idx) => (
                          <li key={idx} className="bk-14">
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {destination?.travelTips &&
                  destination.travelTips.length > 0 && (
                    <div className="col-span-2 border-t border-t-[#D5D6DD] py-5">
                      <p className="mb-2 med-14">{getTrans("TravelTips", "Travel Tips")}</p>
                      <ul className="pl-5 text-sm text-gray-700 list-disc dark:text-gray-300">
                        {destination.travelTips.map((tip, idx) => (
                          <li key={idx} className="bk-14">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                <InfoRow
                  label={getTrans("CreatedAt", "Created At")}
                  value={new Date(destination?.createdAt).toDateString()}
                />
              </div>
            </div>

            {/* Related destinations */}
            {relatedDestinations.length > 0 && (
              <div className="w-full mt-6">
                <h4 className="med-18 mb-3 !text-gray-800 dark:!text-gray-200">
                  {getTrans("RelatedDestinations", "Related Destinations")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedDestinations.map((rel) => (
                    <div
                      key={rel._id}
                      onClick={() => router.push("/destinations/" + rel._id)}
                      className="cursor-pointer border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition"
                    >
                      {rel.images?.[0] && (
                        <img
                          src={rel.images[0]}
                          alt={rel.title}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-3">
                        <p className="med-14 !text-gray-800 dark:!text-gray-200">
                          {rel.title}
                        </p>
                        <p className="bk-12 text-gray-500">{rel.province}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <NotFound
          heading={getTrans("DestinationNotFound", "Destination Not Found")}
          desc={getTrans("DestinationNotFoundDescription", "The requested destination could not be found.")}
          loading={loading}
          loadingText={getTrans("LoadingDestination", "Loading...")}
          loadingDesc={getTrans("LoadingDestinationDescription", "Retrieving details from server.")}
        />
      )}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] max-h-[85vh] overflow-y-scroll"
      >
        <EditForm
          t={t}
          getTrans={getTrans}
          destination={destination}
          editDestination={editDestination}
        />
      </Modal>

      <ModelActions
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        className="max-w-md m-4"
        selectedIds={[destinationId]}
        type={getTrans("Delete", "Delete")}
        name={getTrans("Destination", "Destination")}
        loading={loading}
        clickFunc={deleteDestinationFunc}
        des={getTrans("DeleteWarning", "This action is irreversible.")}
      />
    </div>
  );
};

export default page;

const InfoRow = ({ label, value, comp }) => (
  <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-[#D5D6DD] dark:border-t-gray-300">
    <p className="med-14 whitespace-nowrap w-[20ch]">{label}</p>
    {comp ? value : <p className="bk-14">{value || "N/A"}</p>}
  </div>
);

const EditForm = ({ t, getTrans, destination, editDestination }) => {
  const [category, setCategory] = useState(destination?.category || "Nature");
  const [isActive, setIsActive] = useState(destination?.isActive ?? true);
  const [isRecommended, setIsRecommended] = useState(
    destination?.isRecommended ?? false
  );

  const [state, action, isPending] = useActionState(async (prev, formData) => {
    try {
      const data = {
        destinationId: destination._id,
        title: formData.get("title"),
        province: formData.get("province"),
        description: formData.get("description"),
        shortDescription: formData.get("shortDescription") || undefined,
        category,
        bestTimeToVisit: formData.get("bestTimeToVisit") || undefined,
        typicalDuration: formData.get("typicalDuration") || undefined,
        estimatedBudget: {
          min: formData.get("budgetMin")
            ? parseFloat(formData.get("budgetMin"))
            : 0,
          max: formData.get("budgetMax")
            ? parseFloat(formData.get("budgetMax"))
            : 0,
          currency: formData.get("currency") || "AFN",
        },
        isActive,
        isRecommended,
      };

      const res = await editDestination(data);

      if (res?.success) {
        window.location.reload();
        return { success: true, msg: res.message };
      } else {
        let msg = res?.message || "";
        if (res?.errors) {
          res.errors.forEach((err) => {
            msg += `\n${err.msg}`;
          });
        }
        return { success: false, msg };
      }
    } catch (err) {
      return { success: false, msg: "Something went wrong" };
    }
  }, null);

  return (
    <form
      action={action}
      className="grid grid-cols-1 md:grid-cols-2 pt-[50px] pb-[20px] px-[24px] gap-[20px]"
    >
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("Title", "Title")} *</Label>
        <Input
          name="title"
          defaultValue={destination?.title}
          required={true}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("Province", "Province")} *</Label>
        <Input
          name="province"
          defaultValue={destination?.province}
          required={true}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("Category", "Category")}</Label>
        <Select
          options={[
            { label: getTrans("Nature", "Nature"), value: "Nature" },
            { label: getTrans("Historical", "Historical"), value: "Historical" },
            { label: getTrans("Cultural", "Cultural"), value: "Cultural" },
            { label: getTrans("Religious", "Religious"), value: "Religious" },
            { label: getTrans("Adventure", "Adventure"), value: "Adventure" },
            { label: getTrans("Modern", "Modern"), value: "Modern" },
          ]}
          defaultValue={destination?.category}
          onChange={(val) => setCategory(val)}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("BestTime", "Best Time")}</Label>
        <Input
          name="bestTimeToVisit"
          defaultValue={destination?.bestTimeToVisit}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("Duration", "Duration")}</Label>
        <Input
          name="typicalDuration"
          defaultValue={destination?.typicalDuration}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("EstimatedBudget", "Estimated Budget")}</Label>
        <div className="flex gap-2">
          <Input
            name="budgetMin"
            type="number"
            defaultValue={destination?.estimatedBudget?.min}
            placeholder={getTrans("MinBudget", "Min Budget")}
          />
          <Input
            name="budgetMax"
            type="number"
            defaultValue={destination?.estimatedBudget?.max}
            placeholder={getTrans("MaxBudget", "Max Budget")}
          />
        </div>
      </div>
      <div className="col-span-2">
        <Label>{getTrans("ShortDescription", "Short Description")}</Label>
        <Input
          name="shortDescription"
          defaultValue={destination?.shortDescription}
        />
      </div>
      <div className="col-span-2">
        <Label>{getTrans("Description", "Description")} *</Label>
        <textarea
          name="description"
          defaultValue={destination?.description}
          required={true}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("IsActive", "Is Active")}</Label>
        <Select
          options={[
            { label: getTrans("Active", "Active"), value: "true" },
            { label: getTrans("Inactive", "Inactive"), value: "false" },
          ]}
          defaultValue={destination?.isActive ? "true" : "false"}
          onChange={(val) => setIsActive(val === "true")}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("IsRecommended", "Is Recommended")}</Label>
        <Select
          options={[
            { label: getTrans("No", "No"), value: "false" },
            { label: getTrans("Yes", "Yes"), value: "true" },
          ]}
          defaultValue={destination?.isRecommended ? "true" : "false"}
          onChange={(val) => setIsRecommended(val === "true")}
        />
      </div>

      {state && (
        <div className="col-span-2">
          <Alert
            message={state.msg}
            title={state.success ? getTrans("Success", "Success") : getTrans("Error", "Error")}
            variant={state.success ? "success" : "error"}
          />
        </div>
      )}

      <div className="flex items-center col-span-2 gap-3 px-2 lg:justify-end">
        <Button size="sm" disabled={isPending} type="submit">
          {getTrans("Save", "Save")}
        </Button>
      </div>
    </form>
  );
};