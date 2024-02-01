import React, { useState } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { usePeer } from "../context/peer";

const Authetication = () => {
  const handleSetUser = (decoded) =>{
    setUser({name:decoded.name,picture:decoded.picture});
    console.log("done")
  }


  const {
   user,
   setUser
  } = usePeer();

  return (
    <>
    {
      user.name ?
      <>
        <h3>{user.name}</h3>
        <img src={user.picture} />
      </>
      :
      <>
      <GoogleOAuthProvider clientId="717963751372-rj20has3ni4ismq2ufk7ob6n9rnh4iti.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  var decoded = jwtDecode(credentialResponse.credential);
                  handleSetUser(decoded);
                  console.log(decoded);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
      </GoogleOAuthProvider>
      </>
    }
    </>
  )
}

export default Authetication