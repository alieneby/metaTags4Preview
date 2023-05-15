# INSTALL

- Install nodeJS.
- git clone "git@github.com:alieneby/metaTags4Preview.git"
- cd metaTags4Preview
- node server.js

# BUILD DOCKER IMAGE
```bash
docker build -t meta_tags_4_preview/20230515 .
```
# START CONTAINER
```bash
docker run -it -v $(pwd):/usr/src/app/out --name meta_tags_4_preview -p 3000:3000 --rm meta_tags_4_preview/20230515
```

# HTTP REQUEST

Try it in your browser:
http://localhost:3000/?url=https://guteurls.de/


This is a simple NodeJS Server that returns the meta tags of a given URL.

Request parameter: url
Example Response:
```json
{
    "title": "Search engine for your favorite URLs",
    "description": "Your private database for all your internet addresses. You can add and remove URLs.",
    "canonical": "https://guteurls.de/",
    "thumbnail_url": "https://guteurls.de/images/urltagger-preview-thumb_1200x630.jpg",
    "img_w": "1200",
    "img_h": "630",
    "favicon_is_a_guess": 1,
    "domain": "guteurls.de",
    "host": "guteurls.de",
    "author_name": "alieneby",
    "url": "https://guteurls.de/"
}
```