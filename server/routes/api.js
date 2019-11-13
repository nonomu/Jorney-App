const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const request = require('request')
const requestPromise = require("request-promise")
const Favorites = require("../models/Favorites")
const IconsTransfer ={
    "01d": "01",
    "02d": "02",
    "03d": "07",
    "04d":"08",
    "09d":"12",
    "10d":"18",
    "11d":"15",
    "13d":"22",
    "50d":"26",
    "01n": "33",
    "02n": "35",
    "03n": "36",
    "04n":"38",
    "09n":"39",
    "10n":"40",
    "11n":"42",
    "13n":"43",
    "50n":"26",
}
const CityStateToCode={ 
    "Afghanistan": 'AF',
    'Aland Islands': 'AX',
    "Albania": 'AL',
    "Algeria": 'DZ',
    'American Samoa': 'AS',
    "Andorra": 'AD',
    "Angola": 'AO',
    "Anguilla": 'AI',
    "Antarctica": 'AQ',
    'Antigua And Barbuda': 'AG',
    "Argentina": 'AR',
    "Armenia": 'AM',
    "Aruba": 'AW',
    "Australia": 'AU',
    "Austria": 'AT',
    "Azerbaijan": 'AZ',
    "Bahamas": 'BS',
    "Bahrain": 'BH',
    "Bangladesh": 'BD',
    "Barbados": 'BB',
    "Belarus": 'BY',
    "Belgium": 'BE',
    "Belize": 'BZ',
    "Benin": 'BJ',
    "Bermuda": 'BM',
    "Bhutan": 'BT',
    "Bolivia": 'BO',
    'Bosnia And Herzegovina': 'BA',
    "Botswana": 'BW',
    'Bouvet Island': 'BV',
    "Brazil": 'BR',
    'British Indian Ocean Territory': 'IO',
    'Brunei Darussalam': 'BN',
    "Bulgaria": 'BG',
    'Burkina Faso': 'BF',
    "Burundi": 'BI',
    "Cambodia": 'KH',
    "Cameroon": 'CM',
    "Canada": 'CA',
    'Cape Verde': 'CV',
    'Cayman Islands': 'KY',
    'Central African Republic': 'CF',
    "Chad": 'TD',
    "Chile": 'CL',
    "China": 'CN',
    'Christmas Island': 'CX',
    'Cocos (Keeling) Islands': 'CC',
    "Colombia": 'CO',
    "Comoros": 'KM',
    "Congo": 'CG',
    'Congo, Democratic Republic': 'CD',
    'Cook Islands': 'CK',
    'Costa Rica': 'CR',
    'Cote D\'Ivoire': 'CI',
    "Croatia": 'HR',
    "Cuba": 'CU',
    "Cyprus": 'CY',
    'Czech Republic': 'CZ',
    "Denmark": 'DK',
    "Djibouti": 'DJ',
    "Dominica": 'DM',
    'Dominican Republic': 'DO',
    "Ecuador": 'EC',
    "Egypt": 'EG',
    'El Salvador': 'SV',
    'Equatorial Guinea': 'GQ',
    "Eritrea": 'ER',
    "Estonia": 'EE',
    "Ethiopia": 'ET',
    'Falkland Islands (Malvinas)': 'FK',
    'Faroe Islands': 'FO',
    "Fiji": 'FJ',
    "Finland": 'FI',
    "France": 'FR',
    'French Guiana': 'GF',
    'French Polynesia': 'PF',
    'French Southern Territories': 'TF',
    "Gabon": 'GA',
    "Gambia": 'GM',
    "Georgia": 'GE',
    "Germany": 'DE',
    "Ghana": 'GH',
    "Gibraltar": 'GI',
    "Greece": 'GR',
    "Greenland": 'GL',
    "Grenada": 'GD',
    "Guadeloupe": 'GP',
    "Guam": 'GU',
    "Guatemala": 'GT',
    "Guernsey": 'GG',
    "Guinea": 'GN',
    'Guinea-Bissau': 'GW',
    "Guyana": 'GY',
    "Haiti": 'HT',
    'Heard Island & Mcdonald Islands': 'HM',
    'Holy See (Vatican City State)': 'VA',
    "Honduras": 'HN',
    'Hong Kong': 'HK',
    "Hungary": 'HU',
    "Iceland": 'IS',
    "India": 'IN',
    "Indonesia": 'ID',
    'Iran, Islamic Republic Of': 'IR',
    "Iraq": 'IQ',
    "Ireland": 'IE',
    'Isle Of Man': 'IM',
    "Israel": 'IL',
    "Italy": 'IT',
    "Jamaica": 'JM',
    "Japan": 'JP',
    "Jersey": 'JE',
    "Jordan": 'JO',
    "Kazakhstan": 'KZ',
    "Kenya": 'KE',
    "Kiribati": 'KI',
    "Korea": 'KR',
    "Kuwait": 'KW',
    "Kyrgyzstan": 'KG',
    'Lao People\'s Democratic Republic': 'LA',
    "Latvia": 'LV',
    "Lebanon": 'LB',
    "Lesotho": 'LS',
    "Liberia": 'LR',
    'Libyan Arab Jamahiriya': 'LY',
    "Liechtenstein": 'LI',
    "Lithuania": 'LT',
    "Luxembourg": 'LU',
    "Macao": 'MO',
    "Macedonia": 'MK',
    "Madagascar": 'MG',
    "Malawi": 'MW',
    "Malaysia": 'MY',
    "Maldives": 'MV',
    "Mali": 'ML',
    "Malta": 'MT',
    'Marshall Islands': 'MH',
    "Martinique": 'MQ',
    "Mauritania": 'MR',
    "Mauritius": 'MU',
    "Mayotte": 'YT',
    "Mexico": 'MX',
    'Micronesia, Federated States Of': 'FM',
    "Moldova": 'MD',
    "Monaco": 'MC',
    "Mongolia": 'MN',
    "Montenegro": 'ME',
    "Montserrat": 'MS',
    "Morocco": 'MA',
    "Mozambique": 'MZ',
    "Myanmar": 'MM',
    "Namibia": 'NA',
    "Nauru": 'NR',
    "Nepal": 'NP',
    "Netherlands": 'NL',
    'Netherlands Antilles': 'AN',
    'New Caledonia': 'NC',
    'New Zealand': 'NZ',
    "Nicaragua": 'NI',
    "Niger": 'NE',
    "Nigeria": 'NG',
    "Niue": 'NU',
    'Norfolk Island': 'NF',
    'Northern Mariana Islands': 'MP',
    "Norway": 'NO',
    "Oman": 'OM',
    "Pakistan": 'PK',
    "Palau": 'PW',
    'Palestinian Territory, Occupied': 'PS',
    "Panama": 'PA',
    'Papua New Guinea': 'PG',
    "Paraguay": 'PY',
    "Peru": 'PE',
    "Philippines": 'PH',
    "Pitcairn": 'PN',
    "Poland": 'PL',
    "Portugal": 'PT',
    'Puerto Rico': 'PR',
    "Qatar": 'QA',
    "Reunion": 'RE',
    "Romania": 'RO',
    'Russian Federation': 'RU',
    "Rwanda": 'RW',
    'Saint Barthelemy': 'BL',
    'Saint Helena': 'SH',
    'Saint Kitts And Nevis': 'KN',
    'Saint Lucia': 'LC',
    'Saint Martin': 'MF',
    'Saint Pierre And Miquelon': 'PM',
    'Saint Vincent And Grenadines': 'VC',
    "Samoa": 'WS',
    'San Marino': 'SM',
    'Sao Tome And Principe': 'ST',
    'Saudi Arabia': 'SA',
    "Senegal": 'SN',
    "Serbia": 'RS',
    "Seychelles": 'SC',
    'Sierra Leone': 'SL',
    "Singapore": 'SG',
    "Slovakia": 'SK',
    "Slovenia": 'SI',
    'Solomon Islands': 'SB',
    "Somalia": 'SO',
    'South Africa': 'ZA',
    'South Georgia And Sandwich Isl.': 'GS',
    "Spain": 'ES',
    'Sri Lanka': 'LK',
    "Sudan": 'SD',
    "Suriname": 'SR',
    'Svalbard And Jan Mayen': 'SJ',
    "Swaziland": 'SZ',
    "Sweden": 'SE',
    "Switzerland": 'CH',
    'Syrian Arab Republic': 'SY',
    "Taiwan": 'TW',
    "Tajikistan": 'TJ',
    "Tanzania": 'TZ',
    "Thailand": 'TH',
    'Timor-Leste': 'TL',
    "Togo": 'TG',
    "Tokelau": 'TK',
    "Tonga": 'TO',
    'Trinidad And Tobago': 'TT',
    "Tunisia": 'TN',
    "Turkey": 'TR',
    "Turkmenistan": 'TM',
    'Turks And Caicos Islands': 'TC',
    "Tuvalu": 'TV',
    "Uganda": 'UG',
    "Ukraine": 'UA',
    'United Arab Emirates': 'AE',
    'United Kingdom': 'GB',
    'United States': 'US',
    'United States Outlying Islands': 'UM',
    "Uruguay": 'UY',
    "Uzbekistan": 'UZ',
    "Vanuatu": 'VU',
    "Venezuela": 'VE',
    'Viet Nam': 'VN',
    'Virgin Islands, British': 'VG',
    'Virgin Islands, U.S.': 'VI',
    'Wallis And Futuna': 'WF',
    'Western Sahara': 'EH',
    "Yemen": 'YE',
    "Zambia": 'ZM',
    "Zimbabwe": 'ZW' 
  
  }
const CodeToCityState = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayen',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};
const WheatherAPIbasicURL = "https://api.openweathermap.org/data/2.5/weather"

router.post('/cityWeather', async function (req, res) {
    const APPID = "693487d5ce7f67db0872c3ce4dbe3b15"
    let cityName=req.body.cityName
    let countryName=CityStateToCode[req.body.countryName]
    try {
        const weatherData =  await requestPromise(`${WheatherAPIbasicURL}?q=${cityName},${countryName}&units=metric&APPID=${APPID}`)
        const data= JSON.parse(weatherData)
        const IconModified= IconsTransfer[data.weather[0].icon]
        const weatherModified = {
            cityName: data.name , countryName: CodeToCityState[data.sys.country], temperature : data.main.temp,description:data.weather[0].description, icon: `https://uds-static.api.aero/weather/icon/lg/${IconModified}.png` , lon: data.coord.lon , lat: data.coord.lat
        }
        res.send(weatherModified)
    }
    catch (err) {
         res.status(400)
        res.send(err.message)
        
    }
})

router.post('/sites', async function(req, res){
    const APIkey = 'AIzaSyD_D-FODJApGj4CUB_V-ey9xzRH-gU2uRk'
    let placeObj = req.body
    let   cityName = placeObj.cityName
    let countryName = placeObj.countryName
    await requestPromise(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${cityName},${countryName}&inputtype=textquery&fields=formatted_address,geometry,icon,name,permanently_closed,photos,place_id,plus_code,types&key=${APIkey}&language=EN`,

    function(err, result){           
        result = JSON.parse(result.body)
        console.log(result);
        
        latitude = result.candidates[0].geometry.location.lat
        longitude = result.candidates[0].geometry.location.lng
        requestPromise(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&key=${APIkey}&pagetoken`,

            function(err, result){           
                result = JSON.parse(result.body)
                let places = result.results
                places = places.filter(p => places.indexOf(p) < 6 && places.indexOf(p) >0)                
                places = places.map(p =>   {return {siteName: p.name, address: p.vicinity, openningHours: p.opening_hours ? p.opening_hours.open_now : false, rate: p.rating}})

                res.send(places)
            })
    })
})

router.post('/favorites', function(req, res){
    let cityData = req.body    
    let city = new City(cityData)
    city.save()
    res.send(city)
})


module.exports = router
