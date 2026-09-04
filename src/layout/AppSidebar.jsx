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
  ListIcon,
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
  const { companyUser, travelAgent } = useContext(ContextAdmin);
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [navItems, setnavItems] = useState([
    {
      icon: <GridIcon />,
      name: t("Dashboard"),
      path: "/",
    },
    {
      icon: <UserCircleIcon />,
      name: t("Users"),
      path: "/users",
    },
    {
      icon: <UserCircleIcon />,
      name: t("Travel Agents"),
      subItems: [
        { name: t("Travel Agents"), path: "/travel-agents" },
        { name: t("Add Travel Agent"), path: "/add-travel-agent" },
      ],
    },
    {
      icon: <Bus />,
      name: t("Tranport Companies"),
      subItems: [
        { name: t("Companies"), path: "/transport-companies" },
        { name: t("Add Companies"), path: "/add-transport-company" },
      ],
    },
    {
      name: t("Moderators"),
      icon: <BoxCubeIcon />,
      subItems: [
        { name: t("Moderators"), path: "/moderators" },
        { name: t("Add Moderators"), path: "/add-moderators" },
      ],
    },
    {
      name: t("Drivers"),
      icon: <Driver />,
      subItems: [
        { name: t("Drivers"), path: "/drivers" },
        { name: t("Add Drivers"), path: "/add-driver" },
      ],
    },
    {
      name: t("Transportations"),
      icon: <Location />,
      subItems: [
        { name: t("Transportations"), path: "/transportations" },
        { name: t("Add Transportations"), path: "/add-transportations" },
      ],
    },
    {
      name: t("Ticket Bookings"),
      icon: <BookedTickets />,
      path: "/booked-tickets",
    },
    {
      name: t("Ads"),
      icon: <Ads />,
      subItems: [
        { name: t("Ad list"), path: "/ads-list" },
        { name: t("Create ad"), path: "/create-ad" },
        { name: t("Background ad"), path: "/background-ad" },
        { name: t("Create Background ad"), path: "/create-background-ad" },
      ],
    },
    {
      icon: <Notifications />,
      name: t("Notifications"),
      path: "/send-notifications",
    },
    {
      icon: <MailIcon />,
      name: t("Contact Submission"),
      path: "/contact-Submission",
    },
  ]);

  const renderMenuItems = (navItems, menuType) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
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
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
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
                          index == 3 ||
                          index == 6 ||
                          (companyUser && index == 1)
                            ? "[&_path]:stroke-brand-500"
                            : "[&_svg]:fill-brand-500"
                        }`
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
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

  useEffect(() => {
    travelAgent
      ? setnavItems((e) => [
          {
            icon: <GridIcon />,
            name: t("Dashboard"),
            path: "/",
          },
          {
            icon: <Location />,
            name: t("Transportations"),
            path: "/transportations",
          },
          {
            icon: <BookedTickets />,
            name: t("Your Bookings"),
            path: "/bookings",
          },
        ])
      : companyUser
      ? setnavItems((e) => {
          console.log(e);
          const temp = [...e];
          temp.splice(1, 4);
          temp[1] = {
            icon: <Bus />,
            name: t("My Company"),
            path: "/my-company",
          };
          temp.splice(4, 1);
          temp.splice(5, 1);
          console.log(temp);
          return [...temp];
        })
      : setnavItems([
          {
            icon: <GridIcon />,
            name: t("Dashboard"),
            path: "/",
          },
          {
            icon: <UserCircleIcon />,
            name: t("Users"),
            path: "/users",
          },
          {
            icon: <TravelAgent />,
            name: t("Travel Agents"),
            subItems: [
              { name: t("Travel Agents"), path: "/travel-agents" },
              { name: t("Add Travel Agent"), path: "/add-travel-agent" },
            ],
          },
          {
            icon: <Bus />,
            name: t("Tranport Companies"),
            subItems: [
              { name: t("Companies"), path: "/transport-companies" },
              { name: t("Add Companies"), path: "/add-transport-company" },
            ],
          },
          {
            name: t("Moderators"),
            icon: <BoxCubeIcon />,
            subItems: [
              { name: t("Moderators"), path: "/moderators" },
              { name: t("Add Moderators"), path: "/add-moderators" },
            ],
          },
          {
            name: t("Drivers"),
            icon: <Driver />,
            subItems: [
              { name: t("Drivers"), path: "/drivers" },
              { name: t("Add Drivers"), path: "/add-driver" },
            ],
          },
          {
            name: t("Transportations"),
            icon: <Location />,
            subItems: [
              { name: t("Transportations"), path: "/transportations" },
              { name: t("Add Transportations"), path: "/add-transportations" },
            ],
          },
          {
            name: t("Ticket Bookings"),
            icon: <BookedTickets />,
            path: "/booked-tickets",
          },
          {
            name: t("Destinations"),
            icon: <Location />,
            subItems: [
              { name: t("Destinations"), path: "/destinations" },
              { name: t("Add Destination"), path: "/add-destination" },
            ],
          },
          {
            name: t("Ads"),
            icon: <Ads />,
            subItems: [
              { name: t("Ad list"), path: "/ads-list" },
              { name: t("Create ad"), path: "/create-ad" },
              { name: t("Background ad"), path: "/background-ad" },
              {
                name: t("Create Background ad"),
                path: "/create-background-ad",
              },
            ],
          },
          {
            icon: <Notifications />,
            name: t("Notifications"),
            path: "/send-notifications",
          },
          {
            icon: <MailIcon />,
            name: t("Contact Submission"),
            path: "/contact-Submission",
          },
        ]);
  }, [companyUser, travelAgent]);

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});
  const isActive = useCallback((path) => path === pathname, [pathname]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
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
              {t("Afghan Safar")}
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