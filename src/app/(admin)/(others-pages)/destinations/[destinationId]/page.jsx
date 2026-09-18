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
    fetchDestinationById,
    editDestination,
    deleteDestinations,
    companyUser,
  } = useContext(ContextAdmin);

  // 1. Properly initialized state with loading guard
  const [destination, setDestination] = useState(null);
  const [relatedDestinations, setRelatedDestinations] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const getTrans = (key, fallback) => (t.has(key) ? t(key) : fallback);

  const getDestinationDetails = async () => {
    setPageLoading(true);
    try {
      const res = await fetchDestinationById(destinationId);
      if (res?.data) {
        setDestination(res.data);
        setRelatedDestinations(res.related || []);
      }
    } catch (error) {
      console.error("Error loading destination details:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (companyUser !== null) {
      getDestinationDetails();
    }
  }, [companyUser, destinationId]);

  const handleUpdate = (updatedData) => {
    setDestination(updatedData);
  };

  const deleteDestinationFunc = async () => {
    const data = await deleteDestinations({ ids: [destinationId] });
    if (data?.success) {
      closeDeleteModal();
      router.push("/destinations");
    }
  };

  // 2. Loading Spinner prevents "Data Not Found" from flashing
  if (pageLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  // 3. Only show NotFound if loading finished and no destination exists
  if (!destination) {
    return (
      <NotFound
        heading={getTrans("DestinationNotFound", "Destination Not Found")}
        desc={getTrans("DestinationNotFoundDescription", "The requested destination could not be found.")}
        loading={false}
        loadingText=""
        loadingDesc=""
      />
    );
  }

  const budget = destination?.estimatedBudget || {};

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col gap-5">
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
            <div className="flex items-center gap-2">
              <Button size="md" className="h-[35px]" onClick={openModal}>
                {getTrans("Edit", "Edit")}
              </Button>
              <Button
                startIcon={<TrashBinIcon />}
                className="bg-error-600 h-[35px] hover:bg-error-700"
                onClick={openDeleteModal}
              >
                {getTrans("Delete", "Delete")}
              </Button>
            </div>
          </div>

          {/* Images */}
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

          {/* 360 View */}
          {destination.image360 && (
            <div className="w-full mb-5">
              <p className="mb-2 med-14">{getTrans("Image360", "360° View Image")}</p>
              <img
                src={destination.image360}
                alt="360 view"
                className="w-full max-h-96 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          {/* Details Rows */}
          <div className="flex flex-col w-full">
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              <InfoRow label={getTrans("Title", "Title")} value={destination?.title} />
              <InfoRow label={getTrans("Province", "Province")} value={destination?.province} />
              <InfoRow
                label={getTrans("Category", "Category")}
                comp={true}
                value={
                  <span className="px-3 py-1 text-xs rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 w-fit">
                    {destination?.category || "N/A"}
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
              <InfoRow label={getTrans("BestTime", "Best Time")} value={destination?.bestTimeToVisit || "N/A"} />
              <InfoRow label={getTrans("Duration", "Duration")} value={destination?.typicalDuration || "N/A"} />
              <InfoRow
                label={getTrans("EstimatedBudget", "Estimated Budget")}
                value={`${budget.min || 0} - ${budget.max || 0} ${budget.currency || "AFN"}`}
              />
              <InfoRow
                label={getTrans("Coordinates", "Coordinates")}
                value={
                  destination?.coordinates?.lat && destination?.coordinates?.lng
                    ? `${destination.coordinates.lat}, ${destination.coordinates.lng}`
                    : "N/A"
                }
              />

              <div className="col-span-2 border-t border-t-[#D5D6DD] py-5 dark:border-t-gray-700">
                <p className="mb-2 med-14">{getTrans("ShortDescription", "Short Description")}</p>
                <p className="bk-14 !text-gray-700 dark:!text-gray-300">
                  {destination?.shortDescription || "N/A"}
                </p>
              </div>

              <div className="col-span-2 border-t border-t-[#D5D6DD] py-5 dark:border-t-gray-700">
                <p className="mb-2 med-14">{getTrans("Description", "Description")}</p>
                <p className="bk-14 !text-gray-700 dark:!text-gray-300 whitespace-pre-wrap">
                  {destination?.description}
                </p>
              </div>

              {destination?.highlights && destination.highlights.length > 0 && (
                <div className="col-span-2 border-t border-t-[#D5D6DD] py-5 dark:border-t-gray-700">
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

              {destination?.travelTips && destination.travelTips.length > 0 && (
                <div className="col-span-2 border-t border-t-[#D5D6DD] py-5 dark:border-t-gray-700">
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

          {/* Related */}
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
                      <img src={rel.images[0]} alt={rel.title} className="w-full h-32 object-cover" />
                    )}
                    <div className="p-3">
                      <p className="med-14 !text-gray-800 dark:!text-gray-200">{rel.title}</p>
                      <p className="bk-12 text-gray-500">{rel.province}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. KEY={destination._id} forces EditForm to re-mount with actual loaded values */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] max-h-[85vh] overflow-y-scroll">
        {destination && (
          <EditForm
            key={destination._id}
            t={t}
            getTrans={getTrans}
            destination={destination}
            editDestination={editDestination}
            onUpdate={handleUpdate}
            closeModal={closeModal}
          />
        )}
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
  <div className="col-span-2 md:gap-[35px] py-5 border-t flex flex-row border-t-[#D5D6DD] dark:border-t-gray-700">
    <p className="med-14 whitespace-nowrap w-[20ch]">{label}</p>
    {comp ? value : <p className="bk-14 !text-gray-700 dark:!text-gray-300">{value || "N/A"}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────
// Edit Form Component
// ─────────────────────────────────────────────────────────────
const EditForm = ({ t, getTrans, destination, editDestination, onUpdate, closeModal }) => {
  const [category, setCategory] = useState(destination?.category || "Nature");
  const [currency, setCurrency] = useState(destination?.estimatedBudget?.currency || "AFN");
  const [isActive, setIsActive] = useState(destination?.isActive ?? true);
  const [isRecommended, setIsRecommended] = useState(destination?.isRecommended ?? false);
  const [image360, setImage360] = useState(destination?.image360 || null);
  const [highlightsInput, setHighlightsInput] = useState((destination?.highlights || []).join(", "));
  const [travelTipsInput, setTravelTipsInput] = useState((destination?.travelTips || []).join(", "));

  // Safely extract string from Select value (handles both string and object)
  const extractVal = (val) => {
    if (val === null || val === undefined) return "";
    if (typeof val === "object" && val !== null && "value" in val) return String(val.value);
    return String(val);
  };

  const handle360Change = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage360(reader.result);
    reader.readAsDataURL(file);
  };

  const [state, action, isPending] = useActionState(async (prev, formData) => {
    try {
      const rawTitle = String(formData.get("title") || "").trim();
      const rawProvince = String(formData.get("province") || "").trim();
      const rawDescription = String(formData.get("description") || "").trim();
      const rawShortDesc = String(formData.get("shortDescription") || "").trim();
      const rawBestTime = String(formData.get("bestTimeToVisit") || "").trim();
      const rawDuration = String(formData.get("typicalDuration") || "").trim();

      const targetCategory = extractVal(category) || "Nature";
      const targetCurrency = extractVal(currency) || "AFN";

      const highlightsArr = highlightsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const travelTipsArr = travelTipsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const data = {
        destinationId: destination._id,
        title: rawTitle,
        province: rawProvince,
        description: rawDescription,
        shortDescription: rawShortDesc,
        category: targetCategory,
        bestTimeToVisit: rawBestTime,
        typicalDuration: rawDuration,
        highlights: highlightsArr,
        travelTips: travelTipsArr,
        estimatedBudget: {
          min: formData.get("budgetMin") ? parseFloat(formData.get("budgetMin")) : 0,
          max: formData.get("budgetMax") ? parseFloat(formData.get("budgetMax")) : 0,
          currency: targetCurrency,
        },
        image360: image360 || null,
        isActive: Boolean(isActive),
        isRecommended: Boolean(isRecommended),
      };

      // Coordinates
      const latStr = formData.get("lat");
      const lngStr = formData.get("lng");
      if (latStr && lngStr) {
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (!isNaN(lat) && !isNaN(lng)) {
          data.coordinates = { lat, lng };
        }
      }

      // Recommendation Order
      if (isRecommended && formData.get("recommendationOrder")) {
        const orderVal = parseInt(formData.get("recommendationOrder"));
        if (!isNaN(orderVal)) data.recommendationOrder = orderVal;
      }

      const res = await editDestination(data);

      if (res?.success) {
        onUpdate(res.data);
        closeModal();
        return { success: true, msg: res.message || "Updated successfully!" };
      } else {
        let msg = res?.message || "Failed to update destination.";
        if (res?.errors && Array.isArray(res.errors)) {
          res.errors.forEach((err) => {
            msg += `\n${err.msg || err.message}`;
          });
        }
        return { success: false, msg };
      }
    } catch (err) {
      console.error("Edit error:", err);
      return { success: false, msg: "Something went wrong" };
    }
  }, null);

  return (
    <form action={action} className="grid grid-cols-1 md:grid-cols-2 pt-[50px] pb-[20px] px-[24px] gap-[20px]">
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("Title", "Title")} *</Label>
        <Input name="title" defaultValue={destination?.title || ""} required={true} />
      </div>
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("Province", "Province")} *</Label>
        <Input name="province" defaultValue={destination?.province || ""} required={true} />
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
          defaultValue={destination?.category || "Nature"}
          onChange={(val) => setCategory(extractVal(val))}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("BestTime", "Best Time")}</Label>
        <Input name="bestTimeToVisit" defaultValue={destination?.bestTimeToVisit || ""} placeholder="e.g. May to September" />
      </div>
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("Duration", "Duration")}</Label>
        <Input name="typicalDuration" defaultValue={destination?.typicalDuration || ""} placeholder="e.g. 1-2 days" />
      </div>

      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("EstimatedBudget", "Estimated Budget")}</Label>
        <div className="flex gap-2">
          <Input
            name="budgetMin"
            type="number"
            defaultValue={destination?.estimatedBudget?.min ?? 0}
            placeholder={getTrans("MinBudget", "Min Budget")}
          />
          <Input
            name="budgetMax"
            type="number"
            defaultValue={destination?.estimatedBudget?.max ?? 0}
            placeholder={getTrans("MaxBudget", "Max Budget")}
          />
        </div>
      </div>

      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("Currency", "Currency")}</Label>
        <Select
          options={[
            { label: "AFN", value: "AFN" },
            { label: "USD", value: "USD" },
          ]}
          defaultValue={destination?.estimatedBudget?.currency || "AFN"}
          onChange={(val) => setCurrency(extractVal(val))}
        />
      </div>

      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("Latitude", "Latitude")}</Label>
        <Input name="lat" type="number" step="any" defaultValue={destination?.coordinates?.lat ?? ""} />
      </div>
      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("Longitude", "Longitude")}</Label>
        <Input name="lng" type="number" step="any" defaultValue={destination?.coordinates?.lng ?? ""} />
      </div>

      <div className="col-span-2">
        <Label>{getTrans("ShortDescription", "Short Description")}</Label>
        <Input name="shortDescription" defaultValue={destination?.shortDescription || ""} maxLength={200} />
      </div>

      <div className="col-span-2">
        <Label>{getTrans("Highlights", "Highlights (comma separated)")}</Label>
        <Input
          value={highlightsInput}
          onChange={(e) => setHighlightsInput(e.target.value)}
          placeholder="Historical Tours, Sightseeing, Museums"
        />
      </div>

      <div className="col-span-2">
        <Label>{getTrans("TravelTips", "Travel Tips (comma separated)")}</Label>
        <Input
          value={travelTipsInput}
          onChange={(e) => setTravelTipsInput(e.target.value)}
          placeholder="Bring comfortable shoes, Best at sunset, Hire a guide"
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
          onChange={(val) => setIsActive(extractVal(val) === "true")}
        />
      </div>

      <div className="col-span-2 md:col-span-1">
        <Label>{getTrans("IsRecommended", "Is Recommended")}</Label>
        <div className="flex gap-2">
          <Select
            options={[
              { label: getTrans("No", "No"), value: "false" },
              { label: getTrans("Yes", "Yes"), value: "true" },
            ]}
            defaultValue={destination?.isRecommended ? "true" : "false"}
            onChange={(val) => setIsRecommended(extractVal(val) === "true")}
          />
          {isRecommended && (
            <Input
              name="recommendationOrder"
              type="number"
              min="1"
              defaultValue={destination?.recommendationOrder ?? ""}
              placeholder="Order"
            />
          )}
        </div>
      </div>

      <div className="col-span-2">
        <Label>{getTrans("Image360", "360° Image")}</Label>
        <input
          type="file"
          accept="image/*"
          onChange={handle360Change}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />
        {image360 && (
          <div className="mt-3 relative inline-block">
            <img src={image360} alt="360 edit view" className="w-full max-w-md h-40 object-cover rounded-lg border" />
            <button
              type="button"
              onClick={() => setImage360(null)}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="col-span-2">
        <Label>{getTrans("Description", "Description")} *</Label>
        <textarea
          name="description"
          defaultValue={destination?.description || ""}
          required={true}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
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
          {isPending ? "..." : getTrans("Save", "Save")}
        </Button>
      </div>
    </form>
  );
};