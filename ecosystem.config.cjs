module.exports = {
  apps: [
    {
      name: "everythingisawesome",
      script: "app.js",
      cwd: "/var/www/everythingisawesome",
      instances: 1,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
