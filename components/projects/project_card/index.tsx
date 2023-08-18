import { Card, AspectRatio, Image, Box, Title, Text, Badge, ActionIcon } from '@mantine/core'

import classes from './styles.module.css'

import type { Project } from '@prisma/client'

export default function ProjectCard({ name, bannerImage, logoUrl, description, categories, website, discord, twitter }: Project) {
  return (
    <Card
      className={classes.card}
      withBorder
    >
      <Card.Section className={classes['card-section']}>
        <AspectRatio ratio={3 / 2}>
          <Image
            alt="banner"
            className={classes.banner}
            src={bannerImage}
          />
        </AspectRatio>
      </Card.Section>
      <Box className={classes.content}>
        <Box className={classes['name-row']}>
          <Image
            alt="project-logo"
            className={classes.logo}
            src={logoUrl}
          />
          <Title
            className={classes.name}
            order={4}
          >
            {name}
          </Title>
        </Box>
        <Text
          className={classes.description}
          lineClamp={4}
        >
          {description}
        </Text>
        <Box className={classes['category-row']}>
          {categories.map(_c => (
            <Badge
              className={classes.badge}
              color="rgba(0, 0, 0, 1)"
              key={_c}
              radius="sm"
            >
              {_c}
            </Badge>
          ))}
        </Box>
        <Box className={classes['link-row']}>
          {website && (
            <a
              href={website}
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
          {discord && (
            <a
              href={discord}
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
          {twitter && (
            <a
              href={twitter}
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
        </Box>
      </Box>
    </Card>
  )
}
