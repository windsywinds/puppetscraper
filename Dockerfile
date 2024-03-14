FROM ghcr.io/puppeteer/puppeteer:latest

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy application code
COPY . .

# generate prisma schema
RUN npx prisma generate

# Install necessary packages for Puppeteer and Chromium
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn


# Install Puppeteer
RUN yarn add puppeteer@15.0.0

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser

# Set entry point
ENTRYPOINT ["node", "index.js"]
