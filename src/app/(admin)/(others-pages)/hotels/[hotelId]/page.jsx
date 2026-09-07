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
  const t = useTranslations("hotelsPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isDel, openModal: openDel, closeModal: closeDel } = useModal();
  const router = useRouter();
  const { hotelId } = useParams();
  const { loading, hotelsCardsData, fetchHotelById, editHotel, deleteHotels, companyUser } = useContext(ContextAdmin);
  const [hotel, setHotel] = useState(false);

  useEffect(() => {
    if (companyUser !== null) {
      const existing = hotelsCardsData?.data?.find((i) => i._id === hotelId);
      if (existing) { setHotel(existing); }
      else { fetchHotelById(hotelId).then((res) => { if (res?.data) setHotel(res.data); }); }
    }
  }, [companyUser]);

  const deleteFunc = async () => {
    const data = await deleteHotels(hotelId);
    if (data?.success) { closeDel(); router.push("/hotels"); }
  };

  if (!hotel) return <NotFound heading={gt("HotelNotFound", "Hotel Not Found")} desc="" loading={loading} loadingText={gt("Loading", "Loading...")} loadingDesc="" />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-row items-center justify-between w-full mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">{gt("HotelDetails", "Hotel Details")}</h3>
          <p className="bk-16 !text-gray-800 dark:!text-gray-300">{gt("HotelDetailsSubtitle", "View and manage hotel information")}</p>
        </div>
        <div className="flex gap-2">
          <Button size="md" onClick={openModal}>{gt("Edit", "Edit")}</Button>
          <Button startIcon={<TrashBinIcon />} className="bg-error-600 h-[35px] hover:bg-error-700" onClick={openDel}>{gt("Delete", "Delete")}</Button>
        </div>
      </div>

      {hotel.images?.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-5">
          {hotel.images.map((img, i) => <img key={i} src={img} alt="" className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />)}
        </div>
      )}

      <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
        <InfoRow label={gt("Name", "Name")} value={hotel.name} />
        <InfoRow label={gt("Province", "Province")} value={hotel.province} />
        <InfoRow label={gt("Location", "Location")} value={hotel.location} />
        <InfoRow label={gt("PropertyType", "Type")} value={hotel.propertyType} />
        <InfoRow label={gt("StarRating", "Stars")} value={"⭐".repeat(hotel.starRating || 0)} />
        <InfoRow label={gt("ApprovalStatus", "Approval")} comp value={<span className={`px-3 py-1 text-xs rounded-full ${hotel.approvalStatus === "approved" ? "bg-green-100 text-green-600" : hotel.approvalStatus === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}>{hotel.approvalStatus}</span>} />
        <InfoRow label={gt("Status", "Status")} value={hotel.isActive ? gt("Active", "Active") : gt("Inactive", "Inactive")} />
        <InfoRow label={gt("Phone", "Phone")} value={hotel.contactInfo?.phone} />
        <InfoRow label={gt("Email", "Email")} value={hotel.contactInfo?.email} />
        <InfoRow label={gt("CheckInTime", "Check-in")} value={hotel.policies?.checkInTime} />
        <InfoRow label={gt("CheckOutTime", "Check-out")} value={hotel.policies?.checkOutTime} />
        <div className="col-span-2 border-t border-t-[#D5D6DD] py-5">
          <p className="mb-2 med-14">{gt("Description", "Description")}</p>
          <p className="bk-14 !text-gray-700 dark:!text-gray-300 whitespace-pre-wrap">{hotel.description}</p>
        </div>
        {hotel.amenities?.length > 0 && (
          <div className="col-span-2 border-t border-t-[#D5D6DD] py-5">
            <p className="mb-2 med-14">{gt("Amenities", "Amenities")}</p>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((a, i) => <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">{a}</span>)}
            </div>
          </div>
        )}
        <InfoRow label={gt("CreatedAt", "Created At")} value={new Date(hotel.createdAt).toDateString()} />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] max-h-[85vh] overflow-y-scroll">
        <EditForm gt={gt} hotel={hotel} editHotel={editHotel} />
      </Modal>

      <ModelActions isOpen={isDel} onClose={closeDel} className="max-w-md m-4" selectedIds={[hotelId]} type={gt("Delete", "Delete")} name={gt("Hotel", "Hotel")} loading={loading} clickFunc={deleteFunc} des={gt("DeleteWarning", "This cannot be undone.")} />
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

const EditForm = ({ gt, hotel, editHotel }) => {
  const [propertyType, setPropertyType] = useState(hotel?.propertyType || "Hotel");

  const [state, action, isPending] = useActionState(async (prev, formData) => {
    try {
      const data = {
        hotelId: hotel._id,
        name: formData.get("name"),
        propertyType,
        starRating: parseInt(formData.get("starRating")) || hotel.starRating,
        location: formData.get("location"),
        province: formData.get("province"),
        address: formData.get("address"),
        description: formData.get("description"),
        shortDescription: formData.get("shortDescription") || undefined,
      };
      const res = await editHotel(data);
      if (res?.success) { window.location.reload(); return { success: true, msg: res.message }; }
      return { success: false, msg: res?.message || "Failed" };
    } catch { return { success: false, msg: "Error" }; }
  }, null);

  return (
    <form action={action} className="grid grid-cols-1 md:grid-cols-2 pt-[50px] pb-[20px] px-[24px] gap-[20px]">
      <div className="col-span-2 md:col-span-1"><Label>{gt("Name", "Name")} *</Label><Input name="name" defaultValue={hotel?.name} required /></div>
      <div className="col-span-2 md:col-span-1"><Label>{gt("Province", "Province")} *</Label><Input name="province" defaultValue={hotel?.province} required /></div>
      <div className="col-span-2 md:col-span-1"><Label>{gt("Location", "Location")} *</Label><Input name="location" defaultValue={hotel?.location} required /></div>
      <div className="col-span-2 md:col-span-1"><Label>{gt("Address", "Address")}</Label><Input name="address" defaultValue={hotel?.address} /></div>
      <div className="col-span-2 md:col-span-1">
        <Label>{gt("PropertyType", "Type")}</Label>
        <Select options={[{ label: "Hotel", value: "Hotel" }, { label: "Resort", value: "Resort" }, { label: "Villa", value: "Villa" }, { label: "Guest House", value: "GuestHouse" }, { label: "Apartment", value: "Apartment" }, { label: "Hostel", value: "Hostel" }]} defaultValue={hotel?.propertyType} onChange={(v) => setPropertyType(v)} />
      </div>
      <div className="col-span-2 md:col-span-1"><Label>{gt("StarRating", "Stars")}</Label><Input name="starRating" type="number" min="1" max="5" defaultValue={hotel?.starRating} /></div>
      <div className="col-span-2"><Label>{gt("Description", "Description")} *</Label><textarea name="description" defaultValue={hotel?.description} required rows={4} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" /></div>
      {state && <div className="col-span-2"><Alert message={state.msg} title={state.success ? gt("Success", "Success") : gt("Error", "Error")} variant={state.success ? "success" : "error"} /></div>}
      <div className="flex items-center col-span-2 gap-3 px-2 lg:justify-end"><Button size="sm" disabled={isPending} type="submit">{gt("Save", "Save")}</Button></div>
    </form>
  );
};