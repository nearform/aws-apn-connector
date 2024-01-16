# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/playwright:v1.40.0-jammy


RUN npm install -g npm@10.2.5

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm npm i --omit=dev --ignore-scripts

# Copy local code to the container image.
COPY . .

CMD npx playwright install

# Run the web service on container startup.
CMD [ "node", "samples/server.js" ]