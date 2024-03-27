import React from 'react'


export const Profile = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    return (
        <div>
        <h1>Profile for {currentUser.name} </h1>
        </div>
    )
    }