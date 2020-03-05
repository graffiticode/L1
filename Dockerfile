FROM node:12 as builder

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

FROM node:12-alpine as app

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --production

# Bundle app source
COPY --from=builder build build

CMD [ "npx", "@graffiticode/graffiticode-compiler-framework", "--target=compiler"]
USER node
