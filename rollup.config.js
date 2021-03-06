import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import commonjs from "@rollup/plugin-commonjs"
import svelte from "rollup-plugin-svelte"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import config from "sapper/config/rollup.js"
import pkg from "./package.json"
import autoPreprocess from "svelte-preprocess"
import typescript from "rollup-plugin-typescript2"

const mode = process.env.NODE_ENV
const dev = mode === "development"
const legacy = !!process.env.SAPPER_LEGACY_BUILD

const onwarn = (warning, onwarn) =>
    (warning.code === "CIRCULAR_DEPENDENCY" &&
        /[/\\]@sapper[/\\]/.test(warning.message)) ||
    onwarn(warning)

export default {
    client: {
        input: config.client.input().replace(/\.js$/, ".ts"),
        output: config.client.output(),
        plugins: [
            replace({
                "process.browser": true,
                "process.env.NODE_ENV": JSON.stringify(mode),
            }),
            svelte({
                preprocess: autoPreprocess(),
                dev,
                hydratable: true,
                emitCss: true,
            }),
            resolve({
                browser: true,
                dedupe: ["svelte"],
            }),
            commonjs(),
            typescript(),

            legacy &&
                babel({
                    extensions: [".js", ".mjs", ".html", ".svelte"],
                    babelHelpers: "runtime",
                    exclude: [
                        "node_modules/@babel/**",
                        "node_modules/core-js/**",
                    ],
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                targets: {
                                    ie: "11",
                                },
                                useBuiltIns: "usage",
                                corejs: 3,
                            },
                        ],
                    ],
                    plugins: [
                        "@babel/plugin-syntax-dynamic-import",
                        [
                            "@babel/plugin-transform-runtime",
                            {
                                useESModules: true,
                            },
                        ],
                    ],
                }),

            !dev &&
                terser({
                    module: true,
                }),
        ],

        preserveEntrySignatures: false,
        onwarn,
    },

    server: {
        input: config.server.input().server.replace(/\.js$/, ".ts"),
        output: config.server.output(),
        plugins: [
            replace({
                "process.browser": false,
                "process.env.NODE_ENV": JSON.stringify(mode),
            }),
            svelte({
                preprocess: autoPreprocess(),
                generate: "ssr",
                dev,
            }),
            resolve({
                dedupe: ["svelte"],
            }),
            commonjs(),
            typescript(),
        ],
        external: Object.keys(pkg.dependencies).concat(
            require("module").builtinModules ||
                Object.keys(process.binding("natives")),
        ),

        preserveEntrySignatures: "strict",
        onwarn,
    },

    serviceworker: {
        input: config.serviceworker.input(),
        output: config.serviceworker.output(),
        plugins: [
            resolve(),
            replace({
                "process.browser": true,
                "process.env.NODE_ENV": JSON.stringify(mode),
            }),
            commonjs(),
            !dev && terser(),
        ],

        preserveEntrySignatures: false,
        onwarn,
    },
}
