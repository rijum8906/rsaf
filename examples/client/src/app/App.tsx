import { useState, type ReactNode } from 'react';

export function App(): ReactNode {
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
