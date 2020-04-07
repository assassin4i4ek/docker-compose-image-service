import 'core-js/stable'
import 'regenerator-runtime/runtime'
import express from 'express'
import multer from 'multer'
import axios from 'axios'
import FormData from 'form-data'
import path from 'path'
import fs from 'fs'
import ip from 'ip'
import os from 'os'
import Eureka from 'eureka-js-client'

//Business logic
const STORAGE_URL = process.env.STORAGE_URL || 'http://localhost:3002'
const PROCESSOR_URL = process.env.PROCESSOR_URL || 'http://localhost:3003'
const tuples = []

//Multer setup
const upload = multer({ storage: multer.memoryStorage() })

//Express setup
const port = process.env.PORT || 3001
const app = express()

//Eureka client setup
const eurekaClient = new Eureka({
    instance: {
        instanceId: `${os.hostname()}:gateway:${port}`,
        app: 'gateway',
        hostName: os.hostname(),
        ipAddr: ip.address(),
        port: {
            '$': port,
            '@enabled': true,
        },
        vipAddress: process.env.SERVICE_ALIAS || 'gateway',
        dataCenterInfo: {
            '@class': `com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo`,
            name: `MyOwn`
        }
    },
    eureka: {
        host: process.env.EUREKA_HOST || 'localhost',
        port: process.env.EUREKA_PORT || 8761,
        servicePath: '/eureka/apps',
        maxRetries: Number.POSITIVE_INFINITY,
    }
})

//Routes setup
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', "*")
    // res.set('Access-Control-Allow-Credentials', 'true')
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    // res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')//, Access-Control-Allow-Headers, Authorization, X-Requested-With')
    next()
})

app.get('/api/images', (req, res) => {
    res.send(tuples)
})

app.post('/api/images', upload.single('image'), async (req, res) => {
    console.log('POST /api/images')
    //process histo
    const srcData = new FormData()
    srcData.append('src', req.file.buffer, req.file.originalname)
    const histogram = await axios.post(PROCESSOR_URL + '/api/process/histo', srcData, {
        headers: srcData.getHeaders(),
        responseType: 'arraybuffer'
    }).then(res => res.data)

    const imageData = new FormData()
    imageData.append('image', req.file.buffer, req.file.originalname)
    const imageUri = await axios.post(STORAGE_URL + '/api/images', imageData, { headers: imageData.getHeaders() }).then(res => res.data.uri)

    const histoData = new FormData()
    histoData.append('histo', Buffer.from(histogram), 'histo_' + req.file.originalname)
    const histoUri = await axios.post(STORAGE_URL + '/api/histos', histoData, { headers: histoData.getHeaders() }).then(res => res.data.uri)
    tuples.unshift({ url1: '/storage/api/images/' + imageUri, url2: '/storage/api/histos/' + histoUri })
    console.log(`received pair: (${imageUri}, ${histoUri})`)
    
    res.send(tuples)
})

if (process.env.NODE_ENV === 'production') {
    //react app
    app.use(express.static(path.join(__dirname, 'app')));

    app.get('/', (req, res) => {
        console.log('GET /')
        res.sendFile(path.join(__dirname, 'app', 'index.html'));
    });
}

app.listen(port, () => {
    console.log('started gateway server on ' + ip.address() + ':' + port)
    console.log('registering eureka service')
    eurekaClient.start()
})

process.on('exit', () => {
    eurelaClient.stop()
})
