FROM node:20-bullseye-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

RUN npm run build

# Expose the port the app runs on
EXPOSE 5555

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5555

# Start the application
CMD ["npm", "start"] 