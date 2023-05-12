import { Sidebar, Menu, useProSidebar, sidebarClasses } from 'react-pro-sidebar'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useLocalStorage } from 'usehooks-ts'
import cl from 'classnames'

import { Button } from '@/components'
import WalletDropdown from './components/wallet_dropdown'

type LayoutProps = {
  showHeader?: boolean
  headerLeft?: React.ReactNode
  children?: React.ReactNode | React.ReactNode[]
}

const MENUS = [
  {
    key: 'discover',
    iconClass: 'fa-compass',
  },
]

const Layout = ({ showHeader = true, headerLeft, children }: LayoutProps) => {
  const { route } = useRouter()
  const { collapsed, collapseSidebar } = useProSidebar()

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
            {MENUS.map(({ key, iconClass }) => (
              <Link
                href={`/${key}`}
                key={key}
              >
                <Button
                  className={cl(['flex grow items-center', collapsed && 'justify-center'])}
                  variant={route.startsWith(`/${key}`) ? 'outlined' : 'contained'}
                >
                  <i className={cl(['fa-solid text-lg', iconClass, !collapsed && 'ml-4 mr-4'])} />
                  {!collapsed && <span className="text-2xl capitalize">{key}</span>}
                </Button>
              </Link>
            ))}
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
            <span className="font-bold text-3xl capitalize">{headerLeft || route.replace('/', '')}</span>
            <div className="flex flex-row items-center">
              <span className="h-12 w-12 flex shrink-0 items-center justify-center bg-[#fdede5] rounded-full cursor-pointer">
                <i className="fa-regular fa-bell fa-xl" />
              </span>
              <WalletDropdown buttonClassName="!h-[3.375rem]" />
            </div>
          </div>
        )}
        <div className="flex flex-col grow px-12 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}

export default Layout
