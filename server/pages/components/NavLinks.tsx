import {
  Group,
  Navbar,
  ThemeIcon,
  UnstyledButton,
  Text,
  Anchor,
  Button,
  Card,
} from '@mantine/core'
import {
  Home,
  Package,
  Plus,
  PackgeImport,
  Browser,
  BrowserPlus,
  BrowserCheck,
} from 'tabler-icons-react'
import Link from 'next/link'
import { AddXyz } from '@3rdweb/chain-icons'

interface MainLinkProps {
  icon: React.ReactNode
  color: string
  label: string
  to: string
}

function MainLink({ icon, color, label, to }: MainLinkProps) {
  return (
    <Link href={to}>
      {/*<UnstyledButton*/}
      {/*  sx={(theme) => ({*/}
      {/*    display: 'block',*/}
      {/*    width: '100%',*/}
      {/*    padding: theme.spacing.xs,*/}
      {/*    borderRadius: theme.radius.sm,*/}
      {/*    color: 'white',*/}

      {/*    '&:hover': {*/}
      {/*      backgroundColor:*/}
      {/*        theme.colorScheme === 'dark'*/}
      {/*          ? theme.colors.dark[6]*/}
      {/*          : theme.colors.gray[0],*/}
      {/*    },*/}
      {/*  })}*/}
      {/*>*/}
      <Button variant="subtle" color={color}>
        <Group>
          {icon}
          <Text size="sm">{label}</Text>
        </Group>
      </Button>
      {/*</UnstyledButton>*/}
    </Link>
  )
}

export const NavLinks = () => {
  return (
    <>
      <MainLink label={'Browse'} icon={<Browser />} to={'/'} color={'blue'} />
      <MainLink
        label={'My Digital Assets'}
        icon={<BrowserCheck />}
        to={'/'}
        color={'blue'}
      />
      <MainLink
        label={'Sell Digital Asset'}
        icon={<BrowserPlus />}
        to={'/create-item'}
        color={'blue'}
      />
    </>
  )
}
