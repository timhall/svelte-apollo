import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import filesize from "rollup-plugin-filesize";

const external = ["graphql", "@apollo/client/core", "svelte", "svelte/store"];

export default [
	{
		input: "src/index.ts",
		external,
		output: [
			{
				file: "dist/svelte-apollo.js",
				format: "es",
				sourcemap: true,
			},
		],
		plugins: [typescript(), filesize()],
	},
	{
		input: "src/index.ts",
		external,
		output: {
			file: "dist/svelte-apollo.d.ts",
			format: "es",
		},
		plugins: [dts()],
	},
];
