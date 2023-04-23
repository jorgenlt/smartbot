module.exports = {
    resolver: {
        extraNodeModules: {
            'config': require('path').resolve(__dirname, 'config')
        }
    },
    transformer: {
        babelTransformerPath: require.resolve('react-native-dotenv')
    }
};
