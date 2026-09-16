"use client";
import NotFound from "@/components/ui/NotFound";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { useParams, useRouter } from "next/navigation";
import React, { useActionState, useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/alert/Alert";
import { TrashBinIcon } from "@/icons";
import ModelActions from "@/components/ui/modal/ModelActions";

const page = () => {
  const t = useTranslations("hotelsPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb || key);
  const router = useRouter();
  const { roomId } = useParams();
  const { isOpen: isDel, openModal: openDel, closeModal: closeDel } = useModal();
  const { loading, editRoom, deleteRoom, fetchRoomById, companyUser } = useContext(ContextAdmin);

  const [room, setRoom] = useState(null);
  const [hotelIdOfRoom, setHotelIdOfRoom] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [type, setType] = useState("Double");
  const [currency, setCurrency] = useState("AFN");
  const [meals, setMeals] = useState("Room Only");
  const [amenities, setAmenities] = useState([""]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (companyUser === null) return;
    
    // Safety check: ensure fetchRoomById exists
    if (typeof fetchRoomById === "function") {
      (async () => {
        const res = await fetchRoomById(roomId);
        if (res?.success && res?.data) {
          const foundRoom = res.data;
          setRoom(foundRoom);
          setHotelIdOfRoom(res.hotelId);
          setType(foundRoom.type || "Double");
          setCurrency(foundRoom.currency || "AFN");
          setMeals(foundRoom.meals || "Room Only");
          setAmenities(foundRoom.amenities?.length ? foundRoom.amenities : [""]);
          setImages(foundRoom.images || []);
        }
        setPageLoading(false);
      })();
    } else {
      setPageLoading(false);
    }
  }, [companyUser, roomId, fetchRoomById]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const [state, action, isPending] = useActionState(async (prev, formData) => {
    try {
      const data = {
        roomId,
        name: formData.get("name"),
        type,
        description: formData.get("description") || "",
        capacity: {
          adults: parseInt(formData.get("adults")) || 1,
          children: parseInt(formData.get("children")) || 0,
        },
        bedrooms: parseInt(formData.get("bedrooms")) || 1,
        beds: parseInt(formData.get("beds")) || 1,
        bathrooms: parseInt(formData.get("bathrooms")) || 1,
        bedType: formData.get("bedType"),
        meals,
        roomSizeSqFt: formData.get("roomSizeSqFt") ? parseFloat(formData.get("roomSizeSqFt")) : null,
        pricePerNight: parseFloat(formData.get("pricePerNight")) || 0,
        currency,
        totalRooms: parseInt(formData.get("totalRooms")) || 1,
        amenities: amenities.filter((a) => a && a.trim() !== ""),
        images,
      };

      const res = await editRoom(data);
      if (res?.success) {
        setRoom(res.data);
        return { success: true, msg: res.message };
      }
      return { success: false, msg: res?.message || "Failed" };
    } catch {
      return { success: false, msg: "Error" };
    }
  }, null);

  const deleteFunc = async () => {
    const data = await deleteRoom(roomId);
    if (data?.success) {
      closeDel();
      if (hotelIdOfRoom) router.push(`/hotels/${hotelIdOfRoom}`);
      else router.push("/hotels");
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <NotFound
        heading={gt("RoomNotFound", "Room Not Found")}
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
            {gt("EditRoom", "Edit Room")}
          </h3>
          <p className="bk-16 !text-gray-800 dark:!text-gray-300">
            {gt("EditRoomSubtitle", "Update room details and pricing")}
          </p>
        </div>
        <div className="flex gap-2">
          {hotelIdOfRoom && (
            <Button size="md" variant="outline" onClick={() => router.push(`/hotels/${hotelIdOfRoom}`)}>
              ← {gt("BackToHotel", "Back to Hotel")}
            </Button>
          )}
          <Button
            startIcon={<TrashBinIcon />}
            className="bg-error-600 h-[35px] hover:bg-error-700"
            onClick={openDel}
          >
            {gt("Delete", "Delete")}
          </Button>
        </div>
      </div>

      <form action={action} className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("RoomName", "Room Name")} *</Label>
          <Input name="name" defaultValue={room.name} required />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("RoomType", "Room Type")}</Label>
          <Select
            options={["Single", "Double", "Twin", "Suite", "Deluxe", "Family", "Penthouse"].map((v) => ({
              label: v,
              value: v,
            }))}
            defaultValue={room.type}
            onChange={(v) => setType(v)}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("AdultsCapacity", "Adults")} *</Label>
          <Input name="adults" type="number" min="1" defaultValue={room.capacity?.adults} required />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("ChildrenCapacity", "Children")}</Label>
          <Input name="children" type="number" min="0" defaultValue={room.capacity?.children || 0} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Bedrooms", "Bedrooms")}</Label>
          <Input name="bedrooms" type="number" min="0" defaultValue={room.bedrooms || 1} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Beds", "Beds")}</Label>
          <Input name="beds" type="number" min="0" defaultValue={room.beds || 1} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Bathrooms", "Bathrooms")}</Label>
          <Input name="bathrooms" type="number" min="0" defaultValue={room.bathrooms || 1} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("BedType", "Bed Type")}</Label>
          <Input name="bedType" defaultValue={room.bedType} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("RoomSize", "Room Size (sqft)")}</Label>
          <Input name="roomSizeSqFt" type="number" defaultValue={room.roomSizeSqFt} />
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
            defaultValue={room.meals || "Room Only"}
            onChange={(v) => setMeals(v)}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("PricePerNight", "Price Per Night")} *</Label>
          <Input
            name="pricePerNight"
            type="number"
            min="0"
            step="0.01"
            defaultValue={room.pricePerNight}
            required
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("Currency", "Currency")}</Label>
          <Select
            options={[
              { label: "AFN", value: "AFN" },
              { label: "USD", value: "USD" },
            ]}
            defaultValue={room.currency}
            onChange={(v) => setCurrency(v)}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label>{gt("TotalRooms", "Total Rooms")} *</Label>
          <Input name="totalRooms" type="number" min="1" defaultValue={room.totalRooms} required />
        </div>
        <div className="col-span-2">
          <Label>{gt("Description", "Description")}</Label>
          <textarea
            name="description"
            rows={3}
            defaultValue={room.description}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        <div className="col-span-2">
          <Label>{gt("Amenities", "Amenities")}</Label>
          {amenities.map((a, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input
                value={a}
                onChange={(e) =>
                  setAmenities((p) => {
                    const t = [...p];
                    t[i] = e.target.value;
                    return t;
                  })
                }
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

        <div className="col-span-2">
          <Label>{gt("RoomImages", "Room Images")}</Label>
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

      <ModelActions
        isOpen={isDel}
        onClose={closeDel}
        className="max-w-md m-4"
        selectedIds={[roomId]}
        type={gt("Delete", "Delete")}
        name={gt("Room", "Room")}
        loading={loading}
        clickFunc={deleteFunc}
        des={gt("DeleteWarning", "This cannot be undone.")}
      />
    </div>
  );
};

export default page;