import Head from 'next/head'
import classname from 'classnames'
import Layout from '@/layouts'
import { useState } from 'react'
import { Filter, HandpickedProject, PersonalizedProject, Spinner } from '@/components'
import { ResponseBase } from '@/types/response'
import useSWR from 'swr'
import request from '@/utils/request'
import { PersonalizedProjectType } from '@/types/project'

type TabItemProps = {
  title: string
  active: boolean
  onClick: () => void
}

const TabItem = ({ title, active, onClick }: TabItemProps) => {
  return (
    <div
      className={classname([
        'text-2xl font-bold transition cursor-pointer hover:text-[var(--primary-color)]',
        active ? '' : 'text-[var(--primary-text-color--disabled)]',
      ])}
      onClick={onClick}
    >
      {title}
    </div>
  )
}

const ForYou = () => {
  const { data, isLoading, error } = useSWR<ResponseBase<PersonalizedProjectType[]>>('projects', () =>
    request({
      url: '/api/projects',
      method: 'GET',
    })
  )

  const [filters, setFilters] = useState([
    {
      label: 'Airdrop',
      selected: false,
    },
    {
      label: 'Allowlist',
      selected: false,
    },
    {
      label: 'Events',
      selected: false,
    },
    {
      label: 'Governance vote',
      selected: false,
    },
    {
      label: 'Mint',
      selected: false,
    },
    {
      label: 'News',
      selected: false,
    },
  ])

  const onChange = (filterIndex: number) => {
    const newFilters = filters.map((filter, index) => {
      if (index === filterIndex) {
        return {
          ...filter,
          selected: !filter.selected,
        }
      }
      return filter
    })
    setFilters(newFilters)
  }

  const onClear = () => {
    const newFilters = filters.map(filter => ({
      ...filter,
      selected: false,
    }))
    setFilters(newFilters)
  }

  if (error) {
    return <p className="text-2xl">Oops, something went wrong</p>
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div className="grid gap-6 flex-1 min-w-[38rem]">
        {data?.data?.map(project => (
          <PersonalizedProject
            key={project.id}
            {...project}
          />
        ))}
      </div>
      <div className="p-10 border border-[#D9D9D9] rounded-3xl min-w-[27rem]">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-2xl text-[#222325] font-bold">Filters</p>
          <button
            className="text-[#B8B9B9] text-sm font-bold"
            onClick={onClear}
          >
            Clear
          </button>
        </div>
        <Filter
          title={'Project type'}
          filters={filters}
          onChange={onChange}
        />
      </div>
    </>
  )
}

const AllProjects = () => {
  return (
    <>
      <div className="grid gap-6 flex-1 min-w-[38rem]">
        <div>
          <h2 className="text-[2rem] leading-[2.6875rem] font-bold mb-4">Handpicked for you</h2>
          <div className="grid gap-6 flex-1">
            <HandpickedProject />
            <HandpickedProject />
          </div>
        </div>
      </div>
      <div className="p-10 border border-[#D9D9D9] rounded-3xl w-[27rem]">
        <p className="mb-4 font-bold text-2xl">Make your feed better</p>
        <p className="mb-8">Personalise and get a smarter feed when you tell us more about what you’d like to see</p>
        <svg
          width="139"
          height="112"
          viewBox="0 0 139 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto block"
        >
          <path
            d="M88.7704 42.0114C71.2809 36.2713 53.0661 38.7994 38.3533 47.4406C45.1087 63.1066 58.3088 75.9129 75.7983 81.653C93.2879 87.3931 111.503 84.8649 126.215 76.2237C119.439 60.5577 106.26 47.7307 88.7704 42.0114Z"
            fill="#F0F3FB"
            stroke="#231F20"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M79.6114 57.2164C62.1218 51.4764 43.907 54.0045 29.1942 62.6457C35.9497 78.3117 49.1497 91.118 66.6393 96.8581C84.1288 102.598 102.344 100.07 117.056 91.4288C110.28 75.7628 97.1009 62.9358 79.6114 57.2164Z"
            fill="#F0F3FB"
            stroke="#231F20"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M110.475 9.61444C110.534 9.03465 111.381 9.03465 111.44 9.61444C111.869 13.7941 115.179 17.1031 119.36 17.5213C119.939 17.5791 119.939 18.4223 119.36 18.4802C115.179 18.8983 111.869 22.2074 111.44 26.387C111.381 26.9668 110.534 26.9668 110.475 26.387C110.047 22.2074 106.736 18.8983 102.555 18.4802C101.976 18.4223 101.976 17.5791 102.555 17.5213C106.736 17.1031 110.047 13.7941 110.475 9.61444Z"
            fill="white"
            stroke="black"
          />
          <path
            d="M11.0129 28.1466C11.0159 28.1179 11.0225 28.1025 11.0262 28.0956C11.0299 28.0886 11.034 28.0839 11.039 28.0798C11.0504 28.0705 11.0753 28.0585 11.1116 28.0585C11.1478 28.0585 11.1727 28.0705 11.1841 28.0798C11.1891 28.0839 11.1932 28.0886 11.197 28.0956C11.2006 28.1025 11.2073 28.1179 11.2102 28.1466C11.4817 30.7752 13.5656 32.8581 16.1968 33.1191C16.2256 33.122 16.2408 33.1285 16.2475 33.1321C16.2543 33.1357 16.2588 33.1396 16.2626 33.1442C16.2714 33.155 16.2832 33.179 16.2832 33.2145C16.2832 33.25 16.2714 33.2741 16.2626 33.2848C16.2588 33.2895 16.2543 33.2934 16.2475 33.297C16.2408 33.3005 16.2256 33.3071 16.1968 33.3099C13.5656 33.5709 11.4817 35.6539 11.2102 38.2824C11.2073 38.3112 11.2006 38.3265 11.197 38.3334C11.1932 38.3404 11.1891 38.3452 11.1841 38.3492C11.1727 38.3586 11.1478 38.3706 11.1116 38.3706C11.0753 38.3706 11.0504 38.3586 11.039 38.3492C11.034 38.3452 11.0299 38.3404 11.0262 38.3334C11.0225 38.3265 11.0159 38.3112 11.0129 38.2824C10.7414 35.6539 8.65754 33.5709 6.02628 33.3099C5.99753 33.3071 5.9823 33.3005 5.97561 33.297C5.96882 33.2934 5.96434 33.2895 5.96051 33.2848C5.95169 33.2741 5.9399 33.25 5.9399 33.2145C5.9399 33.179 5.95169 33.155 5.96051 33.1442C5.96434 33.1396 5.96882 33.1357 5.97561 33.1321C5.9823 33.1285 5.99753 33.122 6.02628 33.1191C8.65754 32.8581 10.7414 30.7752 11.0129 28.1466Z"
            fill="white"
            stroke="black"
          />
          <path
            d="M127.79 95.694C127.793 95.6653 127.799 95.6499 127.803 95.643C127.807 95.636 127.811 95.6313 127.816 95.6272C127.827 95.6179 127.852 95.6059 127.888 95.6059C127.925 95.6059 127.95 95.6179 127.961 95.6272C127.966 95.6313 127.97 95.636 127.974 95.643C127.977 95.6499 127.984 95.6653 127.987 95.694C128.259 98.3225 130.342 100.405 132.974 100.667C133.002 100.669 133.018 100.676 133.024 100.679C133.031 100.683 133.036 100.687 133.039 100.692C133.048 100.702 133.06 100.726 133.06 100.762C133.06 100.797 133.048 100.821 133.039 100.832C133.036 100.837 133.031 100.841 133.024 100.844C133.018 100.848 133.002 100.854 132.974 100.857C130.342 101.118 128.259 103.201 127.987 105.83C127.984 105.859 127.977 105.874 127.974 105.881C127.97 105.888 127.966 105.893 127.961 105.897C127.95 105.906 127.925 105.918 127.888 105.918C127.852 105.918 127.827 105.906 127.816 105.897C127.811 105.893 127.807 105.888 127.803 105.881C127.799 105.874 127.793 105.859 127.79 105.83C127.518 103.201 125.434 101.118 122.803 100.857C122.774 100.854 122.759 100.848 122.752 100.844C122.746 100.841 122.741 100.837 122.737 100.832C122.729 100.821 122.717 100.797 122.717 100.762C122.717 100.726 122.729 100.702 122.737 100.692C122.741 100.687 122.746 100.683 122.752 100.679C122.759 100.676 122.774 100.669 122.803 100.667C125.434 100.405 127.518 98.3225 127.79 95.694Z"
            fill="white"
            stroke="black"
          />
          <path
            d="M82.879 52.3151C65.3894 46.575 47.1746 49.1031 32.4618 57.7443C39.2172 73.4103 52.4173 86.2167 69.9069 91.9567C87.3964 97.6968 105.611 95.1686 120.324 86.5274C113.548 70.8614 100.369 58.0344 82.879 52.3151Z"
            fill="#F0F3FB"
            stroke="#231F20"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M86.7966 47.1632C69.307 41.4232 51.0922 43.9513 36.3794 52.5924C43.1348 68.2584 56.3349 81.0648 73.8245 86.8049C91.314 92.5449 109.529 90.0168 124.242 81.3756C117.465 65.7096 104.286 52.8826 86.7966 47.1632Z"
            fill="white"
            stroke="#231F20"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M81.8647 67.4917L88.7445 67.243L92.2051 67.1187C93.78 58.9126 91.2726 51.5148 85.947 49.7742C79.8754 47.7848 72.4154 53.8771 69.307 63.3886C66.1987 72.9002 68.6025 82.2044 74.6741 84.1938C79.9997 85.9344 86.3822 81.4584 89.9878 73.9156L87.2525 71.7604L81.8647 67.4917Z"
            fill="#231F20"
          />
        </svg>
        <button className="py-3 px-12 border border-black rounded-3xl font-semibold w-full mt-9">Personalize your feed</button>
      </div>
    </>
  )
}

const Discover = () => {
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <>
      <Head>
        <title>Morphis Network - Discover</title>
        <meta
          name="description"
          content="morphis network discover"
        />
      </Head>
      <Layout>
        <div className="flex gap-6 items-center mb-14">
          <TabItem
            title="For you"
            active={currentTab === 0}
            onClick={() => setCurrentTab(0)}
          />
          <TabItem
            title="All projects"
            active={currentTab === 1}
            onClick={() => setCurrentTab(1)}
          />
        </div>
        <div className="flex gap-12 items-start pb-8">
          {currentTab === 0 && <ForYou />}
          {currentTab === 1 && <AllProjects />}
        </div>
      </Layout>
    </>
  )
}

export default Discover
