import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button, Select, SelectItem } from '@nextui-org/react'
import clsx from 'clsx'

import { Category } from '@prisma/client'

export const CATEGORY_TYPE_ALL = 'All'
export const CATEGORY_TYPE_NEW = 'New'

const Filters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const categories = searchParams.get('categories') || CATEGORY_TYPE_ALL

  return (
    <>
      <div className="hidden md:flex flex-wrap justify-center gap-2 px-16 pb-8">
        {[CATEGORY_TYPE_ALL, CATEGORY_TYPE_NEW, ...Object.keys(Category)].map(_c => (
          <Button
            className={clsx(
              'text-black capitalize bg-transparent hover:bg-[rgba(0,0,0,0.12)] rounded',
              _c === categories && 'bg-[rgba(0,0,0,0.1)]'
            )}
            key={_c}
            onPress={() => router.replace(`${pathname}?categories=${_c}`)}
          >
            {_c}
          </Button>
        ))}
      </div>
      <div className="w-full md:hidden mb-8">
        <Select
          classNames={{ popoverContent: 'bg-white' }}
          label="Filter by categories"
          onSelectionChange={keys => Array.from(keys)[0] && router.replace(`${pathname}?categories=${Array.from(keys)[0]}`)}
          selectedKeys={[categories]}
          size="sm"
        >
          {[CATEGORY_TYPE_ALL, CATEGORY_TYPE_NEW, ...Object.keys(Category)].map(_c => (
            <SelectItem
              key={_c}
              value={_c}
            >
              {_c}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  )
}

export default Filters
