module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'next',
        'next/core-web-vitals'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        // ここに独自のルールを追加します
        'react/react-in-jsx-scope': 'off', // React 17以降では不要なのでオフにする
        'react/no-unescaped-entities': 'off', // JSX内の特殊文字に関する警告を無効にする
        '@typescript-eslint/explicit-module-boundary-types': 'off', // TypeScriptでの関数の戻り値の型定義強制を無効にする
        // その他のルール...
    },
    settings: {
        react: {
            version: 'detect', // eslint-plugin-reactが自動的にReactのバージョンを検出
        },
    },
};