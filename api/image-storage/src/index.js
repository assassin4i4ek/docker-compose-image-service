import express from 'express'
import multer from 'multer'
import path from 'path'
import ip from 'ip'
import os from 'os'
import Eureka from 'eureka-js-client'

//Multer setup
const imageStorage = process.env.IMAGE_STORAGE || 'storage/images'
const imageUpload = multer({ dest: imageStorage })
const histoStorage = process.env.HISTO_STORAGE || 'storage/histos'
const histoUpload = multer({ dest: histoStorage })

//App setup
const app = express()
const port = process.env.PORT || 3002

//Eureka client setup
const eurekaClient = new Eureka({
    instance: {
        instanceId: `${os.hostname()}:storage:${port}`,
        app: 'storage',
        hostName: os.hostname(),
        ipAddr: ip.address(),
        port: {
            '$': port,
            '@enabled': true,
        },
        vipAddress: process.env.SERVICE_ALIAS || 'storage',
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

app.get('/api/images/:uri', (req, res) => {
    console.log('GET /api/images/' + req.params.uri)
    res.sendFile(path.resolve(imageStorage + '/' + req.params.uri))
})

app.post('/api/images', imageUpload.single('image'), (req, res) => {
    console.log('POST /api/images')
    console.log('saved image file with uri: ' + req.file.filename)
    res.send({ uri: req.file.filename })
})

app.get('/api/histos/:uri', (req, res) => {
    console.log('GET /api/histos/' + req.params.uri)    
    res.sendFile(path.resolve(histoStorage + '/' + req.params.uri))
})

app.post('/api/histos', histoUpload.single('histo'), (req, res) => {
    console.log('POST /api/histos')
    console.log('saved histo file with uri: ' + req.file.filename)
    res.send({ uri: req.file.filename })
})

app.listen(port, () => {
    console.log('started image storage server on ' + port)
    console.log('registering eureka service')
    eurekaClient.start()
})

process.on('exit', () => {
    eurelaClient.stop()
})
