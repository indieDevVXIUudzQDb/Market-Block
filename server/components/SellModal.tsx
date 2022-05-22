import { Button, Group, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import { DigitalItem, MarketItem } from '../pages/item/[...slug]'

interface Props {
  opened: boolean
  setOpened: (o: boolean) => void
  item: DigitalItem
  onConfirmClick: (item: DigitalItem, price: string, amount: string) => void
}
export function SellModal(props: Props) {
  const { item, opened, setOpened, onConfirmClick } = props
  const form = useForm({
    initialValues: {
      amount: 1,
      price: 0,
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
          if (values.price) {
            onConfirmClick(
              item,
              values.price.toString(),
              values.amount.toString()
            )
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
            {...form.getInputProps('price')}
          />
        </Group>
        <Group grow={true} className={'p-2'}>
          <TextInput
            required={true}
            label="Quantity"
            type={'number'}
            placeholder={'1'}
            min={1}
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
