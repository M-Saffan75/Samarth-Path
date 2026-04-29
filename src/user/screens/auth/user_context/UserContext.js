import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    const updateUser = (data) => setUserData(data);
    const clearUser = () => setUserData(null);

    return (
        <UserContext.Provider value={{ userData, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);