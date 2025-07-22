module.exports = {
  // 基本格式化选项
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // 换行符
  endOfLine: 'lf',
  
  // HTML 格式化
  htmlWhitespaceSensitivity: 'css',
  
  // 嵌入语言格式化
  embeddedLanguageFormatting: 'auto',
  
  // 文件特定覆盖
  overrides: [
    {
      files: '*.html',
      options: {
        printWidth: 120,
        tabWidth: 2,
        htmlWhitespaceSensitivity: 'ignore'
      }
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always'
      }
    },
    {
      files: '*.json',
      options: {
        printWidth: 120,
        tabWidth: 2
      }
    },
    {
      files: '*.yml',
      options: {
        printWidth: 120,
        tabWidth: 2
      }
    },
    {
      files: '*.yaml',
      options: {
        printWidth: 120,
        tabWidth: 2
      }
    }
  ]
};
