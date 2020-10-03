# Use the official image as a parent image.
FROM node:current-slim

# Copy the file from your host to your current location.
COPY ["package.json", "yarn.lock", "/app/"]

WORKDIR /app

# Run the command inside your image filesystem.
RUN yarn install && \
    yarn cache clean

# Load our application's code in.
COPY . .

# Add metadata to the image to describe which port the container is listening on at runtime.
EXPOSE 8080

WORKDIR ./idealize-api

# Run the specified command within the container.
CMD [ "yarn", "start" ]
