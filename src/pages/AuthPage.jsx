// import React, { useState } from 'react'
// import Login from '../components/Login';
// import Register from '../components/Register';

// export default function AuthPage(props) {

//     const [authType, setAuthType] = useState(props.authType);

//     return (
//         <>
//             {authType === "login" ? <Login /> : <Register />}
//         </>
//     )
// }
import Login from "../components/Login"
import Register from "../components/Register"

export default function AuthPage(props) {
  const { authType } = props

  return <>{authType === "login" ? <Login /> : <Register />}</>
}
