import React from 'react'
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';


export default function Chats() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow} className="me-2">
                Offcanvas
            </Button>
            <Offcanvas show={show} onHide={handleClose} placement='end'>
                <Offcanvas.Header closeButton>
                    {/* <Offcanvas.Title>Offcanvas</Offcanvas.Title> */}
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ToastContainer className="position-static">
                        <Toast bg={'secondary'}>
                            <Toast.Header closeButton={false}>
                                <strong className="me-auto">Bootstrap</strong>
                                <small className="text-muted">just now</small>
                            </Toast.Header>
                            <Toast.Body>See? Just like this.</Toast.Body>
                        </Toast>
                        <Toast bg={'secondary'}>
                            <Toast.Header closeButton={false}>
                                <strong className="me-auto">Bootstrap</strong>
                                <small className="text-muted">2 seconds ago</small>
                            </Toast.Header>
                            <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
                        </Toast>
                    </ToastContainer>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}