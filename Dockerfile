FROM ghcr.io/puppeteer/puppeteer:22.0.0

COPY package*.json ./

# Copy all scripts
COPY . .
# Install production dependencies.
RUN yarn install

ENTRYPOINT ["node", "index.js"]