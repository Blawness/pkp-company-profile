module.exports = {
  apps: [
    {
      name: 'pkp-company-profile',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 9006',
      interpreter: 'bun',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 9006
      }
    }
  ]
};


