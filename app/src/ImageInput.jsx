import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import dragAndDropImage from './drag-and-drop.jpg'
import { useState } from 'react'

const ImageInput = ({ onSubmit }) => {
    const [dragAndDropSrc, setDragAndDropSrc] = useState(dragAndDropImage)
    const [image, setImage] = useState(null)

    const submit = (e) => {
        e.preventDefault()
        if (image) {
            onSubmit(image)
            URL.revokeObjectURL(dragAndDropSrc)
            setImage(null)
            setDragAndDropSrc(dragAndDropImage)
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    const handleDrop = (event) => {
        event.preventDefault()
        const image = new Array(...event.dataTransfer.files).find((file) => file.type.match('image'))
        setImage(image)
        setDragAndDropSrc(URL.createObjectURL(image))
    }

    return (
        <Form onSubmit={submit}>
            <Form.Group controlId="imageFile" className="d-flex justify-content-center">
                <Image src={dragAndDropSrc} onDrop={handleDrop} onDragOver={handleDragOver} style={{ height: "200px" }} fluid />
                <Form.Control type="file" accept="image/*" hidden />
            </Form.Group>
            <Button type="submit" className="w-100">Submit</Button>
        </Form>
    )
}

export default ImageInput