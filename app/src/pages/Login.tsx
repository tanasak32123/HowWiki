import { useRef, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { Helmet } from "react-helmet-async";
import style from "../styles/Login.module.css";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice";
// import FadeIn from "react-fade-in";
import Lottie from "lottie-react";
import loadingData from "../assets/loading.json";

const loadingStyle = {
  padding: "0px",
  margin: "0px",
  height: "30px",
  width: "30px",
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const usernameFeedbackRef = useRef<HTMLDivElement | null>(null);
  const passwordFeedbackRef = useRef<HTMLDivElement | null>(null);
  const feedbackRef = useRef<HTMLElement | null>(null);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValidated = true;
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username) {
      (usernameFeedbackRef.current as HTMLDivElement).innerText =
        "โปรดใส่ชื่อผู้ใช้ของคุณ";
      (usernameRef.current as HTMLDivElement).classList.add("is-invalid");
      isValidated = false;
    }

    if (!password) {
      (passwordFeedbackRef.current as HTMLDivElement).innerText =
        "โปรดใส่รหัสผ่านของคุณ";
      (passwordRef.current as HTMLDivElement).classList.add("is-invalid");
      isValidated = false;
    }

    if (!isValidated) return;

    const userLoginData = {
      username: username!,
      password: password!,
    };

    setLoading(true);
    dispatch(login(userLoginData))
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        if (err.message === "Incorrect username or password.") {
          (feedbackRef.current as HTMLElement).innerText =
            "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
        }
        if (err.message === "User is not confirmed.") {
          navigate(`/signup/confirm/${username}`);
        }
      });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      document
        .querySelector(`#${e.target.name}`)
        ?.classList.remove("is-invalid");
      (
        document.querySelector(`#${e.target.name}-feedback`) as HTMLDivElement
      ).innerText = "";
    } else {
      document.querySelector(`#${e.target.name}`)?.classList.add("is-invalid");
    }
    (feedbackRef.current as HTMLElement).innerText = "";
  };

  return (
    <>
      <Helmet>
        <title>Chat | เข้าสู่ระบบ</title>
      </Helmet>

      <div className={`${style.card} p-4`}>
        <h1 className="text-center">เข้าสู่ระบบ</h1>
        <Form onSubmit={(e) => handleSignup(e)}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>ชื่อผู้ใช้</Form.Label>
            <Form.Control
              ref={usernameRef}
              name="username"
              type="text"
              placeholder="กรอกชื่อผู้ใช้ของคุณ"
              onChange={(e: any) => onChange(e)}
            />
            <Form.Control.Feedback
              id="username-feedback"
              ref={usernameFeedbackRef}
              type="invalid"
            ></Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>รหัสผ่าน</Form.Label>
            <Form.Control
              ref={passwordRef}
              name="password"
              type="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              onChange={(e: any) => onChange(e)}
            />
            <Form.Control.Feedback
              id="password-feedback"
              ref={passwordFeedbackRef}
              type="invalid"
            ></Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex align-items-center mb-2">
            <Button variant="primary" type="submit" className="me-2">
              เข้าสู่ระบบ{" "}
            </Button>
            {loading && (
              <Lottie style={loadingStyle} animationData={loadingData} />
            )}
            <small
              ref={feedbackRef}
              id="feedback"
              className="text-danger"
            ></small>
          </div>

          <div>
            <small>
              คุณมีบัญชีแล้วหรือไม่?{" "}
              <Link to={`/signup`} className={`${style.link}`}>
                สมัครสมาชิกที่นี่
              </Link>
            </small>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Login;
