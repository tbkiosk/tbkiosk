import { Card, AspectRatio, Image, Box, Title, Text } from '@mantine/core'

import classes from './styles.module.css'

import type { Project } from '@prisma/client'

export default function ProjectCard({ name, bannerImage, logoUrl, description }: Project) {
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
      </Box>
    </Card>
  )
}
