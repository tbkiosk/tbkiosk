import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useLocalStorage } from "usehooks-ts";
import cl from "classnames";

import {
  Sidebar,
  Menu,
  useProSidebar,
  sidebarClasses,
} from "react-pro-sidebar";
import { Button, Dropdown } from "@/components";

type LayoutProps = {
  showHeader?: boolean;
  children?: React.ReactNode | React.ReactNode[];
};

const MENUS = [
  {
    key: "dashboard",
    iconClass: "fa-house",
  },
  {
    key: "discover",
    iconClass: "fa-compass",
  },
  {
    key: "communities",
    iconClass: "fa-arrow-right-arrow-left",
  },
  {
    key: "activities",
    iconClass: "fa-clock",
  },
];

const DROPDOWN_MENUS = [
  {
    key: "sign out",
  },
];

const Layout = ({ showHeader = true, children }: LayoutProps) => {
  const { route } = useRouter();
  const { data: session } = useSession();
  const { collapsed, collapseSidebar } = useProSidebar();
  const [isMenuDefaultCollapsed, setIsMenuDefaultCollapsed] = useLocalStorage(
    "morphis-menu-default-collapsed",
    false
  );

  const onTogglerMenuCollapsed = (nextCollapsed: boolean) => {
    collapseSidebar();
    setIsMenuDefaultCollapsed(nextCollapsed);
  };

  return (
    <div className="h-full w-full flex grow">
      <Sidebar
        collapsedWidth="130px"
        defaultCollapsed={isMenuDefaultCollapsed}
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#000000",
            color: "#ffffff",
            position: "relative",
          },
        }}
        width="292px"
      >
        <div className="flex justify-center items-center py-8">
          <Image
            alt="logo"
            className={cl(["invert", !collapsed && "mr-2.5"])}
            height={42}
            src="/icons/logo.svg"
            width={44}
          />
          {!collapsed && <span className="text-xl font-black">MORPHIS</span>}
        </div>
        <Menu className="px-[30px]">
          <div className="flex flex-col grow gap-4">
            {MENUS.map(({ key, iconClass }) => (
              <Link href={`/${key}`} key={key}>
                <Button
                  className={cl([
                    "flex grow items-center",
                    collapsed && "justify-center",
                  ])}
                  variant={route.includes(key) ? "outlined" : "contained"}
                >
                  <i
                    className={cl([
                      "fa-solid text-lg",
                      iconClass,
                      !collapsed && "ml-4 mr-4",
                    ])}
                  />
                  {!collapsed && (
                    <span className="text-2xl capitalize">{key}</span>
                  )}
                </Button>
              </Link>
            ))}
          </div>
          {/* <i className="fa-solid fa-bars absolute bottom-4 cursor-pointer transition-opacity hover:opacity-50" /> */}
          <i
            className={cl([
              "fa-solid fa-angles-left absolute bottom-4 right-8 cursor-pointer transition-opacity transition-transform hover:opacity-50",
              collapsed && "rotate-180",
            ])}
            onClick={() => onTogglerMenuCollapsed(!collapsed)}
          />
        </Menu>
      </Sidebar>
      <main className="flex flex-col grow">
        <div className="flex items-center justify-between px-[54px] py-[38px]">
          <span className="font-bold text-xl capitalize">
            {route.replace("/", "")}
          </span>
          <Dropdown
            renderButton={() =>
              session && (
                <>
                  <Image
                    alt="avatar"
                    className="rounded-full"
                    height={32}
                    src={session?.user?.image || ""}
                    width={32}
                  />
                  <span className="mx-4 truncate">{session?.user?.name}</span>
                  <i className="fa-solid fa-chevron-down" />
                </>
              )
            }
          >
            <Dropdown.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Dropdown.Item>
                {({ active }) => (
                  <button
                    className={cl(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block w-full px-4 py-4 text-left text-sm "
                    )}
                    onClick={() => signOut()}
                  >
                    Sign out
                  </button>
                )}
              </Dropdown.Item>
            </Dropdown.Items>
          </Dropdown>
        </div>
        <div className="flex">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
