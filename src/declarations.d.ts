// These declarations make it possible to import assets in your TypeScript code. Vite will pick up these imports and add them to your build.

declare module '*.png' {
	const value: string;
	export default value;
}

declare module '*.jpg' {
	const value: string;
	export default value;
}

declare module '*.jpeg' {
	const value: string;
	export default value;
}

declare module '*.svg' {
	const value: string;
	export default value;
}
