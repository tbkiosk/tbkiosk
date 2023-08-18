'use client'

import Link from 'next/link'
import { AppShell, Box, LoadingOverlay, Title, Button, Image, Badge, ActionIcon, Menu } from '@mantine/core'

import Footer from 'components/footer'

import useProject from 'hooks/use_project'

import classes from './styles.module.css'

type SlugMainProps = {
  slug: string
}

export default function SlugMain({ slug }: SlugMainProps) {
  const { project, loading } = useProject(slug)

  return (
    <AppShell.Main className={classes.main}>
      <LoadingOverlay
        overlayProps={{ backgroundOpacity: 0 }}
        visible={loading}
      />
      {!project && !loading && (
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
      {project && !loading && (
        <>
          <Box className={classes['banner-container']}>
            <Image
              alt="banner"
              className={classes.banner}
              src={project.bannerImage}
            />
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
                  color="yellow.3"
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
            <Footer />
          </Box>
        </>
      )}
    </AppShell.Main>
  )
}
