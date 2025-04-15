import js from '@eslint/js';
import ts from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';

const OFF = 0;
const ERROR = 2;

export default ts.config(
    js.configs.recommended,
    {
        ...reactPlugin.configs.flat.recommended,
        settings: {
            version: 'detect',
        },
        files: ['**/*.{ts,tsx}'],
        rules: {
            ...reactPlugin.configs.flat.recommended.rules,
            ...reactPlugin.configs.flat['jsx-runtime'].rules,

            'react/default-props-match-prop-types': [ERROR, { allowRequiredDefaults: true }],
            'react/display-name': OFF,
            'react/jsx-curly-brace-presence': ERROR,
            'react/jsx-no-bind': ERROR,
            'react/jsx-no-target-blank': OFF,
            'react/jsx-no-useless-fragment': [ERROR, { allowExpressions: true }],
            'react/no-access-state-in-setstate': ERROR,
            'react/no-adjacent-inline-elements': OFF,
            'react/no-array-index-key': ERROR,
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
        },
    },
    {
        rules: {
            curly: ERROR,
        },
    },
    ...ts.configs.recommended,
    // todo ...tailwind.configs['flat/recommended'], https://github.com/tailwindlabs/prettier-plugin-tailwindcss
    {
        ignores: ['.next/**/*.*', '**/*.json', '**/*.js'],
    },
);
