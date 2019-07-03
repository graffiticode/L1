FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install \
    && npm install -g browserify \
    && npm install -g babel-cli

# Bundle app source
COPY . .

RUN make build

CMD [ "node", "app.js" ]
