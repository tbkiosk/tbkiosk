import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useLocalStorage } from 'usehooks-ts'
import cl from 'classnames'

import { Sidebar, Menu, useProSidebar, sidebarClasses } from 'react-pro-sidebar'
import { Button, Tooltip } from '@/components'
import WalletDropdown from './components/wallet_dropdown'
import ConnectStatus from './components/connect_status'

import useRole from '@/hooks/useRole'

import { ROLES } from '@/constants/roles'

type LayoutProps = {
  showHeader?: boolean
  children?: React.ReactNode | React.ReactNode[]
}

const MENUS = [
  {
    key: 'profile',
    iconClass: 'fa-house',
  },
  {
    key: 'discover',
    iconClass: 'fa-compass',
  },
  {
    key: 'communities',
    iconClass: 'fa-arrow-right-arrow-left',
    disabled: true,
  },
  {
    key: 'activities',
    iconClass: 'fa-clock',
    disabled: true,
  },
]

const Layout = ({ showHeader = true, children }: LayoutProps) => {
  const { route } = useRouter()
  const { collapsed, collapseSidebar } = useProSidebar()
  const [role] = useRole()

  const [isMenuDefaultCollapsed, setIsMenuDefaultCollapsed] = useLocalStorage('morphis_menu_collapsed', false)

  const onTogglerMenuCollapsed = (nextCollapsed: boolean) => {
    collapseSidebar()
    setIsMenuDefaultCollapsed(nextCollapsed)
  }

  return (
    <div className="h-full w-full flex grow">
      <Sidebar
        collapsedWidth="8rem"
        defaultCollapsed={isMenuDefaultCollapsed}
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: '#000000',
            color: '#ffffff',
            position: 'relative',
          },
        }}
        width="18rem"
      >
        <div className="flex justify-center items-center py-8">
          <Image
            alt="logo"
            className={cl(['invert', !collapsed && 'mr-2.5'])}
            height={42}
            src="/icons/logo.svg"
            width={44}
          />
          {!collapsed && <span className="text-xl font-black">MORPHIS</span>}
        </div>
        <Menu className="px-[30px]">
          <div className="flex flex-col grow gap-4">
            {MENUS.map(({ key, iconClass, disabled }) =>
              disabled ? (
                <Tooltip
                  key={key}
                  tip={disabled ? 'Coming soon' : undefined}
                >
                  <Button
                    className={cl(['flex grow items-center', collapsed && 'justify-center'])}
                    variant={route.includes(key) ? 'outlined' : 'contained'}
                  >
                    <i className={cl(['fa-solid text-lg', iconClass, !collapsed && 'ml-4 mr-4'])} />
                    {!collapsed && <span className="text-2xl capitalize">{key}</span>}
                  </Button>
                </Tooltip>
              ) : (
                <Link
                  href={`/${key}`}
                  key={key}
                >
                  <Button
                    className={cl(['flex grow items-center', collapsed && 'justify-center'])}
                    variant={route.includes(key) ? 'outlined' : 'contained'}
                  >
                    <i className={cl(['fa-solid text-lg', iconClass, !collapsed && 'ml-4 mr-4'])} />
                    {!collapsed && <span className="text-2xl capitalize">{key}</span>}
                  </Button>
                </Link>
              )
            )}
            {role === ROLES.CREATOR && (
              <Link href="/project">
                <Button
                  className={cl(['flex grow items-center', collapsed && 'justify-center'])}
                  variant={route.includes('project') ? 'outlined' : 'contained'}
                >
                  <i className={cl(['fa-solid fa-folder-closed text-lg', !collapsed && 'ml-4 mr-4'])} />
                  {!collapsed && <span className="text-2xl capitalize">Project</span>}
                </Button>
              </Link>
            )}
          </div>
          <i
            className={cl([
              'fa-solid fa-angles-left absolute bottom-4 right-8 cursor-pointer transition-opacity transition-transform hover:opacity-50',
              collapsed && 'rotate-180',
            ])}
            onClick={() => onTogglerMenuCollapsed(!collapsed)}
          />
        </Menu>
      </Sidebar>
      <main className="flex flex-col grow overflow-hidden">
        {showHeader && (
          <div className="flex items-center justify-between px-12 py-9">
            <span className="font-bold text-5xl capitalize">{route.replace('/', '')}</span>
            <div className="flex flex-row items-center">
              <span className="h-12 w-12 flex shrink-0 items-center justify-center bg-[#fdede5] rounded-full cursor-pointer">
                <i className="fa-regular fa-bell fa-xl" />
              </span>
              <div className="mx-4">
                <ConnectStatus />
              </div>
              <WalletDropdown buttonClassNames="!h-[3.375rem]" />
            </div>
          </div>
        )}
        <div className="flex flex-col grow px-12 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}

export default Layout
