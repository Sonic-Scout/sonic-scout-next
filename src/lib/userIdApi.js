'use client';

import {v4 as uuid } from "uuid";

export const generateUserId = () => {
    const UUID = uuid();
    
    // Save UUID to localStorage (only available in browser)
    if (typeof window !== 'undefined') {
        localStorage.setItem('userId', UUID);
    }
    return UUID;
};


export const getUserId = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userId');
    }
    return generateUserId();
};