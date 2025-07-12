import './App.css'
import { DragAndDropMultiple } from './dragAndDropMultiple'
import { SortableDragAndDrop } from './sortableDragAndDrop'
import { SortableDragAndDropMultiple } from './sortableDragAndDropMultiple'


function App() {

  return (
    <>
      <h1 className='text-3xl text-blue-500'>Drag and Drop
      </h1>
      <div className='flex space-x-16'>
        <SortableDragAndDrop />
        <SortableDragAndDropMultiple />
        <DragAndDropMultiple />
      </div>
    </>
  )
}

export default App
