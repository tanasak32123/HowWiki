// import axios from "axios";
import { Auth } from "aws-amplify";

// const API_URL = `${process.env.REACT_APP_BACKEND_URI}/api/v5/auth/`;

interface IUserData {
  username: string;
  email: string;
  password: string;
}

interface ILoginData {
  username: string;
  password: string;
}

const fetchUser = async () => {
  try {
    const user = await Auth.currentUserInfo();
    localStorage.setItem("user", user);
    return user;
  } catch (err) {
    console.log("error fetching user:", err);
  }
};

//Register user
const register = async (userData: IUserData) => {
  try {
    await Auth.signUp({
      username: userData.username,
      password: userData.password,
      attributes: {
        email: userData.email,
      },
      autoSignIn: {
        // optional - enables auto sign in after user is confirmed
        enabled: true,
      },
    });
    // console.log(user);
  } catch (error: any) {
    console.log("error signing up:", error);
    throw Error(error.message);
  }
};

//Login user
const login = async (userData: ILoginData) => {
  try {
    await Auth.signIn(userData.username, userData.password);
    const user = await Auth.currentUserInfo();
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem(
      "access_token",
      (await Auth.currentSession()).getAccessToken().getJwtToken()
    );
    return user;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

//Logout user
const logout = async () => {
  try {
    localStorage.removeItem("user");
    await Auth.signOut({ global: true });
  } catch (error) {
    console.log("error signing out: ", error);
  }
};

const authService = {
  register,
  logout,
  login,
  fetchUser,
};

export default authService;
