import { Button, Group, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import { DigitalItem, MarketItem } from '../pages/item/[...slug]'

interface Props {
  opened: boolean
  setOpened: (o: boolean) => void
  item: MarketItem
  onConfirmClick: (item: MarketItem, amount: string) => void
}
export function CancelListingModal(props: Props) {
  const { item, opened, setOpened, onConfirmClick } = props
  const form = useForm({
    initialValues: {
      amount: 1,
    },
  })
  return (
    <Modal
      opened={opened}
      centered={true}
      onClose={() => setOpened(false)}
      title="Cancel Market Listing"
    >
      <form
        onSubmit={form.onSubmit((values) => {
          if (values.amount) {
            onConfirmClick(item, values.amount.toString())
            setOpened(false)
          }
        })}
      >
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
            <Button type="submit">Submit</Button>
          </Group>
        </Group>
      </form>
    </Modal>
  )
}
