const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    slug: {
        type: String,
        unique: [true, 'Slug already exist'],
        trim: true,
        validate: {
            validator: function(v){
                return /^[\w\-]+$/i.test(v);
            },
            message: 'Not valid'
        }
    },
    url: {
        type: String,
        unique: [true, 'URL already exist'],
        required: true,
        trim: true,
        validate: {
            validator: function(v){
                return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(v)
            },
            message: 'url is not valid'
        }
    }
});

const Url = mongoose.model('Url', UrlSchema);
module.exports = Url;