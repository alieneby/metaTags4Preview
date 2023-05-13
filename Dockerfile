FROM alpine:3.18

# Installs latest Chromium package.
RUN apk add --no-cache \
      nodejs \
      yarn

# Copy current directory to /usr/src/app
ADD . /usr/src/app

# Install dependencies
WORKDIR /usr/src/app
RUN yarn install

# Create output directory
RUN mkdir -p /usr/src/app/out

ENV PATH="/usr/src/app:${PATH}"
EXPOSE 3000

CMD [ "node", "server.js" ]
