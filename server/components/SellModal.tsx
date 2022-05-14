import { Button, Group, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import { DigitalItem, MarketItem } from '../pages/item/[id]'

interface Props {
  opened: boolean
  setOpened: (o: boolean) => void
  item: DigitalItem | MarketItem
  onSellClick: (item: DigitalItem | MarketItem, amount: string) => void
}
export function SellModal(props: Props) {
  const { item, opened, setOpened, onSellClick } = props
  const form = useForm({
    initialValues: {
      amount: '',
    },
  })
  return (
    <Modal
      opened={opened}
      centered={true}
      onClose={() => setOpened(false)}
      title="Sell Item"
    >
      <form
        onSubmit={form.onSubmit((values) => {
          if (values.amount) {
            onSellClick(item, values.amount)
            setOpened(false)
          }
        })}
      >
        <Group grow={true} className={'p-2'}>
          <TextInput
            required={true}
            label="Price"
            type={'number'}
            placeholder={'100'}
            {...form.getInputProps('amount')}
          />
        </Group>
        <Group position="center" className={'pt-2'}>
          <Group position="right" mt="md">
            <Button type="submit">Sell</Button>
          </Group>
        </Group>
      </form>
    </Modal>
  )
}
