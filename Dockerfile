FROM ghcr.io/puppeteer/puppeteer:latest

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy application code
COPY . .

# generate prisma schema
RUN npx prisma generate


# Set entry point
ENTRYPOINT ["node", "index.js"]
