import React, { useState } from 'react'

function Me() {
    const [callbackCode, setCallbackCode] = useState("");
    const [accessToken, setAccessToken] = useState("");

    // handle "sync account" redirect user to the spotify login to get callback code
    const handleSync = async () => {

    }

    //exchange callback code for access token
    

    // fetch user specific data



  return (
    <div>Me</div>
  )
}

export default Me