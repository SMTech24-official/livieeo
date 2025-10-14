module.exports = {
  apps: [
    {
      name: 'livieo-server',
      script: './dist/server.js',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

