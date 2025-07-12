import {
	DndContext,
	closestCenter,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
	type DragMoveEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { useState } from "react";
import { Droppable } from "./Droppable";

type ItemType = {
	id: string;
	name: string;
};

const BOX_ID_PREFIX = "box-";
const BG_YELLOW_400 = "bg-yellow-400";

const defaultBoxItemMap: Record<string, Array<ItemType>> = {
	[`${BOX_ID_PREFIX}1`]: [
		{ id: "a1", name: "A 1" },
		{ id: "a2", name: "A 2" },
		{ id: "a3", name: "A 3" },
	],
	[`${BOX_ID_PREFIX}2`]: [{ id: "b1", name: "B 1" }],
	[`${BOX_ID_PREFIX}3`]: [
		{ id: "c1", name: "C 1" },
		{ id: "c2", name: "C 2" },
	],
};

export function SortableDragAndDropMultiple() {
	const [boxItemMap, setBoxItemMap] =
		useState<Record<string, Array<ItemType>>>(defaultBoxItemMap);
	const [activeId, setActiveId] = useState<string | null>(null);

	function handleDragStart(event: DragStartEvent) {
		const { active } = event;

		// NOTE: not need to show overlay when same parent container (this does not work, since DragStartEvent does not have over)
		// const activeId = active.id.toString();
		// const overId = over?.id.toString();

		// const keys = Object.keys(boxItemMap);
		// const sourceParentKey = keys.find(key => boxItemMap[key].find(item => item.id === activeId));
		// const targetParentKey = keys.find(key => boxItemMap[key].find(item => item.id === overId)) ?? overId;

		// // alert(`sourceParentKey: ${sourceParentKey}, targetParentKey: ${targetParentKey}`);
		// if (sourceParentKey === targetParentKey) {
		//   return;
		// }
		setActiveId(active.id.toString());
	}

	function handleDragMove(event: DragMoveEvent) {
		const { active, over } = event;
		console.log("handleDragMove", active.id, over?.id);

		// if (over) {
		//   const overElement = document.getElementById(over?.id.toString());
		//   if (overElement && !over.id.toString().includes(BOX_ID_PREFIX)) {
		//     overElement.className = overElement.className.includes(BG_YELLOW_400) ?
		//       overElement.className.replace(BG_YELLOW_400, "") : `${overElement.className} ${BG_YELLOW_400}`;

		//     console.log(overElement.className);
		//   }
		// }
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over) {
			return;
		}

		if (active.id === over.id) {
			return;
		}

		setActiveId(null);

		setBoxItemMap((preBoxItemMap) => {
			const activeId = active.id.toString();
			const overId = over.id.toString();

			const keys = Object.keys(preBoxItemMap);
			const sourceParentKey = keys.find((key) =>
				preBoxItemMap[key].find((item) => item.id === activeId)
			);
			const targetParentKey =
				keys.find((key) =>
					preBoxItemMap[key].find((item) => item.id === overId)
				) ?? overId;

			if (!sourceParentKey || !targetParentKey) {
				console.error(
					"missing source or target parent key",
					sourceParentKey,
					targetParentKey
				);
				return preBoxItemMap;
			}

			// ==========  handle same parent ==========
			const targetArray = structuredClone(preBoxItemMap[targetParentKey]);

			// === both are items ===
			if (sourceParentKey === targetParentKey) {
				const targetIndex = targetArray.findIndex(
					(item) => item.id === overId
				);
				const sourceIndex = targetArray.findIndex(
					(item) => item.id === activeId
				);

				// NOTE: using this swap get incorrect results, need to use built-in arrayMove
				// [targetArray[sourceIndex], targetArray[targetIndex]] = [targetArray[targetIndex], targetArray[sourceIndex]];

				return {
					...preBoxItemMap,
					[sourceParentKey]: arrayMove(
						targetArray,
						sourceIndex,
						targetIndex
					),
				};
			}

			// ========== handle different parents ==========
			const sourceItems = preBoxItemMap[sourceParentKey];
			const sourceItem = sourceItems.find((item) => item.id === activeId);

			if (!sourceItem) {
				console.error("missing source item with id: ", activeId);
				return preBoxItemMap;
			}

			// === target is droppable container ===
			if (overId.includes(BOX_ID_PREFIX)) {
				// push to the end
				targetArray.push(sourceItem);
			}
			// === target is item ===
			else {
				// move the source item below the target item in the target parent
				const targetIndex = targetArray.findIndex(
					(item) => item.id === overId
				);
				targetArray.splice(targetIndex + 1, 0, sourceItem);
			}

			return {
				...preBoxItemMap,
				[sourceParentKey]: sourceItems.filter(
					(item) => item.id !== activeId
				),
				[targetParentKey]: targetArray,
			};
		});
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	return (
		<section className="flex flex-col space-y-8">
			<h3>Sortable Multiple Columns Drag and Drop</h3>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragMove={handleDragMove}
				onDragEnd={handleDragEnd}
			>
				<div className="flex space-x-8">
					{Object.entries(boxItemMap).map(([boxId, items]) => (
						<Droppable
							id={boxId}
							key={boxId}
							className="flex flex-col space-y-8 w-48 border-4 border-gray-400 p-4"
						>
							<SortableContext
								key={boxId}
								id={boxId}
								items={items}
								strategy={verticalListSortingStrategy}
							>
								{items.map(({ id, name }) => (
									<SortableItem
										className="bg-yellow-200 hover:bg-yellow-400 w-36 h-24 text-black text-2xl"
										key={id}
										id={id}
									>
										{name}
									</SortableItem>
								))}
							</SortableContext>
						</Droppable>
					))}
				</div>
				{/* ===== DragOverlay ===== */}
				<DragOverlay>
					{activeId ? (
						<div className="bg-yellow-200 hover:bg-yellow-400 w-36 h-24 text-black text-2xl">{`overlay div ${activeId}`}</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</section>
	);
}
