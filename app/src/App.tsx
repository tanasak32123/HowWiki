// import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ConfirmSignup from "./pages/ConfirmSignup";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import CreateArticle from "./pages/CreateArticle";
import OwnArticle from "./pages/OwnArticle";
import axios from "axios";
import ArticleDetail from "./pages/ArticleDetail";

// Add a request interceptor
axios.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // config.headers.Authorization = null;
    delete axios.defaults.headers.common["Authorization"];
    /*if setting null does not remove `Authorization` header then try
      delete axios.defaults.headers.common['Authorization'];
    */
  }
  return config;
});

// Configure Amplify in index file or root file
Amplify.configure({
  Auth: {
    identityPoolId: "ap-southeast-1:b2ccd994-c964-4bc4-97e3-301e315ceeac",
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
  },
  Storage: {
    AWSS3: {
      bucket: "react-bucket-tanasak",
      region: awsExports.REGION,
    },
  },
});

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/confirm/:username" element={<ConfirmSignup />} />
        <Route path="/article/create" element={<CreateArticle />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/myarticle" element={<OwnArticle />} />
      </Routes>
    </>
  );
}

export default App;
