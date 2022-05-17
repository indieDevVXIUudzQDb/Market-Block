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
import { useRouter } from 'next/router'

interface MainLinkProps {
  icon: React.ReactNode
  color: string
  label: string
  to: string
  active: boolean
}

function MainLink({ icon, color, label, to, active }: MainLinkProps) {
  return (
    <Link href={to}>
      <Button
        variant="subtle"
        color={color}
        className={active ? 'font-extrabold text-blue-400' : ''}
      >
        <Group>
          {icon}
          <Text size="sm">{label}</Text>
        </Group>
      </Button>
    </Link>
  )
}

export const NavLinks = (props: { address: string }) => {
  const router = useRouter()
  return (
    <>
      <MainLink
        label={'Browse'}
        icon={<Browser />}
        to={'/'}
        color={'blue'}
        active={router.pathname === '/'}
      />
      <MainLink
        label={'My Digital Assets'}
        icon={<BrowserCheck />}
        to={`/my-assets?address=${props.address}`}
        color={'blue'}
        active={router.pathname === '/my-assets'}
      />
      <MainLink
        label={'Create Digital Asset'}
        icon={<BrowserPlus />}
        to={'/create-item'}
        color={'blue'}
        active={router.pathname === '/create-item'}
      />
    </>
  )
}
