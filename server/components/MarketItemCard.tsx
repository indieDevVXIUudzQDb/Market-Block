import React from 'react'

import { Button, Card, Group, Image, Title } from '@mantine/core'
import Link from 'next/link'
import { textShortener } from '../utils/utils'
import { LOGO_URL } from '../utils/constants/constants'
import { DigitalItem } from '../pages/item/[...slug]'

interface Props {
  item: DigitalItem
}

export const MarketItemCard = (props: Props) => {
  const { item } = props
  const { image, name, description } = item

  return (
    <div style={{}}>
      <Card shadow="sm" p="lg">
        <Card.Section>
          <div style={{ textAlign: 'center' }}>
            <Image
              src={image}
              height={160}
              alt={name}
              fit="contain"
              withPlaceholder
              placeholder={
                <Image
                  src={LOGO_URL}
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
            {name}
          </Title>
        </Group>
        {textShortener(description, 200)}
        <Link href={`/item/${item.tokenId}`}>
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
