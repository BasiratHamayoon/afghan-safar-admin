"use client";
import React, { useActionState, useContext, useEffect, useState } from "react";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { useTranslations } from "next-intl";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { useRouter, useSearchParams } from "next/navigation";

const page = () => {
  const t = useTranslations("hotelsPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb || key);
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedHotelId = searchParams.get("hotelId");

  const { addRoomToHotel, getHotelsData, hotelsCardsData } = useContext(ContextAdmin);

  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([""]);
  const [type, setType] = useState("Double");
  const [currency, setCurrency] = useState("AFN");
  const [meals, setMeals] = useState("Room Only");
  const [selectedHotelId, setSelectedHotelId] = useState(preselectedHotelId || "");

  useEffect(() => {
    if (!hotelsCardsData?.data?.length) getHotelsData({}, 0, 100);
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const cleanStr = (val) => (val && val.toString().trim() !== "" ? val.toString().trim() : undefined);

  const [state, action, isPending] = useActionState(async (prev, formData) => {
    try {
      if (!selectedHotelId) return { success: false, msg: "Please select a hotel." };

      const data = {
        name: cleanStr(formData.get("name")),
        type,
        description: cleanStr(formData.get("description")) || "",
        capacity: {
          adults: parseInt(formData.get("adults")) || 1,
          children: parseInt(formData.get("children")) || 0,
        },
        bedrooms: parseInt(formData.get("bedrooms")) || 1,
        beds: parseInt(formData.get("beds")) || 1,
        bathrooms: parseInt(formData.get("bathrooms")) || 1,
        bedType: cleanStr(formData.get("bedType")) || "1 King Bed",
        meals,
        roomSizeSqFt: formData.get("roomSizeSqFt") ? parseFloat(formData.get("roomSizeSqFt")) : null,
        pricePerNight: parseFloat(formData.get("pricePerNight")) || 0,
        currency,
        totalRooms: parseInt(formData.get("totalRooms")) || 1,
        amenities: amenities.filter((a) => a && a.trim() !== ""),
        images,
      };

      const res = await addRoomToHotel(selectedHotelId, data);
      if (res?.success) {
        setTimeout(() => router.push(`/hotels/${selectedHotelId}`), 1500);
        return { success: true, msg: res.message || "Room added successfully!" };
      } else {
        let msg = res?.message || "Failed to add room.";
        if (res?.errors) res.errors.forEach((e) => { msg += `\n${e.msg}`; });
        return { success: false, msg };
      }
    } catch (err) {
      return { success: false, msg: "Something went wrong." };
    }
  }, null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90 mb-5">
        {gt("AddRoom", "Add Room")}
      </h3>

      <form action={action} className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {/* Select Hotel */}
        <div className="col-span-2">
          <Label>{gt("SelectHotel", "Select Hotel")} *</Label>
          <Select
            options={(hotelsCardsData?.data || []).map((h) => ({
              label: `${h.name} - ${h.location}`,
              value: h._id,
            }))}
            defaultValue={selectedHotelId}
            onChange={(v) => setSelectedHotelId(v)}
            placeholder={gt("SelectHotelPlaceholder", "Choose a hotel...")}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("RoomName", "Room Name")} *</Label>
          <Input required name="name" placeholder="e.g. Deluxe King Room" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("RoomType", "Room Type")}</Label>
          <Select
            options={[
              { label: "Single", value: "Single" },
              { label: "Double", value: "Double" },
              { label: "Twin", value: "Twin" },
              { label: "Suite", value: "Suite" },
              { label: "Deluxe", value: "Deluxe" },
              { label: "Family", value: "Family" },
              { label: "Penthouse", value: "Penthouse" },
            ]}
            defaultValue="Double"
            onChange={(v) => setType(v)}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("AdultsCapacity", "Adults Capacity")} *</Label>
          <Input required name="adults" type="number" min="1" defaultValue="2" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("ChildrenCapacity", "Children Capacity")}</Label>
          <Input name="children" type="number" min="0" defaultValue="0" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Bedrooms", "Bedrooms")}</Label>
          <Input name="bedrooms" type="number" min="0" defaultValue="1" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Beds", "Beds")}</Label>
          <Input name="beds" type="number" min="0" defaultValue="1" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Bathrooms", "Bathrooms")}</Label>
          <Input name="bathrooms" type="number" min="0" defaultValue="1" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("BedType", "Bed Type")}</Label>
          <Input name="bedType" defaultValue="1 King Bed" placeholder="e.g. 1 King Bed" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("RoomSize", "Room Size (sqft)")}</Label>
          <Input name="roomSizeSqFt" type="number" min="0" placeholder="e.g. 350" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Meals", "Meals")}</Label>
          <Select
            options={[
              { label: gt("RoomOnly", "Room Only"), value: "Room Only" },
              { label: gt("Breakfast", "Breakfast Included"), value: "Breakfast" },
              { label: gt("HalfBoard", "Half Board"), value: "Half Board" },
              { label: gt("FullBoard", "Full Board"), value: "Full Board" },
              { label: gt("AllInclusive", "All Inclusive"), value: "All Inclusive" },
            ]}
            defaultValue="Room Only"
            onChange={(v) => setMeals(v)}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("PricePerNight", "Price Per Night")} *</Label>
          <Input required name="pricePerNight" type="number" min="0" step="0.01" placeholder="e.g. 4500" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Currency", "Currency")}</Label>
          <Select
            options={[
              { label: "AFN", value: "AFN" },
              { label: "USD", value: "USD" },
            ]}
            defaultValue="AFN"
            onChange={(v) => setCurrency(v)}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>{gt("TotalRooms", "Total Rooms of this Type")} *</Label>
          <Input required name="totalRooms" type="number" min="1" defaultValue="1" />
        </div>

        <div className="col-span-2">
          <Label>{gt("Description", "Description")}</Label>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
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
                placeholder="e.g. Balcony, Mini Bar, AC"
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
            + {gt("Add", "Add")}
          </button>
        </div>

        {/* Images */}
        <div className="col-span-2">
          <Label>{gt("RoomImages", "Room Images")} (max 5)</Label>
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