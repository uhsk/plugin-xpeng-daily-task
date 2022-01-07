const JavaScriptObfuscator = require('webpack-obfuscator');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        app: __dirname + "/src/js/main.ts"
    },
    output: {
        path: __dirname + "/dist",
        filename: "js/bundle.js"
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: "/node_modules/"
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new JavaScriptObfuscator({
            compact: true,                  // 压缩代码
            controlFlowFlattening: true,    // 是否启用控制流扁平化(降低1.5倍的运行速度)
            deadCodeInjection: true,        // 随机的死代码块(增加了混淆代码的大小)
            renameGlobals: true,            // 是否启用全局变量和函数名称的混淆
            rotateStringArray: true,        // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
            unicodeEscapeSequence: true     // 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
        }, []),
        new FileManagerPlugin({
            events: {
                onStart: {
                    delete: ['dist']
                },
                onEnd: {
                    copy: [
                        {source: 'src/assets', destination: 'dist/assets'},
                        {source: 'src/html', destination: 'dist/html'},
                        {source: 'src/manifest.yaml', destination: 'dist/manifest.yaml'},
                    ]
                }
            }
        }),
    ],
    performance: {
        hints: 'warning',
        maxEntrypointSize: 83886080,        // 10MB
        maxAssetSize: 83886080,             // 10MB
    }
};
