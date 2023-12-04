import ScrollerSettingsConnectButton from './components/scroller_settings_connect_button'

import type { Metadata } from 'next'

const ScrollerSettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh] bg-[#1d1d1f] bg-cover bg-no-repeat overflow-y-auto">
      <header className="">
        <div className="h-full max-w-screen-2xl px-4 md:px-8 py-4 md:py-8 mx-auto sm:flex gap-10 items-center justify-between">
          <div className="h-[36px] mb-6 sm:mb-0">
            <svg
              width="339"
              height="36"
              viewBox="0 0 339 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.096 0.843997H20.832V7.756H7.104V14.764H20.832V35.452H0.096V28.492H14.016V21.58H0.096V0.843997ZM27.6562 0.843997H48.2963V7.708H34.5203V28.636H48.2963V35.452H27.6562V0.843997ZM55.4085 0.795998H76.2405V7.708H62.4165V14.62H69.2325V21.532H76.2405V35.404H69.2325V21.532H62.3205V35.404H55.4085V0.795998ZM69.3285 7.708H76.2405V14.62H69.3285V7.708ZM82.9688 0.843997H89.9288V35.356H82.9688V0.843997ZM89.8808 0.843997H103.705V35.356H89.8808V28.588H96.8888V7.756H89.8808V0.843997ZM110.625 0.795998H117.537V28.54H131.361V35.404H110.625V0.795998ZM138.281 0.795998H145.193V28.54H159.017V35.404H138.281V0.795998ZM165.938 0.939999H186.674V7.9H172.802V14.812H179.81V21.772H172.802V28.732H186.674V35.548H165.938V0.939999ZM193.69 0.795998H214.522V7.708H200.698V14.62H207.514V21.532H214.522V35.404H207.514V21.532H200.602V35.404H193.69V0.795998ZM207.61 7.708H214.522V14.62H207.61V7.708ZM248.998 21.532H242.086V35.404H235.174V0.795998H256.006V7.708H242.182V14.62H248.998V21.532ZM249.094 7.708H256.006L255.958 21.532H249.046L249.094 7.708ZM262.734 0.843997H283.47V35.452H276.462V7.852H269.55V35.452H262.734V0.843997ZM269.55 14.764H276.462V21.58H269.55V14.764ZM290.487 0.843997H311.223V7.756H297.495V14.764H311.223V35.452H290.487V28.492H304.407V21.58H290.487V0.843997ZM318.143 0.843997H338.879V7.756H325.151V14.764H338.879V35.452H318.143V28.492H332.063V21.58H318.143V0.843997Z"
                fill="white"
              />
            </svg>
          </div>
          <ScrollerSettingsConnectButton />
        </div>
      </header>
      {children}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Kiosk - Scroller Settings',
}

export default ScrollerSettingsLayout
