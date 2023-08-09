import { useRouter } from 'next/router'
import { Card, AspectRatio, Image, Flex, Title, Group, Text, ActionIcon, Badge, rem } from '@mantine/core'

import type { Project } from '@prisma/client'

type ProjectCardProp = {
  replace?: boolean
} & Project

const ProjectCard = ({ id, name, logoUrl, bannerImage, description, categories, website, twitter, discord, replace }: ProjectCardProp) => {
  const router = useRouter()

  return (
    <Card
      display="flex"
      onClick={() => (replace ? router.replace(`/discover/${id}`) : router.push(`/discover/${id}`))}
      padding="sm"
      radius="md"
      sx={{
        cursor: 'pointer',
        flexDirection: 'column',
        transition: 'box-shadow 0.4s ease',
        '&:hover': {
          boxShadow: '0px 4px 20px 0px rgba(141, 141, 141, 0.31)',
        },
      }}
      withBorder
    >
      <Card.Section>
        <AspectRatio ratio={1}>
          <Image
            alt="bg"
            height="100%"
            src={bannerImage}
            styles={{
              figure: {
                height: '100%',
              },
              imageWrapper: {
                height: '100%',
              },
            }}
            width="100%"
            withPlaceholder
          />
        </AspectRatio>
      </Card.Section>
      <Flex
        direction="column"
        gap="xs"
        mt="lg"
        style={{ flex: 1 }}
      >
        <Group
          noWrap
          spacing="md"
        >
          <Image
            alt="bg"
            fit="cover"
            height={rem(40)}
            radius={rem(14)}
            src={logoUrl}
            width={rem(40)}
            withPlaceholder
          />
          <Title
            order={4}
            truncate
          >
            {name}
          </Title>
        </Group>
        <Text
          h={84}
          lh={1.5}
          lineClamp={4}
          mah={84}
          size="sm"
        >
          {description}
        </Text>
        <Group spacing="xs">
          {categories.map(_category => (
            <Badge
              color="dark"
              key={_category}
              size="xs"
              radius="sm"
              variant="filled"
            >
              {_category}
            </Badge>
          ))}
        </Group>
        <Flex
          align="flex-end"
          justify="flex-end"
          style={{ flex: 1 }}
        >
          <Group>
            {website && (
              <a
                href={website}
                onClick={e => e.stopPropagation()}
                rel="noreferrer"
                target="_blank"
              >
                <ActionIcon
                  size="sm"
                  sx={{
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  variant="transparent"
                >
                  <i
                    className="fa-solid fa-globe"
                    style={{ color: '#fd222a' }}
                  />
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
                  size="sm"
                  sx={{
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  variant="transparent"
                >
                  <i
                    className="fa-brands fa-x-twitter"
                    style={{ color: '#fd222a' }}
                  />
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
                  size="sm"
                  sx={{
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  variant="transparent"
                >
                  <i
                    className="fa-brands fa-discord"
                    style={{ color: '#fd222a' }}
                  />
                </ActionIcon>
              </a>
            )}
          </Group>
        </Flex>
      </Flex>
    </Card>
  )
}

export default ProjectCard
