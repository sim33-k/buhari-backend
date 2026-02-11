FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Copy the rest of your application code
COPY . .

# Expose port
EXPOSE 3000

# Generate Prisma Client and start the app
CMD ["sh", "-c", "npx prisma generate && npm run dev"]