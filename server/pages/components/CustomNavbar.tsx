import { Group, Navbar, ThemeIcon, UnstyledButton, Text } from '@mantine/core'
import { Home } from 'tabler-icons-react'

interface MainLinkProps {
  icon: React.ReactNode
  color: string
  label: string
}

function MainLink({ icon, color, label }: MainLinkProps) {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: 'white',

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        {icon}
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  )
}

export const CustomNavbar = () => {
  return (
    <Navbar width={{ base: 300 }} height={500} p="xs">
      <MainLink icon={<Home />} color={'blue'} label={'Home'} />
    </Navbar>
  )
}
