const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const fs = require("fs");

const directoryPath = path.resolve("public");
const createDotenvPlugin = isDev => {
    const envFile = path.resolve(__dirname, isDev ? "./.env.development" : "./.env.production");
    return new Dotenv({
        path: fs.existsSync(envFile) ? envFile : path.resolve(__dirname, "./.env.example"),
        safe: path.resolve(__dirname, "./.env.example"),
        systemvars: true
    });
};

const handleDir = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject("Unable to scan directory: " + err);
            }
            resolve(files);
        });
    });
};

module.exports = async (env, agrv) => {
    const isDev = agrv.mode === "development";
    const isAnalyze = env && env.analyze;
    const dirs = await handleDir();
    // const copyPluginPatterns = dirs
    //     .filter(dir => dir !== "index.html")
    //     .map(dir => {
    //         return {
    //             from: dir,
    //             to: "",
    //             context: path.resolve("public")
    //         }
    //     });

    const basePlugins = [
        createDotenvPlugin(isDev),
        new HtmlWebpackPlugin({
            template: "public/index.html"
        }),
        // new CopyPlugin({
        //     patterns: copyPluginPatterns
        // }),
        new MiniCssExtractPlugin({
            filename: isDev ? "css/site.css" : "static/css/site.min.css"
        }),
        new webpack.ProgressPlugin()
    ];

    let prodPlugins = [
        ...basePlugins,
        new CleanWebpackPlugin(),
        new CompressionPlugin({
            test: /\.(css|js|html|svg)$/
        }),
    ];

    if (isAnalyze) {
        prodPlugins = [...prodPlugins, new BundleAnalyzerPlugin()];
    }

    return {
        entry: [
            "./src/index.tsx",
        ],
        output: {
            filename: 'index.bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/', // Ensure all assets are served correctly
            library: 'ElearningCmsOrder',
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx|js|jsx)$/,
                    use: ["ts-loader", "eslint-loader"],
                    exclude: /node_modules/
                },
                {
                    test: /\.(s[ac]ss|css)$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
                },
                {
                    test: /\.(eot|ttf|woff|woff2)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: isDev ? "[path][name].[ext]" : "static/fonts/[name].[ext]"
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: isDev ? "[path][name].[ext]" : "static/media/[name].[contenthash:6].[ext]"
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".jsx", ".js"],
            alias: {
                "@": path.resolve("src"),
                "@@": path.resolve()
            },
            fallback: { crypto: false },
        },
        devtool: isDev ? "source-map" : false,
        devServer: {
            contentBase: path.resolve(__dirname, 'public'),
            port: 3002,
            hot: true,
            watchContentBase: true,
            historyApiFallback: true,
            open: true
        },
        plugins: isDev ? basePlugins : prodPlugins,
        performance: {
            maxEntrypointSize: 800000 // Warning if a single file exceeds this size
        }
    };
}
