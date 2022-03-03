// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
    settings: {
        'vetur.useWorkspaceDependencies': true,
        'vetur.experimental.templateInterpolationService': true
    },

    projects: [
        './', // Shorthand for specifying only the project root location
        {
            root: './src/renderer',
            package: '../../package.json',
            tsconfig: './tsconfig.json',
            snippetFolder: './.vscode/vetur/snippets',
            globalComponents: [
                './components/**/*.vue'
            ]
        }
    ]
}