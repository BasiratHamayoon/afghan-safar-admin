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
  const t = useTranslations("destinationsPage");
  const router = useRouter();
  const { addDestination } = useContext(ContextAdmin);

  const [images, setImages] = useState([]);
  const [highlights, setHighlights] = useState([""]);
  const [travelTips, setTravelTips] = useState([""]);
  const [isActive, setIsActive] = useState(true);
  const [isRecommended, setIsRecommended] = useState(false);
  const [category, setCategory] = useState("Nature");
  const [currency, setCurrency] = useState("AFN");

  // Safe translation helper
  const getTrans = (key, fallback) => (t.has(key) ? t(key) : fallback);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 8) {
      alert("Maximum 8 images allowed");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const [state, action, isPending] = useActionState(async (prev, formData) => {
    try {
      const data = {
        title: formData.get("title"),
        province: formData.get("province"),
        description: formData.get("description"),
        shortDescription: formData.get("shortDescription") || undefined,
        category,
        bestTimeToVisit: formData.get("bestTimeToVisit") || undefined,
        typicalDuration: formData.get("typicalDuration") || undefined,
        coordinates:
          formData.get("lat") && formData.get("lng")
            ? {
                lat: parseFloat(formData.get("lat")),
                lng: parseFloat(formData.get("lng")),
              }
            : undefined,
        highlights: highlights.filter((h) => h.trim() !== ""),
        travelTips: travelTips.filter((tip) => tip.trim() !== ""),
        estimatedBudget: {
          min: formData.get("budgetMin")
            ? parseFloat(formData.get("budgetMin"))
            : 0,
          max: formData.get("budgetMax")
            ? parseFloat(formData.get("budgetMax"))
            : 0,
          currency,
        },
        images,
        isActive,
        isRecommended,
        recommendationOrder:
          isRecommended && formData.get("recommendationOrder")
            ? parseInt(formData.get("recommendationOrder"))
            : undefined,
      };

      const res = await addDestination(data);

      if (res?.success) {
        setTimeout(() => {
          router.push("/destinations");
        }, 1500);
        return {
          success: true,
          msg: res.message || "Destination added successfully!",
        };
      } else {
        let msg = res?.message || "Failed to add destination.";
        if (res?.errors) {
          res.errors.forEach((err) => {
            msg += `\n${err.msg}`;
          });
        }
        return { success: false, msg };
      }
    } catch (err) {
      return { success: false, msg: "Something went wrong. Please try again." };
    }
  }, null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col mb-5">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {getTrans("AddDestination", "Add Destination")}
        </h3>
      </div>

      <form
        action={action}
        className="grid grid-cols-1 md:grid-cols-2 gap-[20px]"
      >
        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="title">
            {getTrans("Title", "Title")} <span className="text-error-500">*</span>
          </Label>
          <Input required={true} name="title" id="title" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="province">
            {getTrans("Province", "Province")} <span className="text-error-500">*</span>
          </Label>
          <Input required={true} name="province" id="province" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>
            {getTrans("Category", "Category")} <span className="text-error-500">*</span>
          </Label>
          <Select
            options={[
              { label: getTrans("Nature", "Nature"), value: "Nature" },
              { label: getTrans("Historical", "Historical"), value: "Historical" },
              { label: getTrans("Cultural", "Cultural"), value: "Cultural" },
              { label: getTrans("Religious", "Religious"), value: "Religious" },
              { label: getTrans("Adventure", "Adventure"), value: "Adventure" },
              { label: getTrans("Modern", "Modern"), value: "Modern" },
            ]}
            defaultValue="Nature"
            onChange={(val) => setCategory(val)}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="bestTimeToVisit">{getTrans("BestTime", "Best Time to Visit")}</Label>
          <Input
            name="bestTimeToVisit"
            id="bestTimeToVisit"
            placeholder="e.g. May to September"
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="typicalDuration">{getTrans("Duration", "Duration")}</Label>
          <Input
            name="typicalDuration"
            id="typicalDuration"
            placeholder="e.g. 1-2 days"
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{getTrans("EstimatedBudget", "Estimated Budget")}</Label>
          <div className="flex gap-2">
            <Input
              name="budgetMin"
              type="number"
              placeholder={getTrans("MinBudget", "Min Budget")}
              min="0"
            />
            <Input
              name="budgetMax"
              type="number"
              placeholder={getTrans("MaxBudget", "Max Budget")}
              min="0"
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
            defaultValue="AFN"
            onChange={(val) => setCurrency(val)}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{getTrans("Coordinates", "Coordinates")}</Label>
          <div className="flex gap-2">
            <Input
              name="lat"
              type="number"
              step="any"
              placeholder="Latitude"
            />
            <Input
              name="lng"
              type="number"
              step="any"
              placeholder="Longitude"
            />
          </div>
        </div>

        <div className="col-span-2">
          <Label htmlFor="shortDescription">{getTrans("ShortDescription", "Short Description")}</Label>
          <Input name="shortDescription" id="shortDescription" />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">
            {getTrans("Description", "Description")} <span className="text-error-500">*</span>
          </Label>
          <textarea
            required
            name="description"
            id="description"
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
            defaultValue="true"
            onChange={(val) => setIsActive(val === "true")}
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
              defaultValue="false"
              onChange={(val) => setIsRecommended(val === "true")}
            />
            {isRecommended && (
              <Input
                name="recommendationOrder"
                type="number"
                min="1"
                placeholder={getTrans("RecommendationOrder", "Recommendation Order")}
              />
            )}
          </div>
        </div>

        <div className="col-span-2">
          <Label>{getTrans("Images", "Images")} (max 8)</Label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt={`preview-${i}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-2">
          <Label>{getTrans("Highlights", "Highlights")}</Label>
          {highlights.map((h, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input
                value={h}
                onChange={(e) =>
                  setHighlights((prev) => {
                    const temp = [...prev];
                    temp[i] = e.target.value;
                    return temp;
                  })
                }
              />
              {highlights.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setHighlights((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setHighlights((prev) => [...prev, ""])}
            className="text-sm text-brand-500 hover:underline"
          >
            + Add
          </button>
        </div>

        <div className="col-span-2">
          <Label>{getTrans("TravelTips", "Travel Tips")}</Label>
          {travelTips.map((tip, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input
                value={tip}
                onChange={(e) =>
                  setTravelTips((prev) => {
                    const temp = [...prev];
                    temp[i] = e.target.value;
                    return temp;
                  })
                }
              />
              {travelTips.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setTravelTips((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setTravelTips((prev) => [...prev, ""])}
            className="text-sm text-brand-500 hover:underline"
          >
            + Add
          </button>
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
    </div>
  );
};

export default page;