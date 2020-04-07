import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ImageTuple from './ImageTuple'
import ImageInput from './ImageInput'
import axios from 'axios'

if (process.env.NODE_ENV === 'development') {
   axios.defaults.baseURL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:3001"
}
else if (process.env.NODE_ENV === 'production') {
   axios.defaults.baseURL = process.env.REACT_APP_GATEWAY_URL
}

const App = () => {
  const [tuples, setTuples] = useState([])

  useEffect(() => {
    axios.get('/api/images').then((res) => setTuples(res.data))
  }, [])

  const onSubmit = (imageFile) => {
    const multipartData = new FormData()
    multipartData.append('image', imageFile)
    axios.post('/api/images', multipartData).then((res) => setTuples(res.data))
  }

  return (
    <Row noGutters>
      <Col xs="12" className="p-2">
        <Row noGutters>
          <Col className="p-2 border rounded" >
            <ImageInput onSubmit={onSubmit} />
          </Col>
        </Row>
      </Col>
      {
        tuples.map((tuple, index) => {
          return (
            <Col key={index} xs="12" xl="6" className="p-2">
              <ImageTuple url1={tuple.url1} url2={tuple.url2} />
            </Col>
          )
        })
      }
    </Row>
  )
}

export default App;
