FROM node:20-bullseye-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 4040

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4040

# Start the application
CMD ["npm", "start"] 