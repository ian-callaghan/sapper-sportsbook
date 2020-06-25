module.exports = {
    printWidth: 80,
    tabWidth: 4,
    semi: false,
    trailingComma: "all",
    singleQuote: false,
    overrides: [
        {
            files: "*.{js,jsx,ts,tsx,svelte}",
            parser: "typescript",
        },
        {
            files: "*.scss",
            parser: "scss",
        },
        {
            files: ["*.svg", "*.html"],
            parser: "html",
        },
        {
            files: "*.json",
            parser: "json",
        },
        {
            files: "*.gql",
            parser: "graphql",
        },
        {
            files: "*.mdx",
            parser: "mdx",
        },
    ],
}
