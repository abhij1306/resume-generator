#!/usr/bin/env bash

set -e  # stop script on any error

REPO_NAME="resume-generator"
USERNAME="abhij1306"

echo ">>> Installing gh-pages if missing..."
npm install gh-pages --save-dev

echo ">>> Updating vite.config.js with correct base..."
# Overwrite or create vite.config.js
cat > vite.config.js <<EOF
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/$REPO_NAME/",
  plugins: [react()],
});
EOF

echo ">>> Updating package.json scripts..."
npx json -I -f package.json -e '
this.scripts = this.scripts || {};
this.scripts.build = "vite build";
this.scripts.predeploy = "npm run build";
this.scripts.deploy = "gh-pages -d dist";
'

echo ">>> Building project..."
npm run build

echo ">>> Deploying to gh-pages..."
npm run deploy

echo ">>> Deployment complete!"
echo "Your site will be live at:"
echo "https://$USERNAME.github.io/$REPO_NAME/"
