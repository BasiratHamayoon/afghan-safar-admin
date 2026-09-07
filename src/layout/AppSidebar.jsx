"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
  Bus,
  Notifications,
  Location,
  Driver,
  Ads,
  BookedTickets,
  MailIcon,
  TravelAgent,
} from "../icons/index";
import { ContextAdmin } from "@/context/MainStateAdmin";
import { useTranslations } from "next-intl";

const AppSidebar = ({ locale }) => {
  const t = useTranslations("AppSideBar");
  // Safe helper to prevent crashes if a translation key is missing
  const getTrans = (key, fallback) => (t.has(key) ? t(key) : fallback || key);

  const { companyUser, travelAgent } = useContext(ContextAdmin);
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  // ─── 1. ALL REACT HOOKS DECLARED AT THE VERY TOP ───
  const [navItems, setnavItems] = useState([]);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  useEffect(() => {
    if (travelAgent) {
      setnavItems([
        {
          icon: <GridIcon />,
          name: getTrans("Dashboard", "Dashboard"),
          path: "/",
        },
        {
          icon: <Location />,
          name: getTrans("Transportations", "Transportations"),
          path: "/transportations",
        },
        {
          icon: <BookedTickets />,
          name: getTrans("Your Bookings", "Your Bookings"),
          path: "/bookings",
        },
      ]);
    } else if (companyUser) {
      setnavItems([
        {
          icon: <GridIcon />,
          name: getTrans("Dashboard", "Dashboard"),
          path: "/",
        },
        {
          icon: <Bus />,
          name: getTrans("My Company", "My Company"),
          path: "/my-company",
        },
        {
          icon: <Location />,
          name: getTrans("Transportations", "Transportations"),
          path: "/transportations",
        },
        {
          icon: <BookedTickets />,
          name: getTrans("Ticket Bookings", "Ticket Bookings"),
          path: "/booked-tickets",
        },
        {
          icon: <Notifications />,
          name: getTrans("Notifications", "Notifications"),
          path: "/send-notifications",
        },
      ]);
    } else {
      setnavItems([
        {
          icon: <GridIcon />,
          name: getTrans("Dashboard", "Dashboard"),
          path: "/",
        },
        {
          icon: <UserCircleIcon />,
          name: getTrans("Users", "Users"),
          path: "/users",
        },
        {
          icon: <TravelAgent />,
          name: getTrans("Travel Agents", "Travel Agents"),
          subItems: [
            { name: getTrans("Travel Agents", "Travel Agents"), path: "/travel-agents" },
            { name: getTrans("Add Travel Agent", "Add Travel Agent"), path: "/add-travel-agent" },
          ],
        },
        {
          icon: <Bus />,
          name: getTrans("Tranport Companies", "Transport Companies"),
          subItems: [
            { name: getTrans("Companies", "Companies"), path: "/transport-companies" },
            { name: getTrans("Add Companies", "Add Companies"), path: "/add-transport-company" },
          ],
        },
        {
          name: getTrans("Moderators", "Moderators"),
          icon: <BoxCubeIcon />,
          subItems: [
            { name: getTrans("Moderators", "Moderators"), path: "/moderators" },
            { name: getTrans("Add Moderators", "Add Moderators"), path: "/add-moderators" },
          ],
        },
        {
          name: getTrans("Drivers", "Drivers"),
          icon: <Driver />,
          subItems: [
            { name: getTrans("Drivers", "Drivers"), path: "/drivers" },
            { name: getTrans("Add Drivers", "Add Drivers"), path: "/add-driver" },
          ],
        },
        {
          name: getTrans("Transportations", "Transportations"),
          icon: <Location />,
          subItems: [
            { name: getTrans("Transportations", "Transportations"), path: "/transportations" },
            { name: getTrans("Add Transportations", "Add Transportations"), path: "/add-transportations" },
          ],
        },
        {
          name: getTrans("Ticket Bookings", "Ticket Bookings"),
          icon: <BookedTickets />,
          path: "/booked-tickets",
        },
        {
          name: getTrans("Destinations", "Destinations"),
          icon: <Location />,
          subItems: [
            { name: getTrans("Destinations", "Destinations"), path: "/destinations" },
            { name: getTrans("Add Destination", "Add Destination"), path: "/add-destination" },
          ],
        },
        {
          name: getTrans("Hotels", "Hotels"),
          icon: <Location />,
          subItems: [
            { name: getTrans("Hotels", "Hotels"), path: "/hotels" },
            { name: getTrans("Add Hotel", "Add Hotel"), path: "/add-hotel" },
          ],
        },
        {
          name: getTrans("Hotel Bookings", "Hotel Bookings"),
          icon: <BookedTickets />,
          path: "/hotel-bookings",
        },
        {
          name: getTrans("Ads", "Ads"),
          icon: <Ads />,
          subItems: [
            { name: getTrans("Ad list", "Ad list"), path: "/ads-list" },
            { name: getTrans("Create ad", "Create ad"), path: "/create-ad" },
            { name: getTrans("Background ad", "Background ad"), path: "/background-ad" },
            {
              name: getTrans("Create Background ad", "Create Background ad"),
              path: "/create-background-ad",
            },
          ],
        },
        {
          icon: <Notifications />,
          name: getTrans("Notifications", "Notifications"),
          path: "/send-notifications",
        },
        {
          icon: <MailIcon />,
          name: getTrans("Contact Submission", "Contact Submission"),
          path: "/contact-Submission",
        },
      ]);
    }
  }, [companyUser, travelAgent, t]);

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? `menu-item-icon-active ${
                          index === 3 ||
                          index === 6 ||
                          (companyUser && index === 1)
                            ? "[&_path]:stroke-brand-500"
                            : "[&_svg]:fill-brand-500"
                        }`
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 ${
        companyUser === null ? "animate-pulse blur-md" : ""
      } ${
        locale === "en" ? "left-0" : "right-0"
      } px-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${
          isMobileOpen
            ? "translate-x-0"
            : "ltr:-translate-x-full rtl:translate-x-full"
        }
        lg:!translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/" className="flex flex-row items-end gap-[5px]">
          <Image
            src={"/images/icons/logo.png"}
            alt="Logo"
            width={64}
            height={64}
          />
          {(isExpanded || isMobileOpen || isHovered) && (
            <h1 className="text-[25px] leading-[25px] font-[700] mb-[4px] dark:text-white">
              {getTrans("Afghan Safar", "Afghan Safar")}
            </h1>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear custom-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;