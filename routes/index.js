const express = require('express');
const router = express.Router();
const slowDown = require('express-slow-down');
const rateLimit = require('express-rate-limit');
const path = require('path');

const Url = require('../models/UrlObject');

const notFoundPath = path.join(__dirname, '../public/404.html');

router.post('/url', slowDown ({
    windowMs: 30 * 1000, // 30 seconds
    delayAfter: 100,      // allow 1 requests per 30 seconds
    delayMs: 500        // begin adding 500ms of delay per requests above 1 req
    // request # 2 is delayed by  500ms
    // request # 3 is delayed by 1000ms
    // request # 4 is delayed by 1500ms
}), rateLimit({
    windowMs: 30 * 1000,     // 30 seconds
    max: 100                  // // Limit each IP to 1 requests per `window` (here, per 30 seconds)
}), async (req, res, next)=> {
    let {slug, url} = req.body;

    let newUrl = new Url({
        slug,
        url
    });
    try{
        await newUrl.validate();
        if(!slug){
            slug = (Math.random() + 1).toString(36).substring(7);
        }
        const existing = await Url.findOne({slug});
        if(existing){
            throw new Error('Slug in use')
        }
        newUrl.slug = slug.toLowerCase();
        let created = await newUrl.save();
        res.json(created);
    }catch(err){
        next(err)
    }
});

router.get('/:id', async (req, res, next)=> {
    const {id: slug} = req.params;

    try{
        const url = await Url.findOne({slug: slug.toLowerCase()});
        if(url){
            return res.redirect(url.url)
        }
        return res.status(404).sendFile(notFoundPath);
    }catch(err){
        return res.status(404).sendFile(notFoundPath);
    }
})

module.exports = router;