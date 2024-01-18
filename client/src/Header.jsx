import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link to="/" className="logo">Mi Blog</Link>
            <nav>
                {username && (
                    <>
                        <Link to="/create">Crear nuevo</Link>
                        <a onClick={logout}>Logout ({username})</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}




    
    
    // import { Link } from "react-router-dom";
// import { useContext, useEffect } from "react";
// import { UserContext } from "./UserContext";

// export default function Header() {
//     const { setUserInfo, userInfo } = useContext(UserContext);

//     useEffect(() => {
//         fetch('http://localhost:5173/profile', {
//              credentials: 'include', //included those crdentials from server
//         })
//             .then(response => { 
//                 response.json().then(userInfo => {
//                     setUserInfo(userInfo);
//                 });
//             });
//     }, []);

//     function logout() {
//         fetch('http://localhost:2024/logout', {
//             credentials: 'include',
//             method: 'POST',
//         });
//         setUserInfo(null);
//     }

//     const username = userInfo?.username;

//     return (
//         <header className="navegar">
//             <Link to="/" className="logo">Mi Blog</Link>
//             <nav className="navegar">
//                 {username && (
//                     <>
//                         <Link to="/create">Crear nuevo</Link>
//                         <a onClick={logout}>Logout ({username})</a>
//                     </>
//                 )}
//                 {!username && (
//                     <>
//                         <Link to="/login">Login</Link>
//                         <Link to="/register">Register</Link>
//                     </>
//                 )}
//             </nav>
//         </header>
//     );
// }