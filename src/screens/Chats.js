import React, { useState, useEffect } from 'react'
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Offcanvas from 'react-bootstrap/Offcanvas';
import io from "socket.io-client";

export default function Chats(props) {

    const [data, setdata] = useState([]);
    const [date, setdate] = useState('');
    const [chatnum, setchatnum] = useState('none');
    const [curr_chat, setcurr_chat] = useState([]);
    const [curr_status, setcurr_status] = useState('');
    const [message, setmessage] = useState('');
    const [req_mailid, setreq_mailid] = useState('none');

    const [userId, setuserId] = useState('');
    const [currEmail, setcurrEmail] = useState('');
    const [userType, setuserType] = useState('');

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        async function authorize() {
            const response = await fetch('http://localhost:5000/api/extractUserData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ authToken: localStorage.getItem('authToken') })
            });
            const json = await response.json()
            setuserId(json.userId);
            setcurrEmail(json.userEmail);
            setuserType(json.userType);

            const nextresponse = await fetch('http://localhost:5000/api/getuserchatrooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: json.userId })
            });
            const nextjson = await nextresponse.json()
            setdata(nextjson.chatrooms);
        }
        authorize();
    }, []);

    useEffect(() => {
        const s = io("http://localhost:5000")
        setSocket(s)
    
        return () => {
          s.disconnect()
        }
      }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("message recieved", (newMessageRecieved) => {
            setcurr_chat([...curr_chat, newMessageRecieved]);
        });
    }, [socket, curr_chat]);

    useEffect(() => {
        if (!socket) return;

        socket.on("status recieved", (basket) => {
            setcurr_status(basket.status);
        });
    }, [socket]);

    const handleMessage = (e) => {
        setmessage(e.target.value);
    }

    const handleDate = (e) => {
        setdate(e.target.value);
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
            var sdata = { chat: chatnum, sender: currEmail, message: message };
            setmessage(".");
            socket.emit("new message", sdata);
            setcurr_chat([...curr_chat, sdata]);
        }
    }

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

        socket.emit("get-chatroom", chatid);
    }

    const handleUpdate = async (chatid) => {
        if (userType === 'Driver' && date === '') {
            alert('Enter date first');
        }
        else {
            const response = await fetch('http://localhost:5000/api/updatestatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chat_id: chatid, date: date, userId: userId })
            });
            const json = await response.json();
            setcurr_status(json.status);

            var basket = { chatId: chatid, status: json.status};
            socket.emit("update-status", basket);
        }
    }

    return (
        <>
            <Offcanvas show={props.show} onHide={props.handleClose} placement='end'>
                <Offcanvas.Header closeButton>
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
                                                <Toast.Body><button
                                                    className='button-solid'
                                                    onClick={() => getchat(item.chatid, item.mailid)}>
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
                            {curr_status === '0' && currEmail === req_mailid &&
                                <button
                                    className='button-solid'
                                    onClick={() => handleUpdate(chatnum)}>Send Request</button>
                            }
                            {curr_status === '1' && currEmail !== req_mailid &&
                                <>
                                    <button
                                        className='button-solid'
                                        onClick={() => handleUpdate(chatnum)}>Accept Request</button>
                                    {
                                        userType === 'Driver' &&
                                        <div>
                                            <label for="name">When you will be free?</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="date" name='depdate'
                                                value={date}
                                                onChange={handleDate}></input>
                                        </div>
                                    }
                                </>
                            }
                            {curr_status === '2' &&
                                <button className='button-solid'>Request Accepted</button>
                            }
                            <hr></hr>
                            <div>
                                <form onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        placeholder='Type your message'
                                        className="form-control"
                                        onChange={handleMessage}></input>
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