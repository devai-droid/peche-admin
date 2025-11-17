import {
  CreateEventDtoLabelItem,
  Event,
  EventBackup,
  EventBundle,
  EventCategory,
  EventCategoryList,
  PaginationMeta,
} from "../orval/model"

export interface ExtendedEvent extends Omit<Event, "label"> {
  visible: boolean
  visibleEN: boolean
  visibleZH: boolean
  visibleZHTW: boolean
  visibleJA: boolean
  visibleTH: boolean
  detailPageId?: string
  integratedCrmCategoryId?: string
  label?: CreateEventDtoLabelItem[]
  bundle: EventBundle
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ExtendedEventBackup extends Omit<EventBackup, "label"> {
  visible: boolean
  visibleEN: boolean
  visibleZH: boolean
  visibleZHTW: boolean
  visibleJA: boolean
  visibleTH: boolean
  detailPageId?: string
  integratedCrmCategoryId?: string
  label?: CreateEventDtoLabelItem[]
  bundle: EventBundle
  discountPrice?: number
}

export interface ExtendedEventCategory extends Omit<EventCategory, "dayOfWeek"> {
  endDate: string
  endHour: number
  endMinute: number
  startDate: string
  startHour: number
  startMinute: number
  dayOfWeek: number[]
}

export interface ExtendedEventCategoryList extends Omit<EventCategoryList, "items"> {
  meta: PaginationMeta
  items: ExtendedEventCategory[]
}
