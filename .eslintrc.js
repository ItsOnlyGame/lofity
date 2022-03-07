module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        sourceType: 'module'
    },
    extends: [
        '@nuxtjs/eslint-config-typescript'
    ],
    // add your custom rules here
    rules: {
        // StandardJS — The Rules
        indent: ['error', 4],
        'max-len': ['error', { code: 120 }],
        'no-console': 'off',
        'arrow-parens': ['error', 'as-needed'],
        curly: ['error', 'multi-line'],
        'import/no-extraneous-dependencies': 'off',
        'require-await': 0,

        'eol-last': 'off',
        'no-template-curly-in-string': 'off',
        'space-before-function-paren': 'off',
        'no-return-assign': 'off',
        '@typescript-eslint/no-unused-vars': ['off'],

        'global-require': 0,
        'import/no-unresolved': 0,
        'import/newline-after-import': 0,
        'no-underscore-dangle': 0,

        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        'vue/max-attributes-per-line': 'off',
        'vue/singleline-html-element-content-newline': 0,
        'vue/html-indent': ['error', 4],
        'vue/multi-word-component-names': 'off'
    }
}
