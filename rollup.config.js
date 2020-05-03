import nodeResolve from '@rollup/plugin-node-resolve'     // 帮助寻找node_modules里的包
import babel from 'rollup-plugin-babel'                             // rollup 的 babel 插件，ES6转ES5
import replace from '@rollup/plugin-replace'                       // 替换待打包文件里的一些变量，如 process在浏览器端是不存在的，需要被替换
import commonjs from '@rollup/plugin-commonjs'              // 将非ES6语法的包转为ES6可用
import { eslint } from 'rollup-plugin-eslint'
import image from '@rollup/plugin-image'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import json from 'rollup-plugin-json'
import pkg from './package.json'

const env = process.env.NODE_ENV
const plugins = (isBabelEnv = false) => [
    eslint({
        // throwOnError: true,
        // throwOnWarning: true,
        include: ['src/**'],
        exclude: [
            'node_modules/**',
            '**/for-each.js',
            '**/polyglot.js',
            '**/icons/**',
            "**/*.less",
            "**/*.css",
            "**/*.svg",
        ]
    }),
    nodeResolve(),
    babel({
        babelrc: false,
        exclude: '**/node_modules/**',
        runtimeHelpers: true,
        presets: [
            isBabelEnv ? ['@babel/env'] : false,
            ['@babel/react']
        ].filter(Boolean),
        plugins: [
            ['@babel/plugin-transform-runtime'],
            ['@babel/plugin-proposal-class-properties']
        ]
    }),
    replace({
        'process.env.NODE_ENV': JSON.stringify(env),
        'VERSION': JSON.stringify(pkg.version)
    }),
    commonjs({
        extensions: ['.js', '.jsx', '.ts', '.json'],
        namedExports: {
            // @see problem https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module
            // fix this https://zh4ui.net/post/2018-12-23-rollup-typescript-react/
            'node_modules/react/index.js': ['Component', 'createElement', 'Children']
        }
    }),
    json(),
    image(),
    terser()
]

export default [
    {
        input: 'src/CommentJS.js',
        external: ['react', 'react-dom'],
        output: {
            file: 'dist/react/index.js',
            format: "umd",       　　　　　　　　　　 // 输出UMD格式，各种模块规范通用
            name: 'CommentJS',　　　　　　　　　      // 打包后的全局变量，如浏览器端 window.CommentJS
            globals: {
                'react': 'React',                     // 这跟external 是配套使用的，指明global.React即是外部依赖react
                'react-dom': 'ReactDOM'
            }
        },
        plugins: plugins()
    },
    {
        input: 'src/style/index.js',
        output: {
            file: 'dist/style.css',
            format: "umd",       　　　　　　　　　　 // 输出UMD格式，各种模块规范通用
            name: 'CommentJS',　　　　　　　　　      // 打包后的全局变量，如浏览器端 window.CommentJS
        },
        plugins: [
            postcss({
                extract: true,
                minimize: false,
                plugins: [
                    require('autoprefixer'),
                    require('cssnano')({
                        autoprefixer: false,
                        // normalizeWhitespace: false
                    }),
                ],
            })
        ]
    },
    {
        input: 'src/index.js',
        external: ['react', 'react-dom'],
        output: {
            file: 'dist/comment-js.es.js',
            format: "umd",       　　　　　　　　　　 // 输出UMD格式，各种模块规范通用
            name: 'CommentJS',
            globals: {
                'react': 'React',                     // 这跟external 是配套使用的，指明global.React即是外部依赖react
                'react-dom': 'ReactDOM'
            }
        },
        plugins: plugins()
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/comment-js.js',
            format: "umd",       　　　　　　　　　　 // 输出UMD格式，各种模块规范通用
            name: 'CommentJS'
        },
        plugins: plugins(true)
    }
]