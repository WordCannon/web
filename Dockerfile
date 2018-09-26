FROM node:8.12.0

RUN mkdir -p /opt/app

WORKDIR /wordcannon/app

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Make sure our service's port is visible outside of this container
# default to port 80 for node, and 9229 and 9230 (tests) for debug
ARG PORT=8888
ENV PORT $PORT
EXPOSE $PORT 9229 9230

# you'll likely want the latest npm, reguardless of node version, for speed and fixes
RUN npm i npm@v6.4.1 -g

# install dependencies first, in a different location for easier app bind mounting for local development
WORKDIR /opt
COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
WORKDIR /opt/app
COPY . /opt/app

# Define what will run when this container starts (and its arg(s))
ENTRYPOINT [ "node", "webserver.js" ]
