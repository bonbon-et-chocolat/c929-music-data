FROM node:15-slim

LABEL MAINTAINER="bonbon-et-chocolat"

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY . .
ENV NODE_ENV production
ENV DB_URL #

# If you are building your code for production
RUN npm ci --only=production

EXPOSE 80
CMD ["node","/app/app.js"]
