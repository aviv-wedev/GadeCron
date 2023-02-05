# Create container with node and npm preinstalled
FROM 150909075967.dkr.ecr.eu-central-1.amazonaws.com/node:14-alpine

# Install app dependencies
COPY package*.json /tmp/
RUN npm install --only=production --prefix /tmp
RUN mkdir -p /app && mv /tmp/node_modules /app/

# Create app directory
WORKDIR /app
COPY . /app/

# Bind to port 80
EXPOSE 80

CMD node index.js
