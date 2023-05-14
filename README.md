# INSTALL

- Install nodeJS.
- git clone "git@github.com:alieneby/oembed.git"
- cd oembed
- node server.js

# BUILD DOCKER IMAGE
docker build -t oembed/20230513 .

# START CONTAINER
docker run -it -v $(pwd):/usr/src/app/out --name oembed -p 3000:3000 --rm oembed/20230513


