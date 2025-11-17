import {
  useIntegratedCrmCategoryControllerBulkUpdate,
  useIntegratedCrmCategoryControllerFindMany,
} from "@/lib/orval/integrated-crm-categories/integrated-crm-categories"
import { Dehaze } from "@mui/icons-material"
import { Box, Paper, Typography } from "@mui/material"
import React, { CSSProperties, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import type { OnDragEndResponder, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd"

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }))

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const getItemStyle = (isDragging: boolean, draggableStyle?: CSSProperties): CSSProperties => ({
  background: isDragging ? "#eee" : "white",
  ...draggableStyle,
})

const CrmOrderManagement = () => {
  const [items, setItems] = React.useState(getItems(10))
  const { data: integrationCrm } = useIntegratedCrmCategoryControllerFindMany()
  const { mutate: updateIntegrationCrm } = useIntegratedCrmCategoryControllerBulkUpdate()

  useEffect(() => {
    if (integrationCrm) {
      setItems(integrationCrm.map((item) => ({ id: item.id, content: item.name })))
    }
  }, [integrationCrm])

  const backendApi = (
    newItems: {
      id: string
      content: string
    }[],
  ) => {
    updateIntegrationCrm({
      data: newItems.map((item, index) => ({
        id: item.id,
        order: index + 1,
      })),
    })
  }

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return
    }

    const newItems = reorder(items, result.source.index, result.destination.index)

    setItems(newItems)

    backendApi(newItems)
  }

  return (
    <Box tw="pb-8">
      <Typography variant="h2">대분류 우선순위 관리 (CRM 대분류 기준)</Typography>
      <Paper tw="mt-8">
        <Box tw="bg-[#eee] py-3" textAlign="center">
          <Typography tw="text-lg">대분류 우선순위</Typography>
        </Box>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided2, snapshot2) => (
                      <div
                        ref={provided2.innerRef}
                        {...provided2.draggableProps}
                        {...provided2.dragHandleProps}
                        tw="border-b border-[#eee] p-3 last:border-b-0"
                        style={getItemStyle(snapshot2.isDragging, provided2.draggableProps.style)}>
                        <div tw="flex justify-between items-center">
                          {item.content}
                          <Dehaze />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>
    </Box>
  )
}

export default CrmOrderManagement
