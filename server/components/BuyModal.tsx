import { Button, Group, Modal, TextInput, Text } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import { DigitalItem, MarketItem } from '../pages/item/[...slug]'
import { useRef } from 'react'
import { CURRENCY_NAME } from '../utils/constants/constants'

interface Props {
  opened: boolean
  setOpened: (o: boolean) => void
  item: MarketItem
  onConfirmClick: (item: MarketItem, amount: string) => void
}
export function BuyModal(props: Props) {
  const { item, opened, setOpened, onConfirmClick } = props
  const amountRef = useRef<HTMLInputElement>()

  const form = useForm({
    initialValues: {
      amount: null,
    },
  })

  return (
    <Modal
      opened={opened}
      centered={true}
      onClose={() => setOpened(false)}
      title="Buy Item"
    >
      <form
        onSubmit={form.onSubmit((values) => {
          if (values.amount) {
            // @ts-ignore
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
            min={1}
            max={item.amountAvailable}
            //@ts-ignore
            ref={amountRef}
            {...form.getInputProps('amount')}
          />
        </Group>
        <Group grow={true} className={'p-2'}>
          <Text>
            {item.price && amountRef.current?.value ? (
              <>
                <b>Total:</b> &nbsp;{' '}
                {
                  //@ts-ignore
                  item.price * amountRef.current?.value
                }{' '}
                {CURRENCY_NAME}
              </>
            ) : null}
          </Text>
        </Group>
        <Group position="center" className={'pt-2'}>
          <Group position="right" mt="md">
            <Button type="submit">Buy</Button>
          </Group>
        </Group>
      </form>
    </Modal>
  )
}
