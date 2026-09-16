"use client";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { ContextAdmin } from "@/context/MainStateAdmin";
import ModelActions from "@/components/ui/modal/ModelActions";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import NoData from "@/components/ui/NoData";

const RoomsSection = ({ hotelId, rooms, onRoomsUpdate, gt }) => {
  const router = useRouter();
  const { deleteRoom, loading } = useContext(ContextAdmin);
  const { isOpen: isDelOpen, openModal: openDel, closeModal: closeDel } = useModal();

  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleDelete = (room) => {
    setSelectedRoom(room);
    openDel();
  };

  const confirmDelete = async () => {
    if (!selectedRoom) return;
    const res = await deleteRoom(selectedRoom._id);
    if (res?.success) {
      closeDel();
      onRoomsUpdate();
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-row items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 lg:text-xl dark:text-white/90">
            {gt("Rooms", "Rooms")} ({rooms.length})
          </h3>
          <p className="bk-14 !text-gray-600 dark:!text-gray-400">
            {gt("RoomsSubtitle", "Manage room types available in this hotel")}
          </p>
        </div>
        <Button size="md" onClick={() => router.push(`/add-room?hotelId=${hotelId}`)}>
          + {gt("AddRoom", "Add Room")}
        </Button>
      </div>

      {rooms.length === 0 ? (
        <NoData loading={false} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-[900px] md:w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] dark:border-gray-600 text-start">
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Image", "Image")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("RoomName", "Room Name")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("RoomType", "Type")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Capacity", "Capacity")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("BedInfo", "Bed Info")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Price", "Price / Night")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Available", "Available")}
                </th>
                <th className="med-16 text-start pl-[6px] py-[15px] !text-gray-700 dark:!text-gray-300">
                  {gt("Actions", "Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <RoomRow
                  key={room._id}
                  room={room}
                  onDelete={() => handleDelete(room)}
                  gt={gt}
                  router={router}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModelActions
        isOpen={isDelOpen}
        onClose={closeDel}
        className="max-w-md m-4"
        selectedIds={selectedRoom ? [selectedRoom._id] : []}
        type={gt("Delete", "Delete")}
        name={gt("Room", "Room")}
        loading={loading}
        clickFunc={confirmDelete}
        des={gt("DeleteRoomWarning", "This will permanently delete the room. Continue?")}
      />
    </div>
  );
};

export default RoomsSection;

// ─── Room Row Component ───
const RoomRow = ({ room, onDelete, gt, router }) => {
  const [showOptions, setShowOptions] = useState(false);

  const viewDetails = () => router.push(`/rooms/${room._id}`);

  return (
    <tr
      onClick={viewDetails}
      className="border-b border-[#e5e7eb] cursor-pointer dark:border-gray-600 hover:bg-[#f3f4f6] dark:hover:bg-gray-800"
    >
      <td className="py-3 pl-[6px]">
        {room.images?.[0] ? (
          <img src={room.images[0]} alt={room.name} className="w-14 h-14 rounded-lg object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">
            N/A
          </div>
        )}
      </td>

      <td className="p-3">
        <div className="flex flex-col">
          <span className="med-14 !text-gray-800 dark:!text-gray-200">{room.name}</span>
          {room.roomSizeSqFt && (
            <span className="bk-12 text-gray-500">{room.roomSizeSqFt} sqft</span>
          )}
        </div>
      </td>

      <td className="p-3">
        <span className="px-2 py-1 text-xs rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
          {room.type}
        </span>
      </td>

      <td className="p-3">
        <div className="flex flex-col text-xs !text-gray-700 dark:!text-gray-300">
          <span>{room.capacity?.adults || 0} {gt("Adults", "Adults")}</span>
          <span>{room.capacity?.children || 0} {gt("Children", "Children")}</span>
        </div>
      </td>

      <td className="p-3">
        <div className="flex flex-col text-xs !text-gray-700 dark:!text-gray-300">
          <span>{room.bedType || "-"}</span>
          <span className="text-gray-500">
            {room.bedrooms || 0} BR • {room.beds || 0} Beds • {room.bathrooms || 0} Bath
          </span>
        </div>
      </td>

      <td className="p-3">
        <div className="flex flex-col">
          <span className="med-14 !text-brand-600 dark:!text-brand-400">
            {room.pricePerNight} {room.currency}
          </span>
          {room.meals && (
            <span className="bk-12 text-gray-500">{room.meals}</span>
          )}
        </div>
      </td>

      <td className="p-3 bk-14 !text-gray-700 dark:!text-gray-300">
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
          {room.totalRooms} {gt("Total", "Total")}
        </span>
      </td>

      <td onClick={(e) => e.stopPropagation()} className="p-3 cursor-pointer">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="w-[28px] h-[28px] flex-center hover:bg-gray-200 rounded-[6px]"
        >
          <svg
            className="dark:fill-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="black"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="black"
          >
            <path stroke="inherit" strokeLinecap="round" strokeWidth="4" d="M6 12h0m6 0h0m6 0h0" />
          </svg>
        </button>
        <Dropdown isOpen={showOptions} onClose={() => setShowOptions(false)} className="w-40 p-2">
          <DropdownItem
            onItemClick={viewDetails}
            className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
          >
            {gt("ViewEdit", "View / Edit")}
          </DropdownItem>
          <DropdownItem
            onItemClick={onDelete}
            className="flex w-full font-normal text-left text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
          >
            {gt("Delete", "Delete")}
          </DropdownItem>
        </Dropdown>
      </td>
    </tr>
  );
};