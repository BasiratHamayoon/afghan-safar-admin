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
  const t = useTranslations("hotelsPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb || key);
  const router = useRouter();
  const { addHotel } = useContext(ContextAdmin);

  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([""]);
  const [propertyType, setPropertyType] = useState("Hotel");
  const [starRating, setStarRating] = useState(3);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const cleanStr = (val) => (val && val.toString().trim() !== "" ? val.toString().trim() : undefined);

  const [state, action, isPending] = useActionState(async (prev, formData) => {
    try {
      const emailVal = cleanStr(formData.get("email"));
      const contactInfo = {
        phone: cleanStr(formData.get("phone")),
        whatsappNumber: cleanStr(formData.get("whatsapp")),
        website: cleanStr(formData.get("website")),
      };
      if (emailVal) contactInfo.email = emailVal;

      const data = {
        name: cleanStr(formData.get("name")),
        propertyType,
        starRating: parseInt(starRating) || 3,
        location: cleanStr(formData.get("location")),
        province: cleanStr(formData.get("province")),
        address: cleanStr(formData.get("address")) || "",
        description: cleanStr(formData.get("description")),
        shortDescription: cleanStr(formData.get("shortDescription")),
        amenities: amenities.filter((a) => a && a.trim() !== ""),
        images,
        contactInfo,
        policies: {
          checkInTime: cleanStr(formData.get("checkInTime")) || "14:00",
          checkOutTime: cleanStr(formData.get("checkOutTime")) || "12:00",
          cancellationPolicy: cleanStr(formData.get("cancellationPolicy")),
          petPolicy: cleanStr(formData.get("petPolicy")),
        },
        isActive: true,
      };

      const res = await addHotel(data);
      if (res?.success) {
        setTimeout(() => router.push("/hotels"), 1500);
        return { success: true, msg: res.message || "Hotel added successfully!" };
      } else {
        let msg = res?.message || "Failed to add hotel.";
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
        {gt("AddHotel", "Add Hotel")}
      </h3>

      <form action={action} className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Name", "Name")} *</Label>
          <Input required name="name" id="name" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Province", "Province")} *</Label>
          <Input required name="province" id="province" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Location", "Location")} *</Label>
          <Input required name="location" id="location" placeholder="e.g. Kabul, Shahr-e-Naw" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Address", "Address")}</Label>
          <Input name="address" id="address" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("PropertyType", "Property Type")}</Label>
          <Select
            options={[
              { label: "Hotel", value: "Hotel" },
              { label: "Resort", value: "Resort" },
              { label: "Villa", value: "Villa" },
              { label: "Guest House", value: "GuestHouse" },
              { label: "Apartment", value: "Apartment" },
              { label: "Hostel", value: "Hostel" },
            ]}
            defaultValue="Hotel"
            onChange={(v) => setPropertyType(v)}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("StarRating", "Star Rating")}</Label>
          <Select
            options={[1, 2, 3, 4, 5].map((n) => ({ label: "⭐".repeat(n), value: String(n) }))}
            defaultValue="3"
            onChange={(v) => setStarRating(parseInt(v))}
          />
        </div>
        <div className="col-span-2">
          <Label>{gt("ShortDescription", "Short Description")}</Label>
          <Input name="shortDescription" id="shortDescription" />
        </div>
        <div className="col-span-2">
          <Label>{gt("Description", "Description")} *</Label>
          <textarea
            required
            name="description"
            id="description"
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        {/* Contact Info */}
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Phone", "Phone")}</Label>
          <Input name="phone" id="phone" type="tel" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Email", "Email")}</Label>
          <Input name="email" id="email" type="email" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>WhatsApp</Label>
          <Input name="whatsapp" id="whatsapp" type="tel" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Website", "Website")}</Label>
          <Input name="website" id="website" type="url" />
        </div>

        {/* Policies */}
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("CheckInTime", "Check-in Time")}</Label>
          <Input name="checkInTime" id="checkInTime" defaultValue="14:00" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("CheckOutTime", "Check-out Time")}</Label>
          <Input name="checkOutTime" id="checkOutTime" defaultValue="12:00" />
        </div>
        <div className="col-span-2">
          <Label>{gt("CancellationPolicy", "Cancellation Policy")}</Label>
          <Input name="cancellationPolicy" id="cancellationPolicy" />
        </div>

        {/* Amenities */}
        <div className="col-span-2">
          <Label>{gt("Amenities", "Amenities")}</Label>
          {amenities.map((a, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input
                value={a}
                onChange={(e) =>
                  setAmenities((p) => {
                    const temp = [...p];
                    temp[i] = e.target.value;
                    return temp;
                  })
                }
                placeholder="e.g. Free WiFi"
              />
              {amenities.length > 1 && (
                <button
                  type="button"
                  onClick={() => setAmenities((p) => p.filter((_, idx) => idx !== i))}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setAmenities((p) => [...p, ""])}
            className="text-sm text-brand-500 hover:underline"
          >
            + Add
          </button>
        </div>

        {/* Images */}
        <div className="col-span-2">
          <Label>{gt("Images", "Images")} (max 10)</Label>
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
                  <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
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
    </div>
  );
};

export default page;