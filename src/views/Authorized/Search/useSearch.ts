import {
  createEffect, createEvent, createStore, sample,
} from 'effector'
import { useStore } from 'effector-react'
import { search } from '../../../api/methods/search'
import { User } from '../../../types/user'

const searchEvent = createEvent<string>()
const searchFx = createEffect(search)

const $data = createStore<User[]>([])
  .on(searchFx.doneData, (_, payload) => payload ?? [])

sample({
  clock: searchEvent,
  target: searchFx,
})

export function useSearch() {
  const data = useStore($data)
  const isLoading = useStore(searchFx.pending)

  return {
    data,
    search: searchEvent,
    isLoading,
  }
}
