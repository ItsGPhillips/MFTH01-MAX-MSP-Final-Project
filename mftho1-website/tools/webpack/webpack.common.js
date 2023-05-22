const path = require('path');

module.exports = {
   entry: path.resolve(__dirname, "../../", "./src/index.tsx"),
   resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
   },
   module: {
      rules: [
         {
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            use: ['babel-loader']
         },
         {
            test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
            type: "asset/resource"
         },
         {
            test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
            type: "asset/inline"
         }
      ]
   },

}