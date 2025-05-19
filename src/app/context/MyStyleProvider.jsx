import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
const UserStyleProvider = createContext();

export const MyStyleProvider = ({ children }) => {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;

	const [userStyle, setUserStyle] = useState(null);

	useEffect(() => {
		const getStyle = async () => {
			const downloadedStyles = await axios.get(`${apiUrl}/api/profile/me`);
			if (downloadedStyles.data) {
                console.log(downloadedStyles.data)
				setUserStyle(downloadedStyles.data);
			}
		};
        getStyle();
	}, []);

	return (
		<UserStyleProvider.Provider value={{ userStyle, setUserStyle }}>
			{children}
		</UserStyleProvider.Provider>
	);
};

export const useMyStyle = () => useContext(UserStyleProvider);
