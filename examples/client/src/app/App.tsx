import { useState } from 'react';
import './App.css';

// eslint-disable-next-line
export function App() {
	const [count, setCount] = useState<number>(0);
	return (
		<>
			<h1>Test React App</h1>
			<h2>{count}</h2>
			<button onClick={() => setCount(count + 1)}>+</button>
			<button onClick={() => setCount(count - 1)}>-</button>
		</>
	);
}
