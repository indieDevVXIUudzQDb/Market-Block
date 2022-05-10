import React from 'react'

import { Button, Card, Group, Image, Title } from '@mantine/core'
import Link from 'next/link'
import { textShortener } from '../utils/utils'

interface Props {
  id: string
  linkTo: string
  image: string
  title: string
  description: string
}

export const MarketItemCard = (props: Props) => {
  const { image, title, description, linkTo } = props
  return (
    <div style={{}}>
      <Card shadow="sm" p="lg">
        <Card.Section>
          <div style={{ textAlign: 'center' }}>
            <Image
              src={image}
              height={160}
              alt={props.title}
              fit="contain"
              withPlaceholder
              placeholder={
                <Image
                  src={`logoipsum-logo-35.svg`}
                  height={160}
                  alt="Block Logo"
                  fit="contain"
                />
              }
            />
          </div>
        </Card.Section>

        <Group position="apart" style={{ marginBottom: 5 }}>
          <Title align={'center'} order={3}>
            {title}
          </Title>
        </Group>
        {textShortener(description, 200)}
        <Link href={linkTo}>
          <Group position="apart" style={{ marginBottom: 5 }}>
            <Button
              variant="outline"
              color="blue"
              fullWidth
              style={{ marginTop: 14 }}
            >
              View
            </Button>
          </Group>
        </Link>
      </Card>
    </div>
  )
}
