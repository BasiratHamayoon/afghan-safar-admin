"use client";
import React, { useActionState, useContext, useState } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { ContextAdmin } from "@/context/MainStateAdmin";

const RoomForm = ({ gt, hotelId, isEdit, room, onSuccess }) => {
  const { addRoomToHotel, editRoom } = useContext(ContextAdmin);

  const [type, setType] = useState(room?.type || "Double");
  const [currency, setCurrency] = useState(room?.currency || "AFN");
  const [amenitiesInput, setAmenitiesInput] = useState((room?.amenities || []).join(", "));
  const [images, setImages] = useState(room?.images || []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImages((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const [state, action, isPending] = useActionState(async (prev, formData) => {
    try {
      const amenitiesArr = amenitiesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.get("name"),
        type,
        description: formData.get("description") || "",
        capacity: {
          adults: parseInt(formData.get("adults")) || 1,
          children: parseInt(formData.get("children")) || 0,
        },
        bedType: formData.get("bedType") || "1 King Bed",
        roomSizeSqFt: formData.get("roomSizeSqFt") ? parseFloat(formData.get("roomSizeSqFt")) : null,
        pricePerNight: parseFloat(formData.get("pricePerNight")) || 0,
        currency,
        totalRooms: parseInt(formData.get("totalRooms")) || 1,
        amenities: amenitiesArr,
        images,
      };

      let res;
      if (isEdit) {
        res = await editRoom({ ...payload, roomId: room._id });
      } else {
        res = await addRoomToHotel(hotelId, payload);
      }

      if (res?.success) {
        setTimeout(() => onSuccess(), 800);
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
        {isEdit ? gt("EditRoom", "Edit Room") : gt("AddNewRoom", "Add New Room")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{gt("RoomName", "Room Name")} *</Label>
          <Input name="name" defaultValue={room?.name} placeholder="e.g. Deluxe King Room" required />
        </div>

        <div>
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
            defaultValue={room?.type || "Double"}
            onChange={(v) => setType(v)}
          />
        </div>

        <div>
          <Label>{gt("AdultsCapacity", "Adults Capacity")} *</Label>
          <Input name="adults" type="number" min="1" defaultValue={room?.capacity?.adults || 2} required />
        </div>

        <div>
          <Label>{gt("ChildrenCapacity", "Children Capacity")}</Label>
          <Input name="children" type="number" min="0" defaultValue={room?.capacity?.children || 0} />
        </div>

        <div>
          <Label>{gt("BedType", "Bed Type")}</Label>
          <Input name="bedType" defaultValue={room?.bedType || "1 King Bed"} placeholder="e.g. 1 King Bed" />
        </div>

        <div>
          <Label>{gt("RoomSize", "Room Size (sqft)")}</Label>
          <Input name="roomSizeSqFt" type="number" min="0" defaultValue={room?.roomSizeSqFt} />
        </div>

        <div>
          <Label>{gt("PricePerNight", "Price Per Night")} *</Label>
          <Input
            name="pricePerNight"
            type="number"
            min="0"
            step="0.01"
            defaultValue={room?.pricePerNight}
            required
          />
        </div>

        <div>
          <Label>{gt("Currency", "Currency")}</Label>
          <Select
            options={[
              { label: "AFN", value: "AFN" },
              { label: "USD", value: "USD" },
            ]}
            defaultValue={room?.currency || "AFN"}
            onChange={(v) => setCurrency(v)}
          />
        </div>

        <div className="md:col-span-2">
          <Label>{gt("TotalRooms", "Total Rooms of this Type")} *</Label>
          <Input name="totalRooms" type="number" min="1" defaultValue={room?.totalRooms || 1} required />
        </div>

        <div className="md:col-span-2">
          <Label>{gt("Amenities", "Amenities (comma separated)")}</Label>
          <Input
            value={amenitiesInput}
            onChange={(e) => setAmenitiesInput(e.target.value)}
            placeholder="Balcony, Mini Bar, City View, AC, TV"
          />
        </div>

        <div className="md:col-span-2">
          <Label>{gt("Description", "Description")}</Label>
          <textarea
            name="description"
            defaultValue={room?.description}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        <div className="md:col-span-2">
          <Label>{gt("RoomImages", "Room Images (max 5)")}</Label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-500 file:text-white file:cursor-pointer hover:file:bg-brand-600"
          />
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {state && (
        <Alert
          message={state.msg}
          title={state.success ? gt("Success", "Success") : gt("Error", "Error")}
          variant={state.success ? "success" : "error"}
        />
      )}

      <div className="flex items-center gap-3 justify-end mt-4">
        <Button size="sm" disabled={isPending} type="submit">
          {isPending ? "..." : isEdit ? gt("Save", "Save") : gt("AddRoom", "Add Room")}
        </Button>
      </div>
    </form>
  );
};

export default RoomForm;