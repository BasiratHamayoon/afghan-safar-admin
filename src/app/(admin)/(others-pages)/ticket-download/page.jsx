"use client";
import React, {
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "@/components/ui/button/Button";
import {
  Bus,
  CnicCard,
  Location,
  Plate,
  Seat,
  Terminal,
  TimeIcon,
  UserIcon,
} from "@/icons";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQRCode } from "next-qrcode";
import { ContextAdmin } from "@/context/MainStateAdmin";
import toAfghaniTime from "@/util/toAfghaniTime";

export const dynamic = "force-dynamic";

function TicketDownloadContent() {
  const params = useSearchParams();
  const ticketId = params.get("id");
  const { getTicketDetails, ticket, setTicket } = useContext(ContextAdmin);
  const ticketDownload = useTranslations("ticketDownload");
  const { Canvas } = useQRCode();
  const ticketRef = useRef();
  const [pdfLoading, setpdfLoading] = useState(false);

  const fetchTicket = async () => {
    if (!ticket && ticketId) {
      const parsedData = await getTicketDetails(ticketId);
      if (parsedData?.ticket) {
        setTicket(parsedData.ticket);
      }
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const PrintFunc = () => {
    window.print();
  };

  const downloadPDF = async () => {
    if (pdfLoading || !ticketRef.current) return;
    setpdfLoading(true);

    try {
      // Dynamically import heavy PDF packages on demand (prevents build memory crash!)
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = ticketRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        pageHeight / 2 - imgWidth / 2,
        imgWidth,
        imgHeight
      );

      pdf.save("Ticket-" + (ticketId || "download"));
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setpdfLoading(false);
    }
  };

  const extractSeats = useMemo(() => {
    if (ticket?.selectedSeats) {
      let seats = "";
      Object.keys(ticket.selectedSeats).forEach((gender) => {
        ticket.selectedSeats[gender].forEach((seat) => {
          seats += seat + ",";
        });
      });
      return seats.slice(0, -1);
    }
    return "";
  }, [ticket]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-row items-center justify-between gap-4 mb-4 md:flex-row">
        <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl dark:text-white/90">
          {ticketDownload("View Ticket")}
        </h3>
        <div className="flex flex-row gap-2">
          <Button
            size={"sm"}
            onClick={downloadPDF}
            disabled={pdfLoading}
          >
            {pdfLoading ? "Generating..." : ticketDownload("Download")}
          </Button>
          <Button size={"sm"} onClick={PrintFunc}>
            {ticketDownload("Print")}
          </Button>
        </div>
      </div>

      <div className="w-full mx-auto bg-white flex-center">
        <div
          className={`flex flex-col border border-gray-400 lg:max-w-[450px] w-full lg:min-w-[400px] rounded-2xl overflow-hidden flex-center ${
            !ticket && "opacity-60"
          }`}
        >
          <div className="flex flex-row items-center gap-2 bg-[#1d50d0] py-[10px] w-full justify-center">
            <h1 className="text-[24px] font-light text-white">
              {ticketDownload("Afghan Safar")}
            </h1>
            <span className="bg-white w-[60px] h-[60px] rounded-full flex-center p-2">
              <Image
                src={"/images/icons/logo.png"}
                width={200}
                height={200}
                alt="brand-logo"
              />
            </span>
          </div>

          <div className="grid grid-cols-2 pl-[24px] pt-[24px] gap-y-[15px]">
            <ItemTick
              title={ticketDownload("Origin")}
              value={ticket?.transportation?.from}
              Svg={Location}
            />
            <ItemTick
              title={ticketDownload("Destination")}
              value={ticket?.transportation?.to}
              Svg={Location}
            />
            <ItemTick
              title={ticketDownload("Passenger")}
              value={ticket?.supervisorInfo?.name}
              Svg={UserIcon}
            />
            <ItemTick
              title={ticketDownload("Seat No")}
              value={extractSeats}
              Svg={Seat}
            />
            <ItemTick
              title={ticketDownload("Tazkira Number")}
              value={ticket?.supervisorInfo?.cnic}
              Svg={CnicCard}
            />
            <ItemTick
              title={ticketDownload("Payment Type")}
              value={"Pay in Terminal"}
              Svg={Terminal}
            />
            <ItemTick
              title={ticketDownload("Vehicle Plate No")}
              value={ticket?.transportation?.vehicleDetails?.plateNo}
              Svg={Plate}
            />
            <ItemTick
              title={ticketDownload("Vehicle Model")}
              value={ticket?.transportation?.vehicleDetails?.model}
              Svg={Bus}
            />
            <ItemTick
              title={ticketDownload("Departure Time")}
              value={
                ticket?.transportation?.departureTime &&
                toAfghaniTime(ticket?.transportation?.departureTime)
              }
              Svg={TimeIcon}
            />
            <ItemTick
              title={ticketDownload("Arrival Time")}
              value={
                ticket?.transportation?.arrivalTime &&
                toAfghaniTime(ticket?.transportation?.arrivalTime)
              }
              Svg={TimeIcon}
            />
          </div>

          <span className="w-[85%] border border-dashed border-gray-400 my-[20px] mx-auto"></span>
          <div className="flex-col w-full flex-center z-[30] pb-[10px]">
            <span className="text-[15px]">{ticketDownload("TicketId")}</span>
            <span className="text-[15px]">{ticketId || "N/A"}</span>
          </div>

          {ticketId && (
            <Canvas
              key={ticketId}
              text={ticketId}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 200,
              }}
            />
          )}

          <div className="flex flex-col flex-center mb-[20px]">
            <span className="block text-center max-w-[90%]">
              {ticketDownload("ContactNote")}
            </span>
            <a href="tel:+93744442290" className="underline">
              +93744442290
            </a>
          </div>
        </div>
      </div>

      {/* Hidden printable ref */}
      <div
        ref={ticketRef}
        className="mx-auto bg-white min-w-[705px] absolute top-[-900vh] left-[-900vw] z-[-5]"
        id="ticket"
      >
        <div
          className={`flex flex-col mx-auto border border-gray-400 max-w-[450px] w-full min-w-[400px] rounded-2xl overflow-hidden flex-center`}
        >
          <div className="flex flex-row items-center gap-2 bg-[#1d50d0] py-[10px] w-full justify-center">
            <h1 className="text-[24px] font-light text-white">
              {ticketDownload("Afghan Safar")}
            </h1>
            <span className="bg-white w-[60px] h-[60px] rounded-full flex-center p-2">
              <Image
                src={"/images/icons/logo.png"}
                width={200}
                height={200}
                alt="brand-logo"
              />
            </span>
          </div>

          <div className="grid grid-cols-2 pl-[24px] pt-[24px] gap-y-[15px]">
            <ItemTick
              title={ticketDownload("Origin")}
              value={ticket?.transportation?.from}
              Svg={Location}
            />
            <ItemTick
              title={ticketDownload("Destination")}
              value={ticket?.transportation?.to}
              Svg={Location}
            />
            <ItemTick
              title={ticketDownload("Passenger")}
              value={ticket?.supervisorInfo?.name}
              Svg={UserIcon}
            />
            <ItemTick
              title={ticketDownload("Seat No")}
              value={extractSeats}
              Svg={Seat}
            />
            <ItemTick
              title={ticketDownload("Tazkira Number")}
              value={ticket?.supervisorInfo?.cnic}
              Svg={CnicCard}
            />
            <ItemTick
              title={ticketDownload("Payment Type")}
              value={"Pay in Terminal"}
              Svg={Terminal}
            />
            <ItemTick
              title={ticketDownload("Vehicle Plate No")}
              value={ticket?.transportation?.vehicleDetails?.plateNo}
              Svg={Plate}
            />
            <ItemTick
              title={ticketDownload("Vehicle Model")}
              value={ticket?.transportation?.vehicleDetails?.model}
              Svg={Bus}
            />
            <ItemTick
              title={ticketDownload("Departure Time")}
              value={
                ticket?.transportation?.departureTime &&
                toAfghaniTime(ticket?.transportation?.departureTime)
              }
              Svg={TimeIcon}
            />
            <ItemTick
              title={ticketDownload("Arrival Time")}
              value={
                ticket?.transportation?.arrivalTime &&
                toAfghaniTime(ticket?.transportation?.arrivalTime)
              }
              Svg={TimeIcon}
            />
          </div>

          <span className="w-[85%] border border-dashed border-gray-400 my-[20px] mx-auto"></span>
          <div className="flex-col w-full flex-center z-[30] pb-[10px]">
            <span className="text-[15px]">{ticketDownload("TicketId")}</span>
            <span className="text-[15px]">{ticketId || "N/A"}</span>
          </div>

          {ticketId && (
            <Canvas
              key={ticketId}
              text={ticketId}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 200,
              }}
            />
          )}

          <div className="flex flex-col flex-center mb-[20px]">
            <span className="block text-center max-w-[90%]">
              {ticketDownload("ContactNote")}
            </span>
            <a href="tel:+93744442290" className="underline">
              +93744442290
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">Loading Ticket...</p>
        </div>
      }
    >
      <TicketDownloadContent />
    </Suspense>
  );
}

const ItemTick = ({ title, value, Svg }) => {
  return (
    <div className="flex flex-row items-start justify-center col-span-1 gap-[10px]">
      <span className="[&>svg]:w-[24px] [&>svg]:h-[22px]">
        <Svg />
      </span>
      <div className="w-[154px] flex flex-col">
        <h3 className="text-[16px] font-light text-[#797373]">{title}</h3>
        <span>{value || "N/A"}</span>
      </div>
    </div>
  );
};