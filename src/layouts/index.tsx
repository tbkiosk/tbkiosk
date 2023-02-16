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
import { Button } from "@/components";

type LayoutProps = {
  children?: React.ReactNode;
};

const MENUS = [
  {
    key: "Dashboard",
    link: "/dashboard",
    iconClass: "fa-house",
  },
  {
    key: "Discover",
    link: "/discover",
    iconClass: "fa-compass",
  },
  {
    key: "Communities",
    link: "/communities",
    iconClass: "fa-arrow-right-arrow-left",
  },
  {
    key: "Activities",
    link: "/activities",
    iconClass: "fa-clock",
  },
];

const Layout = ({ children }: LayoutProps) => {
  const { route } = useRouter();
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
            {MENUS.map(({ key, link, iconClass }) => (
              <Link href={link} key={key}>
                <Button
                  className={cl([
                    "flex grow items-center",
                    collapsed && "justify-center",
                  ])}
                  variant={route.startsWith(link) ? "outlined" : "contained"}
                >
                  <i
                    className={cl([
                      "fa-solid text-lg",
                      iconClass,
                      !collapsed && "ml-4 mr-4",
                    ])}
                  />
                  {!collapsed && <span className="text-2xl">{key}</span>}
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
      <main className="flex grow">{children}</main>
    </div>
  );
};

export default Layout;
