'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Box, Button, Select } from '@mantine/core'

import classes from './styles.module.css'

import { Category } from '@prisma/client'

export const CATEGORY_TYPE_ALL = 'all'
export const CATEGORY_TYPE_NEW = 'new'

export default function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categories = searchParams.get('categories') || CATEGORY_TYPE_ALL

  return (
    <>
      <Box className={classes['filter-row']}>
        {[CATEGORY_TYPE_ALL, CATEGORY_TYPE_NEW, ...Object.keys(Category)].map(_c => (
          <Link
            href={`?categories=${_c}`}
            key={_c}
          >
            <Button
              className={classes.button}
              color="rgba(0, 0, 0, 1)"
              fw={categories === _c ? 700 : 500}
              variant={categories === _c ? 'light' : 'subtle'}
            >
              {_c}
            </Button>
          </Link>
        ))}
      </Box>
      <Select
        classNames={{
          root: classes['filter-select-root'],
          input: classes['filter-select-input'],
          dropdown: classes['filter-select-dropdown'],
          option: classes['filter-select-option'],
        }}
        data={[CATEGORY_TYPE_ALL, CATEGORY_TYPE_NEW, ...Object.keys(Category)]}
        onOptionSubmit={categories => router.push(`?categories=${categories}`)}
        placeholder="Filter by category"
        size="xs"
      />
    </>
  )
}
