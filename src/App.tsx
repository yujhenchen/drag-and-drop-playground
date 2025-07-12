import "./App.css";
import { MultipleSortableDragAndDrop } from "./multipleSortableDragAndDrop";

function App() {
	return (
		<>
			<h1 className="text-3xl text-blue-500">Drag and Drop</h1>
			<div className="flex space-x-16">
				<MultipleSortableDragAndDrop />
			</div>
		</>
	);
}

export default App;
