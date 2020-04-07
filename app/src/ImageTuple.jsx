import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

const ImageTuple = ({ url1, url2 }) => {
    return <Row className="px-1 py-2 border rounded" noGutters>
        <Col xs="6" className="px-1 d-flex justify-content-center">
            <Image src={url1} style={{ maxHeight: '200px' }} fluid />
        </Col>
        <Col xs="6" className="px-1 d-flex justify-content-center">
            <Image src={url2} style={{ maxHeight: '200px' }} fluid />
        </Col>
    </Row>
}

export default ImageTuple