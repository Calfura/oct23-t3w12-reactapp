import { useState, createContext, useContext } from "react";


const UserDataContext = createContext(null);
const UserDispatchContext = createContext(null);

export function useUserData(){
    return useContext(UserDataContext)
};


export function useUserDispatch(){
    return useContext(UserDispatchContext);
};



export default function UserProvider({children}){
    
    // Encodeds string to send to the backend
    // lets us stay logged in without a password
    const [userJwt, setUserJwt] = useState("");
    
    // Object of payload data,
    // lets us render data about the user AND
    // make more requests like get user by ID
    const [decodedJwt, setDecodedUserJwt] = useState({});
    
    const makeSignupRequest = async (username, password) => {
        let signUpResult = await fetch("http://localhost:3000/users/", {
            method: "POST",
            body: JSON.stringify({username, password}),
            // Needs Content-Type to allow JSON to be sent to the server
            headers: {
                'Content-Type': 'application/json'
            }
        });

        signUpResult = await signUpResult.json();
    
        console.log("Sign up result is: " + JSON.stringify(signUpResult));
    
        // Express route for POST /users/ returns object with JWT as a property
        setUserJwt(signUpResult.jwt);
        setDecodedUserJwt(signUpResult.decodedJwt);
    }
    
	const makeLoginRequest = async (username, password) => {
		let loginResult = await fetch("http://localhost:3000/users/jwt", {method: "POST",body: {username, password}});

		console.log("Login result is: " + JSON.stringify(loginResult));

		// Express route for POST /users/jwt returns object with JWT as a property
		setUserJwt(loginResult.jwt);
		setDecodedUserJwt(loginResult.decodedJwt);
	}
    
    return <UserDataContext.Provider value={{userJwt, decodedJwt}}>
        <UserDispatchContext.Provider value={{
            // functions to make request to sign up and log in and so on
            makeSignupRequest,
            makeLoginRequest
        }}>
            {children}
        </UserDispatchContext.Provider>
    </UserDataContext.Provider>
}