"use client";
import React, { useContext, useEffect, useState } from "react";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import NotFound from "@/components/ui/NotFound";
import { TrashBinIcon } from "@/icons";
import ModelActions from "@/components/ui/modal/ModelActions";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";

const page = () => {
  const t = useTranslations("hotelBookingsPage");
  const gt = (key, fb) => (t.has(key) ? t(key) : fb || key);

  const { bookingId } = useParams();
  const router = useRouter();

  const {
    loading, hotelBookingsData, updateBookingState,
    deleteHotelBooking, companyUser,
  } = useContext(ContextAdmin);

  const { isOpen: isDel, openModal: openDel, closeModal: closeDel } = useModal();
  const { isOpen: isActionModal, openModal: openActionModal, closeModal: closeActionModal } = useModal();

  const [booking, setBooking] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [targetState, setTargetState] = useState("");
  const [actionNote, setActionNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (companyUser !== null) {
      const existing = hotelBookingsData?.data?.find((i) => i._id === bookingId);
      if (existing) setBooking(existing);
      setPageLoading(false);
    }
  }, [companyUser, bookingId]);

  const deleteFunc = async () => {
    const data = await deleteHotelBooking(bookingId);
    if (data?.success) { closeDel(); router.push("/hotel-bookings"); }
  };

  const handleStateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    const res = await updateBookingState(bookingId, targetState, actionNote);
    setActionLoading(false);
    if (res?.success) {
      setBooking((prev) => ({ ...prev, state: targetState, actionNote, actionAt: new Date() }));
      closeActionModal();
    } else {
      setErrorMsg(res?.message || "Failed to update booking status.");
    }
  };

  const promptStateChange = (stateName) => {
    setTargetState(stateName);
    setActionNote("");
    setErrorMsg("");
    openActionModal();
  };

  if (pageLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!booking) return <NotFound heading={gt("BookingNotFound", "Booking Not Found")} desc="" loading={false} loadingText="" loadingDesc="" />;

  const stateColors = {
    pending: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
    accepted: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    completed: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
    rejected: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  };

  const room = booking.roomId || {};

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-row items-center justify-between w-full mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
            {gt("BookingDetails", "Booking Details")}
          </h3>
          <p className="bk-16 !text-gray-800 dark:!text-gray-300">
            {gt("BookingDetailsSubtitle", "View and manage hotel reservation")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {booking.state === "pending" && (
            <>
              <Button size="md" className="bg-green-600 hover:bg-green-700" onClick={() => promptStateChange("accepted")}>
                ✓ {gt("Accept", "Accept")}
              </Button>
              <Button size="md" className="bg-red-600 hover:bg-red-700" onClick={() => promptStateChange("rejected")}>
                ✕ {gt("Reject", "Reject")}
              </Button>
            </>
          )}
          {booking.state === "accepted" && (
            <>
              <Button size="md" className="bg-blue-600 hover:bg-blue-700" onClick={() => promptStateChange("completed")}>
                ✓ {gt("MarkCompleted", "Complete Stay")}
              </Button>
              <Button size="md" className="bg-red-600 hover:bg-red-700" onClick={() => promptStateChange("cancelled")}>
                ✕ {gt("Cancel", "Cancel Booking")}
              </Button>
            </>
          )}
          <Button startIcon={<TrashBinIcon />} className="bg-error-600 h-[35px] hover:bg-error-700" onClick={openDel}>
            {gt("Delete", "Delete")}
          </Button>
        </div>
      </div>

      {/* Guest & Booking Details */}
      <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
        <SectionTitle title={gt("GuestInformation", "Guest Information")} />
        <InfoRow label={gt("PassengerName", "Passenger Name")} value={booking.passengerName} />
        <InfoRow label={gt("PassengerPhone", "Phone Number")} value={booking.passengerPhone} />
        <InfoRow label={gt("Guests", "Guests")} value={`${booking.passengerCount} ${gt("Adults", "Adults")}, ${booking.childrenCount || 0} ${gt("Children", "Children")}`} />

        <SectionTitle title={gt("HotelInformation", "Hotel Information")} />
        <InfoRow label={gt("Hotel", "Hotel")} value={booking.hotelId?.name} />
        <InfoRow label={gt("Location", "Location")} value={booking.hotelId?.location} />
        <InfoRow label={gt("Province", "Province")} value={booking.hotelId?.province} />

        {/* ─── ROOM FEATURES SECTION ─── */}
        <SectionTitle title={gt("RoomDetails", "Room Details")} />
        <InfoRow label={gt("RoomName", "Room Name")} value={room.name} />
        <InfoRow label={gt("RoomType", "Room Type")} value={room.type} />
        <InfoRow label={gt("BedType", "Bed Type")} value={room.bedType} />
        {room.bedrooms !== undefined && <InfoRow label={gt("Bedrooms", "Bedrooms")} value={room.bedrooms} />}
        {room.beds !== undefined && <InfoRow label={gt("Beds", "Beds")} value={room.beds} />}
        {room.bathrooms !== undefined && <InfoRow label={gt("Bathrooms", "Bathrooms")} value={room.bathrooms} />}
        {room.roomSizeSqFt && <InfoRow label={gt("RoomSize", "Room Size")} value={`${room.roomSizeSqFt} sqft`} />}
        {room.meals && <InfoRow label={gt("Meals", "Meals")} value={room.meals} />}
        <InfoRow label={gt("Capacity", "Capacity")} value={`${room.capacity?.adults || 0} ${gt("Adults", "Adults")}, ${room.capacity?.children || 0} ${gt("Children", "Children")}`} />

        {room.amenities?.length > 0 && (
          <div className="col-span-2 py-4 border-t flex flex-col gap-2 border-t-[#D5D6DD] dark:border-t-gray-700">
            <p className="med-14 whitespace-nowrap">{gt("RoomAmenities", "Room Amenities")}</p>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((a, i) => (
                <span key={i} className="px-3 py-1 bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 rounded-full text-xs">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {room.images?.length > 0 && (
          <div className="col-span-2 py-4 border-t flex flex-col gap-2 border-t-[#D5D6DD] dark:border-t-gray-700">
            <p className="med-14">{gt("RoomImages", "Room Images")}</p>
            <div className="flex flex-wrap gap-2">
              {room.images.map((img, i) => (
                <img key={i} src={img} alt="" className="w-24 h-24 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        )}

        <SectionTitle title={gt("BookingDates", "Booking Dates")} />
        <InfoRow label={gt("Status", "Booking Status")} comp value={
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${stateColors[booking.state] || ""}`}>
            {booking.state}
          </span>
        } />
        <InfoRow label={gt("CheckInDate", "Check-in Date")} value={new Date(booking.checkInDate).toDateString()} />
        <InfoRow label={gt("CheckOutDate", "Check-out Date")} value={new Date(booking.checkOutDate).toDateString()} />
        <InfoRow label={gt("CheckInTime", "Check-in Time")} value={booking.checkInTime} />
        <InfoRow label={gt("CheckOutTime", "Check-out Time")} value={booking.checkOutTime} />
        <InfoRow label={gt("Nights", "Total Nights")} value={`${booking.totalNights} ${gt("NightsCount", "Night(s)")}`} />
        <InfoRow label={gt("RoomsBooked", "Rooms Booked")} value={`${booking.roomsBooked} ${gt("RoomsCount", "Room(s)")}`} />

        <SectionTitle title={gt("PricingBreakdown", "Pricing Breakdown")} />
        <InfoRow label={gt("PricePerNight", "Price Per Night")} value={`${booking.pricePerNightSnapshot} ${booking.currency}`} />
        <InfoRow label={gt("TotalPrice", "Total Price")} value={`${booking.totalPrice} ${booking.currency}`} />

        {(booking.actionNote || booking.actionAt) && (
          <>
            <SectionTitle title={gt("AdministrativeInfo", "Administrative Info")} />
            {booking.actionNote && <InfoRow label={gt("ActionNote", "Action Note")} value={booking.actionNote} />}
            {booking.actionAt && <InfoRow label={gt("ActionAt", "Action Date")} value={new Date(booking.actionAt).toLocaleString()} />}
          </>
        )}

        <InfoRow label={gt("CreatedAt", "Booking Created")} value={new Date(booking.createdAt).toLocaleString()} />
      </div>

      <Modal isOpen={isActionModal} onClose={closeActionModal} className="max-w-md p-6">
        <form onSubmit={handleStateSubmit} className="flex flex-col gap-4">
          <h3 className="med-18 font-bold text-gray-800 dark:text-white">
            {gt("ConfirmStatusUpdate", "Update Status to")}: <span className="uppercase text-brand-500">{targetState}</span>
          </h3>
          <div>
            <Label>{gt("ReasonOrNote", "Action Note / Reason (Optional)")}</Label>
            <textarea value={actionNote} onChange={(e) => setActionNote(e.target.value)} rows={3}
              placeholder="e.g. Approved by manager / Rooms full"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
          </div>
          {errorMsg && <Alert variant="error" title={gt("Error", "Error")} message={errorMsg} />}
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" type="button" onClick={closeActionModal}>{gt("Cancel", "Cancel")}</Button>
            <Button size="sm" type="submit" disabled={actionLoading}>
              {actionLoading ? "..." : gt("Save", "Confirm")}
            </Button>
          </div>
        </form>
      </Modal>

      <ModelActions isOpen={isDel} onClose={closeDel} className="max-w-md m-4"
        selectedIds={[bookingId]} type={gt("Delete", "Delete")} name={gt("Booking", "Booking")}
        loading={loading} clickFunc={deleteFunc} des={gt("DeleteWarning", "This action cannot be undone.")} />
    </div>
  );
};

export default page;

const InfoRow = ({ label, value, comp }) => (
  <div className="col-span-2 md:gap-[35px] py-4 border-t flex flex-row border-t-[#D5D6DD] dark:border-t-gray-700">
    <p className="med-14 whitespace-nowrap w-[22ch]">{label}</p>
    {comp ? value : <p className="bk-14 !text-gray-700 dark:!text-gray-300">{value || "N/A"}</p>}
  </div>
);

const SectionTitle = ({ title }) => (
  <div className="col-span-2 pt-5 pb-2">
    <h4 className="text-md font-bold text-brand-500 uppercase tracking-wider">{title}</h4>
  </div>
);