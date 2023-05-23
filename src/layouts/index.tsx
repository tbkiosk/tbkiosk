import { signOut } from 'next-auth/react'
import { Sidebar, Menu, useProSidebar, sidebarClasses } from 'react-pro-sidebar'
import { useRouter } from 'next/router'
import Link from 'next/link'
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
  {
    key: 'portfolio',
    iconClass: 'fa-house',
  },
  {
    key: 'settings',
    iconClass: 'fa-gear',
  },
]

const LargeLogo = () => (
  <svg
    width="178"
    height="40"
    viewBox="0 0 178 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.77832 31.3513L8.73508 1.08099H18.681L26.6378 31.3513H20.7567L19.1135 24.6918H8.30265L6.6594 31.3513H0.77832ZM9.64319 19.4161H17.7729L14.0972 4.67018H13.3189L9.64319 19.4161ZM30.0017 31.3513V9.90262H35.4503V31.3513H30.0017ZM32.726 7.39451C31.7458 7.39451 30.9098 7.07739 30.2179 6.44316C29.5548 5.80892 29.2233 4.97289 29.2233 3.93505C29.2233 2.89721 29.5548 2.06118 30.2179 1.42694C30.9098 0.792704 31.7458 0.475586 32.726 0.475586C33.735 0.475586 34.571 0.792704 35.2341 1.42694C35.8971 2.06118 36.2287 2.89721 36.2287 3.93505C36.2287 4.97289 35.8971 5.80892 35.2341 6.44316C34.571 7.07739 33.735 7.39451 32.726 7.39451ZM41.0557 31.3513V9.90262H46.4179V12.3242H47.1963C47.5134 11.4594 48.0323 10.8251 48.753 10.4215C49.5025 10.0179 50.3674 9.81613 51.3476 9.81613H53.9422V14.6594H51.2611C49.8773 14.6594 48.7385 15.0342 47.8449 15.7837C46.9512 16.5045 46.5044 17.6288 46.5044 19.1567V31.3513H41.0557ZM65.657 31.9567C63.9562 31.9567 62.3562 31.5386 60.857 30.7026C59.3868 29.8378 58.2048 28.5837 57.3111 26.9405C56.4173 25.2972 55.9705 23.308 55.9705 20.9729V20.281C55.9705 17.9459 56.4173 15.9567 57.3111 14.3134C58.2048 12.6702 59.3868 11.4305 60.857 10.5945C62.3273 9.72964 63.9273 9.29721 65.657 9.29721C66.9543 9.29721 68.0354 9.45577 68.9003 9.77289C69.794 10.0612 70.5146 10.4359 71.0624 10.8972C71.6102 11.3585 72.0282 11.8486 72.3165 12.3675H73.0949V1.08099H78.5435V31.3513H73.1814V28.7567H72.403C71.9129 29.5639 71.1489 30.299 70.1111 30.9621C69.1021 31.6251 67.6173 31.9567 65.657 31.9567ZM67.3003 27.1999C68.9724 27.1999 70.3705 26.6666 71.4949 25.5999C72.6192 24.5045 73.1814 22.9188 73.1814 20.8432V20.4107C73.1814 18.335 72.6192 16.7639 71.4949 15.6972C70.3994 14.6018 69.0011 14.054 67.3003 14.054C65.6282 14.054 64.23 14.6018 63.1057 15.6972C61.9813 16.7639 61.4192 18.335 61.4192 20.4107V20.8432C61.4192 22.9188 61.9813 24.5045 63.1057 25.5999C64.23 26.6666 65.6282 27.1999 67.3003 27.1999ZM90.8114 31.9567C89.2835 31.9567 87.9141 31.6972 86.7033 31.1783C85.4925 30.6305 84.5268 29.8521 83.806 28.8432C83.1141 27.8053 82.7682 26.5513 82.7682 25.081C82.7682 23.6107 83.1141 22.3855 83.806 21.4053C84.5268 20.3963 85.507 19.6467 86.7465 19.1567C88.0151 18.6378 89.4565 18.3783 91.0709 18.3783H96.952V17.1675C96.952 16.1585 96.6349 15.3369 96.0006 14.7026C95.3664 14.0396 94.3574 13.708 92.9736 13.708C91.6187 13.708 90.6097 14.0251 89.9465 14.6594C89.2835 15.2648 88.8511 16.0575 88.6492 17.0378L83.633 15.3513C83.979 14.2558 84.5268 13.2612 85.2763 12.3675C86.0546 11.445 87.0781 10.7098 88.3465 10.1621C89.6438 9.5855 91.2151 9.29721 93.0601 9.29721C95.8853 9.29721 98.1195 10.0035 99.7628 11.4161C101.406 12.8288 102.228 14.8756 102.228 17.5567V25.5567C102.228 26.4215 102.631 26.854 103.438 26.854H105.168V31.3513H101.536C100.469 31.3513 99.5898 31.0918 98.8979 30.5729C98.206 30.054 97.8601 29.3621 97.8601 28.4972V28.454H97.0384C96.9232 28.7999 96.6637 29.2612 96.2601 29.8378C95.8565 30.3855 95.2222 30.8756 94.3574 31.308C93.4925 31.7405 92.3105 31.9567 90.8114 31.9567ZM91.7628 27.5459C93.2908 27.5459 94.5303 27.1278 95.4817 26.2918C96.4619 25.4269 96.952 24.2882 96.952 22.8756V22.4432H91.4601C90.4511 22.4432 89.6583 22.6594 89.0817 23.0918C88.5051 23.5242 88.2168 24.1296 88.2168 24.908C88.2168 25.6864 88.5195 26.3207 89.1249 26.8107C89.7303 27.3008 90.6097 27.5459 91.7628 27.5459ZM110.365 31.3513L107.338 9.90262H112.744L114.646 27.6756H115.425L118.192 9.90262H126.928L129.695 27.6756H130.473L132.376 9.90262H137.782L134.755 31.3513H125.717L122.949 13.5783H122.171L119.403 31.3513H110.365ZM140.991 20.7134V20.0215C140.991 17.7729 141.438 15.8558 142.332 14.2702C143.225 12.6558 144.408 11.4305 145.878 10.5945C147.376 9.72964 149.005 9.29721 150.764 9.29721C152.724 9.29721 154.209 9.64316 155.218 10.335C156.227 11.0269 156.962 11.7477 157.424 12.4972H158.202V9.90262H163.564V35.1567C163.564 36.6269 163.132 37.7945 162.267 38.6594C161.402 39.5531 160.249 39.9999 158.808 39.9999H144.451V35.2432H156.905C157.711 35.2432 158.116 34.8107 158.116 33.9459V28.3675H157.337C157.049 28.8288 156.645 29.3045 156.126 29.7945C155.608 30.2558 154.916 30.645 154.051 30.9621C153.186 31.2792 152.09 31.4378 150.764 31.4378C149.005 31.4378 147.376 31.0197 145.878 30.1837C144.408 29.3188 143.225 28.0936 142.332 26.508C141.438 24.8936 140.991 22.9621 140.991 20.7134ZM152.321 26.681C153.992 26.681 155.391 26.1477 156.516 25.081C157.64 24.0143 158.202 22.5153 158.202 20.5837V20.1513C158.202 18.1909 157.64 16.6918 156.516 15.654C155.419 14.5873 154.022 14.054 152.321 14.054C150.649 14.054 149.251 14.5873 148.126 15.654C147.002 16.6918 146.44 18.1909 146.44 20.1513V20.5837C146.44 22.5153 147.002 24.0143 148.126 25.081C149.251 26.1477 150.649 26.681 152.321 26.681Z"
      fill="white"
    />
    <path
      d="M172.588 31.9567C171.436 31.9567 170.455 31.5819 169.648 30.8324C168.869 30.054 168.48 29.0594 168.48 27.8486C168.48 26.6378 168.869 25.6576 169.648 24.908C170.455 24.1297 171.436 23.7405 172.588 23.7405C173.771 23.7405 174.75 24.1297 175.529 24.908C176.307 25.6576 176.696 26.6378 176.696 27.8486C176.696 29.0594 176.307 30.054 175.529 30.8324C174.75 31.5819 173.771 31.9567 172.588 31.9567Z"
      fill="#3B71FE"
    />
  </svg>
)

const SmallLogo = () => (
  <svg
    width="84"
    height="19"
    viewBox="0 0 84 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1251_140)">
      <path
        d="M0.368774 14.8918L4.13853 0.513398H8.85073L12.6205 14.8918H9.83414L9.0556 11.7285H3.93365L3.15512 14.8918H0.368774ZM4.56877 9.22259H8.42048L6.67902 2.21826H6.31024L4.56877 9.22259ZM14.2142 14.8918V4.70367H16.7957V14.8918H14.2142ZM15.505 3.51232C15.0406 3.51232 14.6445 3.36169 14.3167 3.06043C14.0025 2.75916 13.8454 2.36205 13.8454 1.86907C13.8454 1.3761 14.0025 0.978986 14.3167 0.677723C14.6445 0.376461 15.0406 0.22583 15.505 0.22583C15.983 0.22583 16.3791 0.376461 16.6933 0.677723C17.0074 0.978986 17.1645 1.3761 17.1645 1.86907C17.1645 2.36205 17.0074 2.75916 16.6933 3.06043C16.3791 3.36169 15.983 3.51232 15.505 3.51232ZM19.4514 14.8918V4.70367H21.9919V5.85394H22.3607C22.5109 5.44313 22.7568 5.14185 23.0983 4.95016C23.4534 4.75845 23.8631 4.66259 24.3275 4.66259H25.5568V6.96313H24.2865C23.6309 6.96313 23.0914 7.14116 22.668 7.49718C22.2446 7.83954 22.0329 8.3736 22.0329 9.09934V14.8918H19.4514ZM31.107 15.1793C30.3012 15.1793 29.5432 14.9808 28.8329 14.5837C28.1363 14.1729 27.5763 13.5772 27.1529 12.7966C26.7295 12.0161 26.5178 11.0712 26.5178 9.96205V9.6334C26.5178 8.52421 26.7295 7.57934 27.1529 6.7988C27.5763 6.01826 28.1363 5.42942 28.8329 5.03232C29.5295 4.62151 30.2875 4.4161 31.107 4.4161C31.7217 4.4161 32.2339 4.49142 32.6436 4.64205C33.0671 4.77899 33.4085 4.957 33.668 5.1761C33.9275 5.39522 34.1256 5.62799 34.2622 5.87448H34.6309V0.513398H37.2124V14.8918H34.6719V13.6593H34.3031C34.071 14.0428 33.709 14.392 33.2173 14.7069C32.7392 15.0218 32.0358 15.1793 31.107 15.1793ZM31.8856 12.9199C32.6778 12.9199 33.3402 12.6666 33.8729 12.1599C34.4056 11.6395 34.6719 10.8864 34.6719 9.90043V9.69502C34.6719 8.70907 34.4056 7.96279 33.8729 7.4561C33.3539 6.93576 32.6914 6.67556 31.8856 6.67556C31.0934 6.67556 30.4309 6.93576 29.8983 7.4561C29.3656 7.96279 29.0992 8.70907 29.0992 9.69502V9.90043C29.0992 10.8864 29.3656 11.6395 29.8983 12.1599C30.4309 12.6666 31.0934 12.9199 31.8856 12.9199ZM43.0247 15.1793C42.3008 15.1793 41.652 15.0561 41.0783 14.8096C40.5047 14.5494 40.0471 14.1797 39.7057 13.7004C39.3779 13.2075 39.214 12.6118 39.214 11.9134C39.214 11.215 39.3779 10.6331 39.7057 10.1675C40.0471 9.68819 40.5116 9.33212 41.0988 9.09934C41.6998 8.85286 42.3828 8.72961 43.1476 8.72961H45.934V8.15448C45.934 7.67522 45.7837 7.28495 45.4832 6.98367C45.1828 6.66873 44.7047 6.51124 44.0491 6.51124C43.4071 6.51124 42.9291 6.66185 42.6149 6.96313C42.3008 7.2507 42.0959 7.62726 42.0003 8.09286L39.6237 7.29178C39.7876 6.77143 40.0471 6.299 40.4023 5.87448C40.771 5.4363 41.2559 5.08709 41.8569 4.82691C42.4715 4.55304 43.2159 4.4161 44.0901 4.4161C45.4286 4.4161 46.4871 4.7516 47.2657 5.42259C48.0442 6.0936 48.4335 7.06583 48.4335 8.33934V12.1393C48.4335 12.5502 48.6247 12.7556 49.0071 12.7556H49.8266V14.8918H48.1057C47.6003 14.8918 47.1837 14.7685 46.8559 14.522C46.5281 14.2756 46.3642 13.9469 46.3642 13.5361V13.5156H45.9749C45.9203 13.6799 45.7974 13.899 45.6062 14.1729C45.415 14.4331 45.1144 14.6658 44.7047 14.8712C44.2949 15.0766 43.735 15.1793 43.0247 15.1793ZM43.4754 13.0842C44.1994 13.0842 44.7866 12.8856 45.2374 12.4885C45.7018 12.0777 45.934 11.5368 45.934 10.8658V10.6604H43.332C42.854 10.6604 42.4784 10.7631 42.2052 10.9685C41.932 11.1739 41.7954 11.4615 41.7954 11.8312C41.7954 12.201 41.9388 12.5022 42.2257 12.735C42.5125 12.9678 42.9291 13.0842 43.4754 13.0842ZM52.289 14.8918L50.8546 4.70367H53.4158L54.3173 13.1458H54.686L55.9973 4.70367H60.1358L61.447 13.1458H61.8158L62.7173 4.70367H65.2782L63.8441 14.8918H59.5621L58.2509 6.44962H57.8821L56.5709 14.8918H52.289ZM66.7989 9.8388V9.51016C66.7989 8.44205 67.0105 7.53143 67.4341 6.77826C67.8571 6.01143 68.4175 5.42942 69.1141 5.03232C69.824 4.62151 70.5958 4.4161 71.4292 4.4161C72.3578 4.4161 73.061 4.58043 73.5394 4.90907C74.0173 5.23772 74.3656 5.58008 74.5843 5.9361H74.9531V4.70367H77.4936V16.6993C77.4936 17.3977 77.2887 17.9523 76.8789 18.3631C76.4692 18.7876 75.9227 18.9999 75.2399 18.9999H68.438V16.7404H74.3385C74.7205 16.7404 74.9121 16.535 74.9121 16.1242V13.4745H74.5433C74.4066 13.6936 74.2155 13.9195 73.9697 14.1523C73.7238 14.3714 73.396 14.5563 72.9863 14.7069C72.5765 14.8575 72.0571 14.9329 71.4292 14.9329C70.5958 14.9329 69.824 14.7343 69.1141 14.3372C68.4175 13.9264 67.8571 13.3444 67.4341 12.5912C67.0105 11.8244 66.7989 10.9069 66.7989 9.8388ZM72.1667 12.6734C72.9586 12.6734 73.6214 12.4201 74.1541 11.9134C74.6867 11.4067 74.9531 10.6947 74.9531 9.77718V9.57178C74.9531 8.64062 74.6867 7.92853 74.1541 7.43556C73.6347 6.92888 72.9724 6.67556 72.1667 6.67556C71.3744 6.67556 70.7121 6.92888 70.1794 7.43556C69.6467 7.92853 69.3804 8.64062 69.3804 9.57178V9.77718C69.3804 10.6947 69.6467 11.4067 70.1794 11.9134C70.7121 12.4201 71.3744 12.6734 72.1667 12.6734Z"
        fill="white"
      />
      <path
        d="M81.7689 15.1796C81.2229 15.1796 80.7583 15.0015 80.3757 14.6455C80.0069 14.2758 79.8225 13.8033 79.8225 13.2282C79.8225 12.6531 80.0069 12.1875 80.3757 11.8315C80.7583 11.4617 81.2229 11.2769 81.7689 11.2769C82.3292 11.2769 82.7932 11.4617 83.162 11.8315C83.5308 12.1875 83.7152 12.6531 83.7152 13.2282C83.7152 13.8033 83.5308 14.2758 83.162 14.6455C82.7932 15.0015 82.3292 15.1796 81.7689 15.1796Z"
        fill="#3B71FE"
      />
    </g>
    <defs>
      <clipPath id="clip0_1251_140">
        <rect
          width="84"
          height="19"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
)

const SideBarFooter = () => (
  <div className="mt-4 border-t border-[var(--primary-text-color--disabled)] pt-4 pb-6 px-8">
    <button
      className="flex items-center"
      onClick={() => signOut({ callbackUrl: '/login' })}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 16L1.29289 16.7071L0.585786 16L1.29289 15.2929L2 16ZM17 15C17.5523 15 18 15.4477 18 16C18 16.5523 17.5523 17 17 17L17 15ZM6.29289 21.7071L1.29289 16.7071L2.70711 15.2929L7.70711 20.2929L6.29289 21.7071ZM1.29289 15.2929L6.29289 10.2929L7.70711 11.7071L2.70711 16.7071L1.29289 15.2929ZM2 15L17 15L17 17L2 17L2 15Z"
          fill="white"
        />
        <path
          d="M22 8L22.7071 8.70711L23.4142 8L22.7071 7.29289L22 8ZM7 7C6.44771 7 6 7.44772 6 8C6 8.55228 6.44771 9 7 9V7ZM17.7071 13.7071L22.7071 8.70711L21.2929 7.29289L16.2929 12.2929L17.7071 13.7071ZM22.7071 7.29289L17.7071 2.29289L16.2929 3.70711L21.2929 8.70711L22.7071 7.29289ZM22 7H7V9H22V7Z"
          fill="white"
        />
      </svg>
      <span className="font-medium text-xl ml-4">Log out</span>
    </button>
    <p className="text-[var(--primary-text-color--disabled)] mt-6">
      <span>V0.0.1</span>
      <span className="ml-5">Morphis Network</span>
    </p>
  </div>
)

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
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        width="18rem"
      >
        <div className="flex justify-center items-center pt-9 pb-28">{collapsed ? <SmallLogo /> : <LargeLogo />}</div>
        <Menu className="px-[30px] flex-1">
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
        </Menu>
        <SideBarFooter />
      </Sidebar>
      <main className="flex flex-col grow overflow-hidden">
        {showHeader && (
          <div className="flex items-center justify-between px-12 py-12">
            <span className="font-bold text-5xl capitalize leading-[4rem]">{headerLeft || route.replace('/', '')}</span>
            <div className="flex flex-row items-center">
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
