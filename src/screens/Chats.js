import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Offcanvas from 'react-bootstrap/Offcanvas';


export default function Chats() {
    const currEmail = localStorage.getItem('mailId');

    const [show, setShow] = useState(false);
    const [data, setdata] = useState([]);
    const [chatnum, setchatnum] = useState('none');
    const [curr_chat, setcurr_chat] = useState([]);
    const [curr_status, setcurr_status] = useState('');
    const [message, setmessage] = useState('');
    const [req_mailid, setreq_mailid] = useState('none');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleMessage = (e) => {
        setmessage(e.target.value);
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/sendmessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chat_id: chatnum, sender_mailid: currEmail, message: message })
        });
        const json = await response.json();
        if (!json.success) {
            alert('Failed to send message');
        }
        else {
            setmessage('');
        }
    }

    useEffect(() => {
        fetch('http://localhost:5000/api/getuserchatrooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: currEmail })
        })
            .then((res) => res.json())
            .then((data) => {
                setdata(data.chatrooms);
            })
    }, [currEmail]);

    const getchat = async (chatid, mailId) => {
        setchatnum(chatid);
        setreq_mailid(mailId);
        const response = await fetch('http://localhost:5000/api/getchat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chat_id: chatid })
        });
        const json = await response.json();
        setcurr_chat(json.msgdata);
        setcurr_status(json.status);
    }

    const handleUpdate = async (chatid) => {
        const response = await fetch('http://localhost:5000/api/updatestatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chat_id: chatid })
        });
        const json = await response.json();
        setcurr_status(json.status);
    }

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
                    {
                        chatnum === 'none' ? <div>
                            <ToastContainer className="position-static">
                                {
                                    data.map((item) => {
                                        return (
                                            <Toast key={item.chatid} bg={'secondary'}>

                                                <Toast.Header closeButton={false}>

                                                    <strong className="me-auto">{item.username}</strong>
                                                    <small className="text-muted">{item.depdate}</small>

                                                </Toast.Header>
                                                <Toast.Body><button className='button-solid' onClick={() => getchat(item.chatid, item.mailid)}>
                                                    {item.fromloc} to {item.toloc} in {item.vtype}
                                                </button></Toast.Body>

                                            </Toast>
                                        )
                                    })
                                }
                            </ToastContainer>
                        </div> : <div>
                            <button onClick={() => setchatnum('none')}> close </button>
                            <hr></hr>
                            <>
                                {
                                    curr_chat.map((item) => {
                                        return (
                                            <div>
                                                <p>{item.sender} - {item.message}</p>
                                            </div>
                                        )
                                    })
                                }
                            </>
                            <hr></hr>
                            {curr_status === '0' && localStorage.getItem('mailId') === req_mailid &&
                                <button className='button-solid' onClick={() => handleUpdate(chatnum)}>Send Request</button>
                            }
                            {curr_status === '1' && localStorage.getItem('mailId') !== req_mailid &&
                                <button className='button-solid' onClick={() => handleUpdate(chatnum)}>Accept Request</button>
                            }
                            {curr_status === '2' &&
                                <button className='button-solid'>Request Accepted</button>
                            }
                            <hr></hr>
                            <div>
                                <form onSubmit={handleSendMessage}>
                                    <input type="text" placeholder='Type your message' className="form-control" onChange={handleMessage}></input>
                                    <button type="submit" className='button-solid'>Send</button>
                                </form>
                            </div>
                        </div>
                    }

                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}