'use client'

'use client'

import Link from 'next/link'
import { AppShell, Box, LoadingOverlay, Title, Button, Image, Badge, ActionIcon, Menu, Text, Divider } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import dayjs from 'dayjs'

import Footer from 'components/footer'
import RelativeProjects from './relative_projects'

import classes from './styles.module.css'

import type { Project } from '@prisma/client'

export default function SlugMain({ slug }: { slug: string }) {
  const largeScreen = useMediaQuery('(min-width: 48em)')

  const {
    data: project,
    isLoading,
    isFetched,
  } = useQuery<Project>({
    enabled: !!slug,
    queryKey: ['project-detail'],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${slug}`)
      const projects = await res.json()
      return projects
    },
  })

  return (
    <AppShell.Main className={classes.main}>
      <LoadingOverlay
        overlayProps={{ backgroundOpacity: 0 }}
        visible={isLoading}
      />
      {isFetched && !project && (
        <Box className={classes['project-not-found-container']}>
          <Title order={3}>Project not found</Title>
          <Link href="/projects#list">
            <Button
              color="rgba(0, 0, 0, 1)"
              variant="filled"
            >
              Back to projects list
            </Button>
          </Link>
        </Box>
      )}
      {project && (
        <>
          <Box className={classes['banner-container']}>
            <Image
              alt="banner"
              className={classes.banner}
              src={project.bannerImage}
            />
            <Link
              className={classes['back-button-container']}
              href="/projects#list"
            >
              <Button
                className={classes['back-button']}
                leftSection={<i className="fa-solid fa-arrow-left" />}
              >
                Back to projects
              </Button>
            </Link>
            <Box className={classes['logo-container']}>
              <Image
                alt="logo"
                className={classes.logo}
                src={project.logoUrl}
              />
            </Box>
          </Box>
          <Box className={classes['container']}>
            <Box className={classes['name-row']}>
              <Box className={classes['name-group']}>
                <Title order={3}>{project.name}</Title>
                <Badge
                  className={classes.stage}
                  variant="filled"
                >
                  {project.projectStage}
                </Badge>
              </Box>
              <Box className={classes['link-group']}>
                {project.website && (
                  <a
                    href={project.website}
                    onClick={e => e.stopPropagation()}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ActionIcon
                      className={classes.icon}
                      size="sm"
                      variant="transparent"
                    >
                      <i className="fa-solid fa-globe" />
                    </ActionIcon>
                  </a>
                )}
                {project.discord && (
                  <a
                    href={project.discord}
                    onClick={e => e.stopPropagation()}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ActionIcon
                      className={classes.icon}
                      size="sm"
                      variant="transparent"
                    >
                      <i className="fa-brands fa-discord" />
                    </ActionIcon>
                  </a>
                )}
                {project.twitter && (
                  <a
                    href={project.twitter}
                    onClick={e => e.stopPropagation()}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ActionIcon
                      className={classes.icon}
                      size="sm"
                      variant="transparent"
                    >
                      <i className="fa-brands fa-x-twitter" />
                    </ActionIcon>
                  </a>
                )}
                <ActionIcon
                  className={classes.icon}
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(
                        `${project.name} | ${project.blockchains.join(' ')}`
                      )}`
                    )
                  }
                  size="sm"
                  variant="transparent"
                >
                  <i className="fa-solid fa-share-nodes" />
                </ActionIcon>
                <Menu
                  classNames={{ dropdown: classes['menu-dropdown'], item: classes['menu-item'] }}
                  shadow="md"
                >
                  <Menu.Target>
                    <ActionIcon
                      className={classes.icon}
                      size="sm"
                      variant="transparent"
                    >
                      <i className="fa-solid fa-ellipsis" />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<i className="fa-solid fa-copy" />}>Copy link</Menu.Item>
                    <Menu.Divider className={classes.divider} />
                    <Menu.Item
                      className={classes['menu-item-warning']}
                      leftSection={<i className="fa-solid fa-triangle-exclamation" />}
                      onClick={() =>
                        window.open(
                          `https://docs.google.com/forms/d/e/1FAIpQLSedEm56AAsrkssUTGF2pALbbHzoxiFgwJNrWW0h5uws4hYAxA/viewform?entry.1073118097=${project.id}`
                        )
                      }
                    >
                      Report
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Box>
            </Box>
            <Box className={classes['info-row']}>
              <Box className={classes.info}>
                <Text className={classes.label}>By</Text>
                <Text className={classes.text}>-</Text>
              </Box>
              <Box className={classes.info}>
                <Text className={classes.label}>Added</Text>
                <Text className={classes.text}>{dayjs(project.createdAt).format('MMM YYYY')}</Text>
              </Box>
            </Box>
            <Box className={classes['chain-row']}>
              <Box className={classes.info}>
                <Text className={classes.label}>Built on:</Text>
                <Badge
                  color="rgba(0, 0, 0, 1)"
                  radius="sm"
                >
                  {project.blockchains}
                </Badge>
              </Box>
              <Box className={classes.info}>
                <Text className={classes.label}>Categories:</Text>
                {project.categories.map(_c => (
                  <Badge
                    color="rgba(0, 0, 0, 1)"
                    key={_c}
                    radius="sm"
                  >
                    {_c}
                  </Badge>
                ))}
              </Box>
            </Box>
            <Box className={classes['project-details']}>
              <Title order={5}>Project Details</Title>
              <Divider color="rgba(0, 0, 0, 1)" />
              <Text className={classes.desc}>{project.description}</Text>
            </Box>
            {!!project?.previewImages.length && (
              <Box className={classes['swiper-container']}>
                <Swiper
                  className={classes.swiper}
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  slidesPerView={largeScreen ? 2 : 1}
                  spaceBetween={24}
                >
                  {project.previewImages.map(_pi => (
                    <SwiperSlide key={_pi}>
                      <Image
                        className={classes['preview-image']}
                        alt="preview img"
                        src={_pi}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            )}
            <Divider color="rgba(0, 0, 0, 1)" />
            <Title
              className={classes['recommendation-title']}
              order={3}
            >
              You may also like this
            </Title>
            <RelativeProjects slug={slug} />
            <Footer />
          </Box>
        </>
      )}
    </AppShell.Main>
  )
}
