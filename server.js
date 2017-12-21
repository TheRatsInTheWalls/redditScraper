'use strict'

const express = require('express')
const request = require('request')
const cheerio = require('cheerio')
const prettyjson = require('prettyjson')
const readlineSync = require('readline-sync')
const app = express()

app.get('/scrape', scrape)

app.listen('8080')

console.log('Scraper listening on port 8080')

module.exports = app
let sub = readlineSync.question('What subreddit shall we scrape?')
let url = `https://www.reddit.com/r/${sub}`

function scrape(req, res) {

    request(url, function (error, response, html) {
        if (!error) {
            const $ = cheerio.load(html)

            const json = []

            $('.title').filter(function () {
                let data = $(this)
                let post = {
                    label: data.find('.linkflairlabel').text(),
                    title: data.find('a').text(),
                    url: data.find('a').attr('href')
                }
                if (post.label) {
                    json.push(post)
                }
            })
            console.log(prettyjson.render(json))
        } else {
            console.log(prettyjson.render(error))
        }
    })
}

scrape()
