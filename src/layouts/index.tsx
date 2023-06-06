import Image from 'next/image'
import cl from 'classnames'

type LayoutProps = {
  children?: React.ReactNode | React.ReactNode[]
  className?: string
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={cl(['h-full w-full flex flex-col', className])}>
      <header className="flex justify-between px-[160px] py-[40px]">
        <Image
          alt="artwork_4"
          height={40}
          src="/icons/logo_with_text.svg"
          width={160}
        />
        <p>user</p>
      </header>
      <main className="px-[160px]">{children}</main>
    </div>
  )
}

export default Layout
