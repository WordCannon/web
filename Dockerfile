FROM node:8

WORKDIR /wordcannon/app

# Copy package.json into container and install dependencies
COPY package*.json ./
RUN npm install

# Copy resulting app bundle into container
COPY . .

# Make sure our service's port is visible outside of this container
EXPOSE 8888

# Define what will run when this container starts (and its arg(s))
ENTRYPOINT [ "npm", "start" ]