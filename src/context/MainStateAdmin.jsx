"use client";
import { fetchServer } from "../actions";
import React, { createContext, useEffect, useState } from "react";
import useUserDetails from "../hooks/useUserDetails";

const ContextAdmin = createContext();

// Helper to safely parse API responses without crashing
const safeParse = (data) => {
  if (!data) return null;
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to parse response:", data, err);
    return null;
  }
};

function MainStateAdmin({ children }) {
  const [loading, setloading] = useState(false);
  const [tempAuthtoken, settempAuthtoken] = useState(null);
  const [userDetails, callerFunc, error] = useUserDetails();
  const [userCardsData, setuserCardsData] = useState({
    data: [],
    start: 0,
    end: 40,
    allDone: false,
    stats: {},
  });
  const [moderatorsCardsData, setModeratorsCardsData] = useState({
    data: [],
    start: 0,
    end: 10,
    allDone: false,
  });
  const [driversCardsData, setDriversCardsData] = useState({
    data: [],
    start: 0,
    end: 10,
    allDone: false,
  });
  const [travelAgentsCardsData, settravelAgentsCardsData] = useState({
    data: [],
    start: 0,
    end: 10,
    allDone: false,
  });
  const [companyCards, setCompanyCards] = useState({
    data: [],
    start: 0,
    end: 30,
    allDone: false,
  });
  const [transporationsCards, setTransporationsCards] = useState({
    data: [],
    start: 0,
    end: 30,
    allDone: false,
    stats: {},
  });
  const [bookedTickets, setBookedTickets] = useState({
    data: [],
    start: 0,
    end: 40,
    allDone: false,
    stats: {},
  });
  const [adsCard, setAdsCard] = useState({
    data: [],
    start: 0,
    end: 40,
    allDone: false,
  });
  const [bgAdsCard, setBgAdsCard] = useState({
    data: [],
    start: 0,
    end: 40,
    allDone: false,
  });
  const [contactCards, setcontactCards] = useState({
    data: [],
    start: 0,
    end: 50,
    allDone: false,
    stats: {},
  });
  const [destinationsCardsData, setDestinationsCardsData] = useState({
    data: [],
    start: 0,
    end: 30,
    allDone: false,
    stats: {},
  });
  const [dashboardData, setdashboardData] = useState(false);
  const [companyUser, setcompanyUser] = useState(null);
  const [travelAgent, settravelAgent] = useState(null);
  const [companyDetails, setcompanyDetails] = useState(null);

  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (userDetails) {
      setcompanyUser(userDetails?.role === "transport_company_user");
      settravelAgent(userDetails?.role === "travel_agent");
    }
  }, [userDetails]);

  const url = process.env.NEXT_PUBLIC_SERVER_URL;
  const useFetch = async (
    dirctory,
    method,
    body,
    headers,
    authToken,
    loadFunc
  ) => {
    try {
      loadFunc && loadFunc(true);
      console.log(dirctory);
      const data = await fetch(url + dirctory, {
        method: method || "GET",
        body: body && JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: authToken && "Bearer " + authToken,
          ...headers,
        },
        credentials: "include",
      });
      const parsedData = await data.json();
      console.log(parsedData);
      loadFunc && loadFunc(false);
      return parsedData;
    } catch (error) {
      console.log(error);
    }
  };

  const signIn = async (args) => {
    const raw = await fetchServer("/admin/login", "POST", args, {}, false, true);
    const parsedData = safeParse(raw);

    if (parsedData?.success && parsedData?.temp) {
      settempAuthtoken(parsedData.temp);
    }
    if (typeof callerFunc === "function") {
      await callerFunc();
    }
    return parsedData;
  };

  const updateAdminDetails = async (args) => {
    const raw = await fetchServer(
      companyUser
        ? "/transport_company_user/edit-profile"
        : "/admin/edit-profile",
      "POST",
      args,
      {},
      true,
      true
    );
    return safeParse(raw);
  };

  const addUserToCompany = async (args) => {
    const raw = await fetchServer(
      "/admin/add-transport-company-user",
      "POST",
      args,
      {},
      true,
      false
    );
    return safeParse(raw);
  };

  const addModerator = async (args) => {
    const raw = await fetchServer("/admin/add-moderator", "POST", args, {}, true, false);
    return safeParse(raw);
  };

  const addDriver = async (args) => {
    const raw = await fetchServer("/admin/add-driver", "POST", args, {}, true, false);
    return safeParse(raw);
  };

  const addTravelAgent = async (args) => {
    const raw = await fetchServer("/admin/add-travel-agent", "POST", args, {}, true, false);
    return safeParse(raw);
  };

  const addTransportation = async (args) => {
    const raw = await fetchServer("/admin/add-transportation", "POST", args, {}, true, false);
    return safeParse(raw);
  };

  const getUsersData = async (
    filter,
    start = userCardsData.start,
    end = userCardsData.end
  ) => {
    if (userCardsData.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/admin/get-users",
      "POST",
      { start, end, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setuserCardsData((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 40,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const getModeratorsData = async (
    filter,
    start = moderatorsCardsData.start,
    end = moderatorsCardsData.end
  ) => {
    if (moderatorsCardsData.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/admin/get-users",
      "POST",
      { start, end, role: "moderator", useRoleForStats: true, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setModeratorsCardsData((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 10,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const getDriversData = async (
    filter,
    start = driversCardsData.start,
    end = driversCardsData.end
  ) => {
    if (driversCardsData.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/admin/get-users",
      "POST",
      { start, end, role: "driver", useRoleForStats: true, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setDriversCardsData((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 10,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const getTravelAgentsData = async (
    filter,
    start = travelAgentsCardsData.start,
    end = travelAgentsCardsData.end
  ) => {
    if (travelAgentsCardsData.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/admin/get-users",
      "POST",
      { start, end, role: "travel_agent", useRoleForStats: true, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      settravelAgentsCardsData((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 10,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const getCompanyCards = async (
    filter,
    start = companyCards.start,
    end = companyCards.end
  ) => {
    if (companyCards.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/admin/get-transportation-companies",
      "POST",
      { start, end, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setCompanyCards((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 30,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const getTransporations = async (
    filter,
    start = transporationsCards.start,
    end = transporationsCards.end
  ) => {
    if (transporationsCards.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/admin/get-transportations",
      "POST",
      { start, end, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setTransporationsCards((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 30,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const getTransporationsCompanyUser = async (
    filter,
    start = transporationsCards.start,
    end = transporationsCards.end
  ) => {
    if (transporationsCards.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/transport_company_user/get-transportations",
      "POST",
      { start, end, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setTransporationsCards((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 30,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const getAdsData = async (
    filter,
    start = adsCard.start,
    end = adsCard.end
  ) => {
    if (adsCard.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/admin/get-ads",
      "POST",
      { start, end, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setAdsCard((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 40,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const getBgAdsData = async (
    filter,
    start = bgAdsCard.start,
    end = bgAdsCard.end
  ) => {
    if (bgAdsCard.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/admin/get-bg-ads",
      "POST",
      { start, end, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setBgAdsCard((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 40,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const deleteUsers = async (body) => {
    setloading(true);
    const raw = await fetchServer("/admin/delete-users", "DELETE", body, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const deleteCompanies = async (body) => {
    setloading(true);
    const raw = await fetchServer("/admin/delete-company", "DELETE", body, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const deleteTransportations = async (body) => {
    setloading(true);
    const raw = await fetchServer("/admin/delete-transportations", "DELETE", body, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const deleteBookings = async (body) => {
    setloading(true);
    const raw = await fetchServer("/admin/delete-bookings", "DELETE", body, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const deleteAds = async (body) => {
    setloading(true);
    const raw = await fetchServer("/admin/delete-ads", "DELETE", body, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const deleteBGAds = async (body) => {
    setloading(true);
    const raw = await fetchServer("/admin/delete-Bg-ads", "DELETE", body, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const blockUsers = async (body) => {
    setloading(true);
    const raw = await fetchServer("/admin/user-block", "POST", body, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const blockAds = async (body) => {
    setloading(true);
    const raw = await fetchServer("/admin/ads-block", "POST", body, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const fetchUserById = async (id) => {
    setloading(true);
    const raw = await fetchServer("/admin/user/" + id, "GET", false, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const fetchCompanyById = async (id) => {
    setloading(true);
    const raw = await fetchServer("/admin/company/" + id, "GET", false, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const fetchTransportationById = async (id) => {
    setloading(true);
    const endpoint = travelAgent
      ? "/travel_agent/transportation/" + id
      : companyUser
      ? "/transport_company_user/transportation/" + id
      : "/admin/transportation/" + id;
    const raw = await fetchServer(endpoint, "GET", false, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const createAd = async (body) => {
    setloading(true);
    const raw = await fetchServer("/admin/create-daily-ads", "POST", body, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const bgCreateAd = async (body) => {
    setloading(true);
    const raw = await fetchServer("/admin/create-bg-ad", "POST", body, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const getUserBookedTickets = async (id) => {
    setloading(true);
    const raw = await fetchServer("/admin/booked-tickets?userId=" + id, "GET", false, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const getBookedTickets = async (
    filter,
    start = bookedTickets.start,
    end = bookedTickets.end
  ) => {
    if (bookedTickets.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/admin/ticket-bookings",
      "POST",
      { start, end, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setBookedTickets((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 30,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const sendNotification = async (args) => {
    const raw = await fetchServer("/notifications/send-notifications", "POST", args, {}, true);
    return safeParse(raw);
  };

  const sendWebNotification = async (args) => {
    const raw = await fetchServer("/notifications/send-web-notifications", "POST", args, {}, true);
    return safeParse(raw);
  };

  const getSpecificTicketDetails = async (id) => {
    setloading(true);
    const endpoint = companyUser
      ? "/transport_company_user/booked-ticket?ticketId=" + id
      : "/admin/booked-ticket?ticketId=" + id;
    const raw = await fetchServer(endpoint, "GET", false, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const getNotificationsModerator = async () => {
    setloading(true);
    const raw = await fetchServer("/admin/get-notifications-moderator", "GET", false, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const getContactCards = async (
    start = contactCards.start,
    end = contactCards.end
  ) => {
    if (contactCards.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer("/admin/get-contacts", "POST", { start, end }, {}, true);
    const res = safeParse(raw);
    if (res?.data) {
      setcontactCards((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 40,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const editTransportation = async (args) => {
    const endpoint = companyUser
      ? "/transport_company_user/edit-transportation"
      : "/admin/edit-transportation";
    const raw = await fetchServer(endpoint, "POST", args, {}, true, false);
    return safeParse(raw);
  };

  //---------------------------------------------------------------------------------------  transport company user

  const getDashboard = async () => {
    const stats = safeParse(localStorage.getItem("dashboardStats"));

    if (
      !stats ||
      new Date() >
        new Date(new Date(stats?.lastFetch).getTime() + 1 * 60 * 60 * 1000)
    ) {
      setloading(true);
      const raw = await fetchServer("/admin/dashboard-stats", "GET", false, {}, true);
      const res = safeParse(raw);
      setloading(false);

      if (res?.success) {
        localStorage.setItem(
          "dashboardStats",
          JSON.stringify({ lastFetch: new Date(), data: res.stats })
        );
      }
      return res?.stats;
    }
    return stats.data;
  };

  const getDashboardTransport = async () => {
    const stats = safeParse(localStorage.getItem("dashboardStats"));

    if (
      !stats ||
      new Date() >
        new Date(new Date(stats?.lastFetch).getTime() + 1 * 60 * 60 * 1000)
    ) {
      setloading(true);
      const raw = await fetchServer("/transport_company_user/dashboard-stats", "GET", false, {}, true);
      const res = safeParse(raw);
      setloading(false);

      if (res?.success) {
        localStorage.setItem(
          "dashboardStats",
          JSON.stringify({ lastFetch: new Date(), data: res.stats })
        );
      }
      return res?.stats;
    }
    return stats.data;
  };

  const getCompnayDetiails = async () => {
    setloading(true);
    const raw = await fetchServer("/transport_company_user/company-details", "GET", false, {}, true);
    const res = safeParse(raw);
    setloading(false);

    if (res?.success) setcompanyDetails(res.data);
    return res;
  };

  const addTransportationCompany = async (args) => {
    const raw = await fetchServer(
      "/transport_company_user/add-transportation",
      "POST",
      args,
      {},
      true,
      false
    );
    return safeParse(raw);
  };

  const getBookedTicketsOfCompany = async (
    filter,
    start = bookedTickets.start,
    end = bookedTickets.end
  ) => {
    if (bookedTickets.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/transport_company_user/ticket-bookings",
      "POST",
      { start, end, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setBookedTickets((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 30,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const sendNotificationCompanyUser = async (args) => {
    const raw = await fetchServer(
      "/notifications/send-notifications-companyUsers",
      "POST",
      args,
      {},
      true
    );
    return safeParse(raw);
  };

  const getNotificationsCompany = async () => {
    setloading(true);
    const raw = await fetchServer("/transport_company_user/get-notifications", "GET", false, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  //---------------------------------------------------------------------------------------  travel agent
  const getDashboardTravelAgent = async () => {
    const stats = safeParse(localStorage.getItem("dashboardStatsTravelAgent"));

    if (
      !stats ||
      new Date() >
        new Date(new Date(stats?.lastFetch).getTime() + 1 * 60 * 60 * 1000)
    ) {
      setloading(true);
      const raw = await fetchServer("/travel_agent/dashboard-stats", "GET", false, {}, true);
      const res = safeParse(raw);
      setloading(false);

      if (res?.success) {
        localStorage.setItem(
          "dashboardStatsTravelAgent",
          JSON.stringify({ lastFetch: new Date(), data: res.stats })
        );
      }
      return res?.stats;
    }
    return stats.data;
  };

  const getTransporationsTravelAgent = async (
    filter,
    start = transporationsCards.start,
    end = transporationsCards.end
  ) => {
    if (transporationsCards.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/travel_agent/get-transportations",
      "POST",
      { start, end, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setTransporationsCards((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 30,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const bookTicket = async (args) => {
    if (!travelAgent) return;
    setloading(true);
    const raw = await fetchServer("/travel_agent/book-ticket", "POST", args, {}, true);
    setloading(false);
    return safeParse(raw);
  };

  const getBookedTicketsTravelAgent = async (
    filter,
    start = bookedTickets.start,
    end = bookedTickets.end
  ) => {
    if (bookedTickets.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/travel_agent/ticket-bookings",
      "POST",
      { start, end, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setBookedTickets((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 30,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const getTicketDetails = async (id) => {
    setloading(true);
    const raw = await fetchServer(
      "/travel_agent/ticket-details?ticketId=" + id,
      "GET",
      false,
      {},
      true
    );
    setloading(false);
    return safeParse(raw);
  };

  //--------------------------------------------------------------------------------------- destinations
  const getDestinationsData = async (
    filter,
    start = destinationsCardsData.start,
    end = destinationsCardsData.end
  ) => {
    if (destinationsCardsData.allDone && loading) return null;
    setloading(true);
    const raw = await fetchServer(
      "/destinations/get-destinations",
      "POST",
      { start, end, ...filter },
      {},
      true
    );
    const res = safeParse(raw);
    if (res?.data) {
      setDestinationsCardsData((e) => ({
        ...e,
        data: [...e.data, ...res.data],
        allDone: res?.allDone,
        start: e.end,
        end: e.end + 30,
        stats: e.start === 0 ? res.stats : e.stats,
      }));
    }
    setloading(false);
  };

  const addDestination = async (args) => {
    const raw = await fetchServer(
      "/destinations/add-destination",
      "POST",
      args,
      {},
      true,
      false
    );
    return safeParse(raw);
  };

  const editDestination = async (args) => {
    const raw = await fetchServer(
      "/destinations/edit-destination",
      "POST",
      args,
      {},
      true,
      false
    );
    return safeParse(raw);
  };

  const deleteDestinations = async (body) => {
    setloading(true);
    const raw = await fetchServer(
      "/destinations/bulk-delete",
      "DELETE",
      body,
      {},
      true
    );
    setloading(false);
    return safeParse(raw);
  };

  const fetchDestinationById = async (id) => {
    setloading(true);
    const raw = await fetchServer(
      "/destinations/" + id,
      "GET",
      false,
      {},
      true
    );
    setloading(false);
    return safeParse(raw);
  };

  const setDestinationRecommendation = async (args) => {
    const raw = await fetchServer(
      "/destinations/set-recommendation",
      "POST",
      args,
      {},
      true
    );
    return safeParse(raw);
  };

  const removeDestinationRecommendation = async (id) => {
    const raw = await fetchServer(
      "/destinations/remove-recommendation/" + id,
      "DELETE",
      false,
      {},
      true
    );
    return safeParse(raw);
  };

  return (
    <ContextAdmin.Provider
      value={{
        signIn,
        loading,
        setloading,
        tempAuthtoken,
        settempAuthtoken,
        userDetails,
        updateAdminDetails,
        callerFunc,
        addUserToCompany,
        useFetch,
        userCardsData,
        setuserCardsData,
        getUsersData,
        deleteUsers,
        fetchUserById,
        companyCards,
        setCompanyCards,
        getCompanyCards,
        fetchCompanyById,
        getModeratorsData,
        moderatorsCardsData,
        getDriversData,
        driversCardsData,
        getTransporations,
        transporationsCards,
        addModerator,
        addDriver,
        addTransportation,
        fetchTransportationById,
        createAd,
        adsCard,
        setAdsCard,
        getAdsData,
        getUserBookedTickets,
        blockUsers,
        deleteCompanies,
        setModeratorsCardsData,
        setTransporationsCards,
        deleteTransportations,
        deleteAds,
        blockAds,
        getDashboard,
        dashboardData,
        setdashboardData,
        companyUser,
        getDashboardTransport,
        getTransporationsCompanyUser,
        getCompnayDetiails,
        companyDetails,
        addTransportationCompany,
        getBookedTickets,
        bookedTickets,
        setBookedTickets,
        sendNotification,
        sendWebNotification,
        getBookedTicketsOfCompany,
        sendNotificationCompanyUser,
        getSpecificTicketDetails,
        getNotificationsCompany,
        getNotificationsModerator,
        bgAdsCard,
        getBgAdsData,
        setBgAdsCard,
        bgCreateAd,
        deleteBookings,
        setDriversCardsData,
        deleteBGAds,
        contactCards,
        setcontactCards,
        getContactCards,
        editTransportation,
        travelAgentsCardsData,
        settravelAgentsCardsData,
        getTravelAgentsData,
        addTravelAgent,
        travelAgent,
        getTransporationsTravelAgent,
        bookTicket,
        getBookedTicketsTravelAgent,
        getDashboardTravelAgent,
        getTicketDetails,
        ticket,
        setTicket,
        // Destinations
        destinationsCardsData,
        setDestinationsCardsData,
        getDestinationsData,
        addDestination,
        editDestination,
        deleteDestinations,
        fetchDestinationById,
        setDestinationRecommendation,
        removeDestinationRecommendation,
      }}
    >
      {children}
    </ContextAdmin.Provider>
  );
}

export default MainStateAdmin;

export { ContextAdmin };