FROM node:20-alpine

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# generate prisma schema
RUN npx prisma generate

# Copy application code
COPY . .

# Set entry point
ENTRYPOINT ["node", "index.js"]
