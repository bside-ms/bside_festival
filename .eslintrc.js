const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    ignorePatterns: [
        '**/*.json',
        '**/*.js',
    ],
    plugins: [
        // https://github.com/yannickcr/eslint-plugin-react
        'react',

        // https://github.com/typescript-eslint/typescript-eslint
        '@typescript-eslint',

        // https://github.com/benmosher/eslint-plugin-import
        'import',

        // https://github.com/lydell/eslint-plugin-simple-import-sort
        'simple-import-sort',

        // https://github.com/sweepline/eslint-plugin-unused-imports
        'unused-imports',

        // https://github.com/sindresorhus/eslint-plugin-unicorn/
        'unicorn',

        // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
        'react-hooks',
    ],
    extends: [
        // node_modules/eslint/conf/eslint-recommended.js
        'eslint:recommended',

        'plugin:@next/next/recommended',

        // node_modules/eslint-plugin-react/index.js
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',

        // node_modules/@typescript-eslint/eslint-plugin/dist/configs/eslint-recommended.js
        'plugin:@typescript-eslint/eslint-recommended',

        // node_modules/@typescript-eslint/eslint-plugin/dist/configs/recommended.json
        'plugin:@typescript-eslint/recommended',

        // node_modules/@typescript-eslint/eslint-plugin/dist/configs/recommended-requiring-type-checking.json
        'plugin:@typescript-eslint/recommended-requiring-type-checking',

        // node_modules/eslint-plugin-react-hooks/src/index.js
        'plugin:react-hooks/recommended',
    ],
    settings: {
        react: {
            version: 'detect'
        },
        'import/extensions': ['.ts', '.tsx'],
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx']
        },
        'import/cache': 'Infinity',
    },
    reportUnusedDisableDirectives: true,
    rules: {
        /**
         * Core rules
         *
         * https://eslint.org/docs/rules/
         */
        'array-bracket-newline': [ERROR, 'consistent'],
        'array-bracket-spacing': [ERROR],
        'array-element-newline': [ERROR, 'consistent'],
        'arrow-parens': [OFF, 'as-needed'],
        'arrow-spacing': ERROR,
        'comma-dangle': OFF, // Is handled by TS plugin
        'complexity': [
            ERROR,
            { max: 15 }
        ],
        'curly': ERROR,
        'default-param-last': OFF, // Is handled by TS plugin
        'dot-notation': OFF, // Is handled by TS plugin
        'eol-last': ERROR,
        'function-call-argument-newline': [ERROR, 'consistent'],
        'function-paren-newline': [ERROR, 'multiline-arguments'],
        'eqeqeq': [ERROR, 'always'],
        'guard-for-in': ERROR,
        'id-match': ERROR,
        'indent': [
            ERROR,
            4,
            { SwitchCase: 1 }
        ],
        'jsx-quotes': [ERROR, 'prefer-double'],
        'key-spacing': ERROR,
        'max-classes-per-file': [ERROR, 10],
        'max-len': [
            ERROR,
            {
                code: 160,
                ignoreRegExpLiterals: true,
                ignorePattern: '^import ' // ignoring imports
            }
        ],
        'max-lines': [ERROR, 666],
        'new-parens': ERROR,
        'no-bitwise': ERROR,
        'no-caller': ERROR,
        'no-console': ERROR,
        'no-eval': ERROR,
        'no-extra-bind': ERROR,
        'no-lone-blocks': ERROR,
        'no-multi-spaces': ERROR,
        'no-multiple-empty-lines': [
            ERROR,
            { max: 1 }
        ],
        'no-nested-ternary': ERROR,
        'no-new-func': ERROR,
        'no-new-wrappers': ERROR,
        'no-prototype-builtins': OFF, // We take the risk, plus we only use it in a few occasions
        'no-restricted-properties': [
            ERROR,
            {
                object: 'window',
                property: 'console',
                message: 'Use the global `console` object instead of the `window.console` property.',
            }
        ],
        'no-return-await': ERROR,
        'no-sequences': ERROR,
        'no-shadow': OFF, // Is handled by TS plugin
        'no-template-curly-in-string': ERROR,
        'no-throw-literal': ERROR,
        'no-unused-expressions': OFF, // Is handled by TS plugin
        'no-useless-return': ERROR,
        'object-curly-newline': [ERROR, { consistent: true }],
        'object-curly-spacing': [ERROR, 'always'],
        'object-property-newline': [ERROR, { allowAllPropertiesOnSameLine: true }],
        'object-shorthand': ERROR,
        'one-var': [
            ERROR,
            'never'
        ],
        'prefer-object-spread': ERROR,
        'prefer-template': ERROR,
        'quote-props': [
            ERROR,
            'consistent-as-needed'
        ],
        'radix': ERROR,
        'space-before-blocks': OFF, // Is handled by TS plugin
        'space-before-function-paren': [
            ERROR,
            {
                anonymous: 'never',
                asyncArrow: 'always',
                named: 'never'
            }
        ],
        'spaced-comment': ERROR,
        'space-in-parens': [ERROR, 'never'],
        'template-curly-spacing': ERROR,

        /**
         * React plugin
         *
         * https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules
         */
        'react/default-props-match-prop-types': [
            ERROR,
            { 'allowRequiredDefaults': true }
        ],
        'react/display-name': OFF,
        'react/jsx-closing-bracket-location': ERROR,
        'react/jsx-closing-tag-location': ERROR,
        'react/jsx-curly-brace-presence': ERROR,
        'react/jsx-curly-spacing': ERROR,
        'react/jsx-first-prop-new-line': [ERROR, 'multiline'],
        'react/jsx-equals-spacing': ERROR,
        'react/jsx-indent': ERROR,
        'react/jsx-no-bind': WARNING,
        'react/jsx-no-target-blank': OFF,
        'react/jsx-no-useless-fragment': ERROR,
        'react/jsx-props-no-multi-spaces': ERROR,
        'react/jsx-props-no-spreading': WARNING,
        'react/jsx-tag-spacing': [
            ERROR,
            {
                'closingSlash': 'never',
                'beforeSelfClosing': 'always',
                'afterOpening': 'never',
                'beforeClosing': 'never'
            }
        ],
        'react/jsx-wrap-multilines': [
            ERROR,
            {
                'declaration': 'parens-new-line',
                'assignment': 'parens-new-line',
                'return': 'parens-new-line',
                'arrow': 'parens-new-line',
                'condition': 'parens-new-line',
                'logical': 'parens-new-line',
                'prop': 'parens-new-line'
            }
        ],
        'react/no-access-state-in-setstate': ERROR,
        'react/no-adjacent-inline-elements': OFF,
        'react/no-array-index-key': WARNING,
        'react/no-danger': ERROR,
        'react/no-deprecated': OFF,
        'react/no-did-mount-set-state': ERROR,
        'react/no-did-update-set-state': ERROR,
        'react/no-direct-mutation-state': OFF,
        'react/no-find-dom-node': ERROR,
        'react/no-string-refs': [ERROR, { noTemplateLiterals: true }],
        'react/no-unescaped-entities': OFF,
        'react/no-unknown-property': OFF,
        'react/no-unsafe': ERROR,
        'react/no-unused-prop-types': ERROR,
        'react/no-unused-state': ERROR,
        'react/prefer-stateless-function': ERROR,
        'react/prop-types': OFF,
        'react/react-in-jsx-scope': OFF,
        'react/require-render-return': OFF,
        'react/self-closing-comp': ERROR,

        /**
         * TypeScript plugin
         *
         * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
         */
        '@typescript-eslint/array-type': [
            ERROR,
            { default: 'generic' }
        ],
        '@typescript-eslint/ban-ts-comment': ERROR,
        '@typescript-eslint/brace-style': ERROR,
        '@typescript-eslint/camelcase': OFF, // Too many external influences for a consistent case style
        '@typescript-eslint/comma-dangle': [
            ERROR, {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'only-multiline',
                enums: 'always-multiline',
                generics: 'always-multiline',
                tuples: 'always-multiline',
            }
        ],
        '@typescript-eslint/comma-spacing': ERROR,
        '@typescript-eslint/consistent-indexed-object-style': [ERROR, 'record'],
        '@typescript-eslint/consistent-type-assertions': [
            ERROR, {
                assertionStyle: 'as',
                objectLiteralTypeAssertions: 'allow',
            }
        ],
        '@typescript-eslint/consistent-type-definitions': ERROR,
        '@typescript-eslint/consistent-type-imports': [
            ERROR, // Mainly so this can be auto-fixed
            { disallowTypeAnnotations: false }
        ],
        '@typescript-eslint/default-param-last': ERROR,
        '@typescript-eslint/dot-notation': ERROR,
        '@typescript-eslint/explicit-function-return-type': WARNING,
        '@typescript-eslint/explicit-member-accessibility': [
            ERROR,
            {
                accessibility: 'explicit',
                overrides: {
                    accessors: 'explicit',
                    constructors: 'explicit'
                }
            }
        ],
        '@typescript-eslint/explicit-module-boundary-types': ERROR,
        '@typescript-eslint/func-call-spacing': ERROR,
        '@typescript-eslint/init-declarations': ERROR,
        '@typescript-eslint/keyword-spacing': ERROR,
        '@typescript-eslint/member-delimiter-style': [
            ERROR,
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true
                },
                singleline: {
                    delimiter: 'comma',
                    requireLast: false
                }
            }
        ],
        '@typescript-eslint/member-ordering': [
            ERROR,
            {
                'default': [
                    // Index signature
                    'signature',

                    // Fields
                    'public-static-field',
                    'protected-static-field',
                    'private-static-field',

                    'public-field',
                    'protected-field',
                    'private-field',

                    'field',

                    // Getters
                    'public-static-get',
                    'protected-static-get',
                    'private-static-get',

                    'public-get',
                    'protected-get',
                    'private-get',

                    'get',

                    // Constructors
                    'public-constructor',
                    'protected-constructor',
                    'private-constructor',

                    'constructor',

                    // Methods
                    'public-static-method',
                    'protected-static-method',
                    'private-static-method',

                    'public-method',
                    'protected-method',
                    'private-method',

                    'method'
                ]
            }
        ],
        '@typescript-eslint/no-confusing-void-expression': [ERROR, { ignoreArrowShorthand: true }],
        '@typescript-eslint/no-dupe-class-members': ERROR,
        '@typescript-eslint/no-duplicate-imports': ERROR,
        '@typescript-eslint/no-explicit-any': ERROR,
        '@typescript-eslint/no-extra-parens': [ERROR, 'functions'],
        '@typescript-eslint/no-floating-promises': OFF, // We only handle promises if necessary
        '@typescript-eslint/no-inferrable-types': OFF, // We want to set those types explicitly
        '@typescript-eslint/no-invalid-this': ERROR,
        '@typescript-eslint/no-loop-func': ERROR,
        '@typescript-eslint/no-loss-of-precision': ERROR,
        '@typescript-eslint/no-misused-promises': OFF, // We know when and how to use promises
        '@typescript-eslint/no-non-null-assertion': OFF, // There are still too many cases where we do need this
        '@typescript-eslint/no-parameter-properties': ERROR,
        '@typescript-eslint/no-shadow': [
            ERROR,
            { hoist: 'all' }
        ],
        '@typescript-eslint/no-throw-literal': ERROR,
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': ERROR,
        '@typescript-eslint/no-unnecessary-condition': WARNING,
        '@typescript-eslint/no-unnecessary-type-arguments': ERROR,
        '@typescript-eslint/no-unnecessary-type-assertion': OFF, // Switched off for time we're migrating to noUncheckedIndexedAccess
        '@typescript-eslint/no-unsafe-assignment': OFF, // Takes way too much time in our code base
        '@typescript-eslint/no-unsafe-argument': WARNING,
        '@typescript-eslint/no-unsafe-call': WARNING,
        '@typescript-eslint/no-unsafe-member-access': WARNING,
        '@typescript-eslint/no-unsafe-return': WARNING,
        '@typescript-eslint/no-unused-expressions': ERROR,
        '@typescript-eslint/no-unused-vars': OFF, // unused-imports plugin takes care of this
        '@typescript-eslint/no-use-before-define': ERROR,
        '@typescript-eslint/no-useless-constructor': ERROR,
        '@typescript-eslint/no-var-requires': OFF, // We only use require() if we need to
        '@typescript-eslint/non-nullable-type-assertion-style': ERROR,
        '@typescript-eslint/prefer-for-of': ERROR,
        '@typescript-eslint/prefer-function-type': ERROR,
        '@typescript-eslint/prefer-includes': ERROR,
        '@typescript-eslint/prefer-nullish-coalescing': WARNING,
        '@typescript-eslint/prefer-optional-chain': WARNING,
        '@typescript-eslint/prefer-readonly': ERROR,
        '@typescript-eslint/prefer-reduce-type-parameter': ERROR,
        '@typescript-eslint/prefer-regexp-exec': ERROR,
        '@typescript-eslint/prefer-string-starts-ends-with': ERROR,
        '@typescript-eslint/prefer-ts-expect-error': ERROR,
        '@typescript-eslint/quotes': [ERROR, 'single'],
        '@typescript-eslint/require-await': ERROR,
        '@typescript-eslint/restrict-template-expressions': [
            WARNING,
            { allowNumber: true }
        ],
        '@typescript-eslint/semi': [ERROR, 'always'],
        '@typescript-eslint/space-before-blocks': ERROR,
        '@typescript-eslint/space-before-function-paren': [
            ERROR, {
                anonymous: 'never',
                asyncArrow: 'always',
                named: 'never',
            }
        ],
        '@typescript-eslint/space-infix-ops': ERROR,
        '@typescript-eslint/strict-boolean-expressions': WARNING,
        '@typescript-eslint/type-annotation-spacing': ERROR,
        '@typescript-eslint/unbound-method': OFF, // Doesn't recognize autobind decorator
        '@typescript-eslint/unified-signatures': ERROR,

        /**
         * Unused imports plugin
         *
         * https://github.com/sweepline/eslint-plugin-unused-imports#supported-rules
         */
        'unused-imports/no-unused-imports-ts': ERROR,
        'unused-imports/no-unused-vars-ts': [
            ERROR,
            {
                'vars': 'all',
                'varsIgnorePattern': '^_',
                'args': 'after-used',
                'argsIgnorePattern': '^_',
                'ignoreRestSiblings': true
            }
        ],

        /**
         * Import plugin
         *
         * https://github.com/benmosher/eslint-plugin-import#rules
         */
        'import/first': ERROR,
        'import/newline-after-import': ERROR,
        'import/no-duplicates': OFF, // Must be off to prevent type & named imports were merged
        'import/order': OFF,

        /**
         * Import sorting plugin
         *
         * https://github.com/lydell/eslint-plugin-simple-import-sort#usage
         */
        'simple-import-sort/imports': [
            ERROR,
            {
                groups: [
                    // Style imports
                    ['^.+\\.s?css$'],
                    // React and other packages, `react` related packages come first
                    [
                        '^react',
                        // Node.js builtins
                        `^(${require('module').builtinModules.join('|')})(/|$)`,
                        // Installed packages
                        `^(${[
                            ...Object.keys(require('./package.json').dependencies),
                            ...Object.keys(require('./package.json').devDependencies)
                        ].join('|')})(/|$|\u0000)`,
                        // Internal packages
                        '^\\w/view/\\w(/.*|$)',
                        // Anything else
                        '^',
                    ],
                ],
            },
        ],
        'simple-import-sort/exports': OFF,

        /**
         * Unicorn plugin
         *
         * https://github.com/sindresorhus/eslint-plugin-unicorn/#rules
         */
        'unicorn/empty-brace-spaces': ERROR,
        'unicorn/explicit-length-check': ERROR,
        'unicorn/no-array-push-push': ERROR,
        'unicorn/prefer-array-find': ERROR,
        'unicorn/prefer-array-index-of': ERROR,
        'unicorn/prefer-array-some': ERROR,
        'unicorn/prefer-date-now': ERROR,
        'unicorn/prefer-includes': ERROR,
        'unicorn/prefer-optional-catch-binding': ERROR,
        'unicorn/prefer-regexp-test': ERROR,
    }
};
