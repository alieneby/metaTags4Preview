const express = require('express')

const cheerio = require('cheerio');
const axios = require('axios');
const {listenOnKeyControlC} = require('./controlC');

/*
This is a simple NodeJS Server that returns the meta tags of a given URL.

Request parameter: url
Example Response:
(
    [title] => Crop Circle 4K | Watership Down, Hampshire | 11 August 2021 | Crop Circles From The Air
    [description] => Hypnose R&uuml;ckf&uuml;hrung - Finde deine Erinnerungen wieder - Frankfurt
    [author_name] => Crop Circles From The Air
    [canonical] => https://hypnose54321.de/
    [thumbnail_url] => https://i.ytimg.com/vi/-euRg6HHV3o/hqdefault.jpg
    [img-w] => 480
    [img-h] => 360
    [favicon-is-a-guess] => 0
    [favicon] => https://hypnose54321.de/favicon.ico
    [domain] => hypnose54321
    [host] => hypnose54321.de
    [url] => https://hypnose54321.de
 )
*/



const app = express()
const port = 3000

// Nodel / object, das die Meta-Tags enthält
function getModel() {
    return {
        title: '',
        description: '',
        author_name: '',
        canonical: '',
        thumbnail_url: '',
        img_w: '',
        img_h: '',
        favicon_is_a_guess: '',
        favicon: '',
        domain: '',
        host: '',
        url: ''
    };
}


const fetchPage = async (url) => {

    // set timeout to 2 seconds
    // set browser agent to Chrome
    const timeout = 2000;
    const headers = {
        'User-Agent': 'Chrome'
    };

    const options = {
        headers: headers,
        timeout: timeout
    };

    const result = await axios.get(url, options);
    return cheerio.load(result.data);
};



const addHtmlMeta = (url, $, model) => {
    model.title = $('title').text();
    model.description = $('meta[name="description"]').attr('content');
    model.author_name = $('meta[name="author"]').attr('content');
    model.canonical = $('link[rel="canonical"]').attr('href');
    model.thumbnail_url = $('meta[property="og:image"]').attr('content');
    model.favicon = $('link[rel="shortcut icon"]').attr('href');
    if (! model.favicon) {
        model.favicon = $('link[rel="icon"]').attr('href');
    }
    model.favicon_is_a_guess = model.favicon? 0 : 1;
    // example domain = "alien.de" if URL is "https://alien.de/ufos"
    // we are using regex to remove the first part of the URL
    model.domain = url.replace(/(https?:\/\/)?(www.)?/, '').split('/')[0];
    // example host = "www.alien.de" if URL is "https://www.alien.de/ufos"
    // we are using regex to remove the first part of the URL
    model.host = url.replace(/(https?:\/\/)?/, '').split('/')[0];
};

// If member is not set, set it to the Twitter value
const addTwitterMeta = ($, model) => {
    if ( ! model.title ) {
        model.title = $('meta[name="twitter:title"]').attr('content');
    }
    if ( ! model.description ) {
        model.description = $('meta[name="twitter:description"]').attr('content');
    }
    if ( ! model.author_name ) {
        model.author_name = $('meta[name="twitter:creator"]').attr('content');
    }
    if ( ! model.canonical ) {
        model.canonical = $('meta[name="twitter:url"]').attr('content');
    }
    if ( ! model.thumbnail_url ) {
        model.thumbnail_url = $('meta[name="twitter:image"]').attr('content');
    }
    if ( ! model.img_w ) {
        model.img_w = $('meta[name="twitter:image:width"]').attr('content');
    }
    if ( ! model.img_h ) {
        model.img_h = $('meta[name="twitter:image:height"]').attr('content');
    }
    if ( ! model.domain ) {
        model.domain = $('meta[name="twitter:site"]').attr('content');
    }
    if ( ! model.host ) {
        model.host = $('meta[name="twitter:site"]').attr('content');
    }
}

// If member is not set, set it to the Facebook value
const addFacebookMeta = ($, model) => {

}

// If member is not set, set it to the meta [property="og:"]: values
const addOGMeta = ($, model) => {
    if ( ! model.title ) {
        model.title = $('meta[property="og:title"]').attr('content');
    }
    if ( ! model.description ) {
        model.description = $('meta[property="og:description"]').attr('content');
    }
    if ( ! model.img_w ) {
        model.img_w = $('meta[property="og:image:width"]').attr('content');
    }
    if ( ! model.img_h ) {
        model.img_h = $('meta[property="og:image:height"]').attr('content');
    }
    if ( ! model.domain ) {
        model.domain = $('meta[property="og:site_name"]').attr('content');
    }
    if ( ! model.host ) {
        model.host = $('meta[property="og:site_name"]').attr('content');
    }
    if ( ! model.thumbnail_url ) {
        model.thumbnail_url = $('meta[property="og:image"]').attr('content');
    }
    if ( ! model.domain ) {
        model.host = $('meta[property="og:site_name"]').attr('content');
        //model.domain = model.host.replace(/(.\w)/)
    }
    if ( ! model.canonical ) {
        model.canonical = $('meta[property="og:url"]').attr('content');
    }
}

const getMetaTags = async (url) => {
    const $ = await fetchPage(url);

    // new model object to return
    let model = getModel();

    addHtmlMeta(url, $, model);
    addOGMeta($, model);
    addTwitterMeta($, model);
    addFacebookMeta($, model);
    if (!model.url) {
        model.url = url;
    }

    return model;
};


// Read URL Parameter 'url' using req.query
app.get('/', async (req, res) => {
    const dateTimeNowIso = new Date().toISOString();
    try {
        // Get URL from URL Parameter 'url'
        const url = req?.query?.url || '';
        if (!url) {
            console.error(dateTimeNowIso, 'URL is missing');
            throw new Error('URL is missing');
        }

        console.log(dateTimeNowIso ,'URL', url);

        let model = await getMetaTags(url); // Setze hier deine URL ein

        // set header to application/json
        res.setHeader('Content-Type', 'application/json');

        // return json. This is the response to the client
        res.send( JSON.stringify(model) );

    } catch (e) {
        console.log(dateTimeNowIso, e);
        res.setHeader('Content-Type', 'application/json');
        res.send( JSON.stringify( {error: e}) );
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// ======================= shutdown
listenOnKeyControlC( process, app );