FROM node:20-alpine

# Install necessary packages for Puppeteer and Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    xvfb \
    x11-xkb-utils \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-scalable \
    xfonts-cyrillic \
    x11-apps \
    clang \
    libdbus-1-dev \
    libgtk-3-0 \
    libnotify-dev \
    libgnome-keyring-dev \
    libgconf2-dev \
    libasound2-dev \
    libcap-dev \
    libcups2-dev \
    libxtst-dev \
    libxss1 \
    libnss3-dev \
    gnome-keyring \
    xauth

# Set environment variables
ENV DISPLAY=:99
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create a directory for the application code
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# generate prisma schema
RUN npx prisma generate

# Add a user for running the application
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && chown -R pptruser:pptruser /app

# Switch to the pptruser user
USER pptruser

# Start Xvfb and run the application
CMD Xvfb :99 -ac -screen 0 1024x768x24 && node index.js
