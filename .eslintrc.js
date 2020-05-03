const isProduction = process.env.NODE_ENV === "production"
module.exports = {
    "root": true,
    "parser": "babel-eslint",
    "extends": "o2team",
    "plugins": [
        "react"
    ],
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "jest": true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "modules": true,
            "jsx": true
        }
    },
    "settings": {
        "react": {
            "pragma": "React",
            "version": "detect"
        }

    },
    "globals": {
        "CommentJS": true
    },
    "rules": {
        "quotes": "off",
        "no-console": [isProduction ? "error" : "off", { allow: ["warn", "error"] }],
        "no-debugger": [isProduction ? "error" : "off"],
        "indent": ["warn", 4],
        "no-param-reassign": ["off"],
        "max-len": ["error", 120, 4],
        "semi": "off",
        "no-unused-vars": [isProduction ? "error" : "warn", { "args": "none", "ignoreRestSiblings": true, "caughtErrors": "none" }],
        "react/jsx-no-bind": [
            2,
            {
                "ignoreRefs": true
            }
        ],
        "space-before-function-paren": "off",
        "eol-last": "off",
        "react/jsx-no-duplicate-props": 2,
        "react/self-closing-comp": 2,
        "react/no-string-refs": 2,
        "react/require-render-return": 2,
        "react/no-find-dom-node": 2,
        "react/no-is-mounted": 2,
        "react/jsx-no-comment-textnodes": 2,
        "react/jsx-curly-spacing": 2,
        "react/jsx-no-undef": 2,
        "react/jsx-uses-react": 2,
        "react/jsx-uses-vars": 2,
        "class-methods-use-this": 0,
        "react/no-multi-comp": "off",
        "react/prefer-stateless-function": ["error", { ignorePureComponents: true }],
        "react/prefer-es6-class": ["error", "always"],
        "react/jsx-one-expression-per-line": ["off"],
        "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx"] }],
        "react/jsx-no-literals": "off",
        "react/prop-types": ["warn", { ignore: ["children"], skipUndeclared: true }],
        "react/destructuring-assignment": "off",//["off", "always", { ignoreClassFields: true }],
        "react/jsx-props-no-spreading": "off",
        "react/jsx-max-depth": "off",
        "react/no-set-state": "off",
        "react/jsx-no-bind": "off",
        "react/display-name": "off",
        "react/jsx-child-element-spacing": "off",
        "react/jsx-max-props-per-line": ["warn", { maximum: 5 }],
        "react/jsx-sort-props": "off",//["error", { callbacksLast: true, shorthandFirst: true, reservedFirst: true }],
        "react/no-children-prop": "off",
        "react/forbid-component-props": "off",
        "react/jsx-handler-names": ["warn", { eventHandlerPrefix: "on", eventHandlerPropPrefix: "on" }],
        "react/forbid-prop-types": "off",
        "react/require-optimization": ["error", { allowDecorators: ["shouldComponentUpdate", "pureRender"] }],
        "react/function-component-definition": "off"
    }
}