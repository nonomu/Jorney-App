const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const request = require('request')
const requestPromise = require("request-promise")
const Favorites = require("../models/Favorites")
const Transfer = require("./transfer")
const IconsTransfer = Transfer.IconsTransfer
const CityStateToCode = Transfer.CityStateToCode
const CodeToCityState = Transfer.CodeToCityState
var airports = mongoose.model('airports', new Schema({ name: String }));
const WheatherAPIbasicURL = "https://api.openweathermap.org/data/2.5/weather"
const FlightsAPIbasicURL = "https://api.skypicker.com/flights?"
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

router.get('/get/', async function (req, res) {
    res.end()
})

router.post('/flights', async function (req, res) {
    let curCityName = req.body[`currentLocation[cityName]`]
    let curCountryName = req.body[`currentLocation[countryName]`]
    let desCityName = req.body[`destLocation[cityName]`]
    let desCountryName = req.body[`destLocation[countryName]`]
    let fromDate = req.body['dates[fromDate]'].split("/")
    let toDate = req.body['dates[toDate]'].split("/")

    newFromDate = [fromDate[1], fromDate[0], fromDate[2]]
    newToDate = [toDate[1], toDate[0], toDate[2]]
    fromDate = newFromDate.join("/")
    toDate = newToDate.join("/")


    try {
        let curAirport = await airports.find(
            { city: curCityName },
            { "iata_code": 1, "_id": 0 })
        let desAirport = await airports.find(
            { city: desCityName },
            { "iata_code": 1, "_id": 0 })
        const curiata = curAirport[0].iata_code
        const desiata = desAirport[0].iata_code


        if (desiata != null && curiata != null) {
            const flightsData = await requestPromise(
                `https://api.skypicker.com/flights?fly_from=airport:${curiata}&fly_to=airport:${desiata}&dateFrom=${fromDate}&dateTo=${toDate}&partner=picky&return_from=20/11/2019&return_to=12/12/2019&flight_type=round&curr=USD&max_stopovers=1&ret_from_diff_airport=0&limit=5`
            )
            flightsData = JSON.parse(flightsData)
            console.log(flightsData)
            res.send(JSON.parse(flightsData).data)
        }
        else {
            return false

        }
    }
    catch (err) {
        res.send(err.errmsg)
    }


})


router.post('/cityWeather', async function (req, res) {
    const APPID = "693487d5ce7f67db0872c3ce4dbe3b15"
    let cityName = req.body.cityName
    let countryName = CityStateToCode[req.body.countryName]
    try {
        const weatherData = await requestPromise(`${WheatherAPIbasicURL}?q=${cityName},${countryName}&units=metric&APPID=${APPID}`)
        const data = JSON.parse(weatherData)
        const IconModified = IconsTransfer[data.weather[0].icon]
        const weatherModified = {
            cityName: data.name, countryName: CodeToCityState[data.sys.country], temperature: data.main.temp, description: data.weather[0].description, icon: `https://uds-static.api.aero/weather/icon/lg/${IconModified}.png`, lon: data.coord.lon, lat: data.coord.lat
        }
        res.send(weatherModified)
    }
    catch (err) {
        res.status(400)
        res.send(err.message)
    }
})

router.post('/sites/:type', async function (req, res) {
    const APIkey = 'AIzaSyD_D-FODJApGj4CUB_V-ey9xzRH-gU2uRk'
    let type = req.params.type
    let placeObj = req.body
    let cityName = placeObj.cityName
    let countryName = placeObj.countryName
    let result = await requestPromise(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${type}+${cityName}+${countryName}&key=${APIkey}`)

    let sitesOfType = JSON.parse(result)
    // let latitude = results[0].geometry.location.lat
    // let longitude = results[0].geometry.location.lng

    // result = await requestPromise(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&key=${APIkey}&pagetoken`)
    // result = JSON.parse(result)
    let index = 0
    let sitesResults = []
    for (let site of sitesOfType.results) {
        if (site.rating && !site.permenantly_closed && site.opening_hours) {
            let updatedSite = {
                siteName: site.name,
                address: site.formatted_address,
                openingHours: site.opening_hours.open_now,
                rating: site.rating
            }
            sitesResults.push(updatedSite)

        }
        index++
    }

    sitesResults.shift()
    sitesResults.sort(function (a, b) {
        return a.rating - b.rating
    })
        .reverse()
    let fiveSites = sitesResults.splice(0, 5)
    res.send(fiveSites)

})


router.get('/favorites', async function (req, res) {
    let data = await Favorites.find({})
    res.send(data)
})

router.post('/favorites', async function (req, res) {
    let cityData = req.body
    const FavObj = {
        siteName: cityData.siteName,
        address: cityData.address,
        openingHours: cityData.openingHours,
        rating: cityData.rating,
    }

    const FavArr = [FavObj]
    const Favdb = await Favorites.findOne({ cityName: cityData.cityName, countryName: cityData.countryName })
    if (Favdb == null) {
        let city = new Favorites({ cityName: cityData.cityName, countryName: cityData.countryName, favoritePlaces: FavArr })
        await city.save()
    }
    else {
        const data = await Favorites.updateOne(
            { cityName: cityData.cityName, countryName: cityData.countryName },
            {
                $push: {
                    favoritePlaces:
                    {
                        siteName: cityData.siteName,
                        address: cityData.address,
                        openingHours: cityData.openingHours,
                        rating: cityData.rating,
                    }
                }
            }
        )
    }

    res.send("Thx")
})

router.delete('/favorites', async function (req, res) {
    let cityData = req.body
    const data = await Favorites.findOneAndUpdate(
        { cityName: cityData.cityName, countryName: cityData.countryName },
        {
            $pull: {
                "favoritePlaces": {
                    "address": cityData.address,
                    "siteName": cityData.siteName
                }
            }
        },
        {
            new: false,
            upsert: true
        }
    )
    res.send(data)
})


module.exports = router

// render.renderSites(tripManager.sites)
// $(this).text("Find Flights")
// let currenLocation = $("#user-location")[0].value
// let place = $("#autocomplete")[0].value
// let locations={currenLocation:currenLocation,place:place}
// const flights=await tripManager.getFlights(locations)
// console.log(flights);