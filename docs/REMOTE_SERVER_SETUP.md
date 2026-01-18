# Remote Server Setup Guide for Everything Is Awesome

This document describes the steps to set up and deploy the Everything Is Awesome application on a remote Ubuntu server, including process management and production best practices.

---

## 1. Server Prerequisites
- Ubuntu 20.04+ (or similar Linux distribution)
- sudo/root access for initial setup
- Public domain or IP address

## 2. System User & Directory Structure
- Create a dedicated system user for the app (recommended for isolation):
  ```sh
  sudo adduser --disabled-password --gecos "" everythingisawesome
  ```
- Set the home directory (if not default):
  ```sh
  sudo usermod -d /srv/apps/everythingisawesome everythingisawesome
  sudo mkdir -p /srv/apps/everythingisawesome
  sudo chown everythingisawesome:everythingisawesome /srv/apps/everythingisawesome
  ```

## 3. Install Node.js (nvm recommended)
- As the app user:
  ```sh
  su - everythingisawesome
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  source ~/.bashrc  # or ~/.zshrc
  nvm install 22
  nvm use 22
  nvm alias default 22
  ```

## 4. Install pnpm & npm (if needed)
- Install npm (comes with Node.js)
- Install pnpm globally (optional, if using pnpm scripts):
  ```sh
  npm install -g pnpm
  ```

## 5. Clone the Repository
- As the app user:
  ```sh
  git clone <your-repo-url> /srv/apps/everythingisawesome
  cd /srv/apps/everythingisawesome
  ```

## 6. Install Dependencies
- In the project root:
  ```sh
  pnpm install
  pnpm run install-all
  ```

## 7. Build the Client
- In the project root:
  ```sh
  pnpm run build
  ```

## 8. Environment Variables
- Create a `.env` file in the project root and set required variables:
  ```env
  NEWS_API_KEY=your_news_api_key
  
  # Choose one provider:
  AI_PROVIDER=gemini # or grok
  
  # Gemini Config
  GEMINI_API_KEY=your_gemini_key
  GEMINI_MODEL=gemini-2.5-flash
  GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
  GEMINI_OPINION_MAX_TOKENS=2000

  # Grok Config
  GROK_API_KEY=your_grok_key
  GROK_MODEL=grok-3-latest

  NODE_ENV=production
  PORT=3001
  # ...other variables as needed
  ```
- For the client, set `REACT_APP_API_URL` in `client/.env.production` if needed.

## 9. nginx Reverse Proxy Setup
- Install nginx:
  ```sh
  sudo apt update && sudo apt install nginx
  ```
- Example nginx site config (e.g., `/etc/nginx/sites-available/everythingisawesome`):
  ```nginx
  server {
      listen 80;
      server_name yourdomain.com;

      location /api/ {
          proxy_pass http://localhost:3001/api/;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }

      location /generated-images/ {
          proxy_pass http://localhost:3001/generated-images/;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }

      location / {
          proxy_pass http://localhost:3000/;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  ```
- Enable the site and reload nginx:
  ```sh
  sudo ln -s /etc/nginx/sites-available/everythingisawesome /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl reload nginx
  ```

## 10. Process Management with pm2
- Install pm2 globally (as app user):
  ```sh
  npm install -g pm2
  ```
- Start the app with pm2:
  ```sh
  pm2 start npm --name everythingisawesome -- run start:prod
  pm2 save
  pm2 startup
  # Follow the instructions to run the sudo command for systemd
  ```
- pm2 will now restart your app on reboot.

## 11. Useful pm2 Commands
- View running apps: `pm2 list`
- View logs: `pm2 logs everythingisawesome`
- Restart: `pm2 restart everythingisawesome`
- Stop: `pm2 stop everythingisawesome`

## 12. Troubleshooting
- Check logs with pm2 and nginx for errors.
- Ensure all environment variables are set.
- Make sure ports 80 (nginx) and 3001 (API) are open (use ufw or similar).
- If using pnpm, ensure it is installed and in PATH for the app user.

---

**Your Everything Is Awesome app should now be live and robustly managed!**
