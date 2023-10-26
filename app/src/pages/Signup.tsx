import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import style from "../styles/Signup.module.css";
import { useRef } from "react";
import { register } from "../features/auth/authSlice";
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confPasswordRef = useRef<HTMLInputElement | null>(null);

  const usernameFeedbackRef = useRef<HTMLDivElement | null>(null);
  const emailFeedbackRef = useRef<HTMLDivElement | null>(null);
  const passwordFeedbackRef = useRef<HTMLDivElement | null>(null);
  const confPasswordFeedbackRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();

  interface IUserData {
    username: string;
    email: string;
    password: string;
  }

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValidated = true;
    const username = usernameRef.current?.value!;
    const email = emailRef.current?.value!;
    const password = passwordRef.current?.value!;
    const confPassword = confPasswordRef.current?.value!;

    if (!username) {
      usernameRef.current?.classList.add(`is-invalid`);
      (usernameFeedbackRef.current as HTMLDivElement).innerText =
        "โปรดกรอกชื่อผู้ใช้ของคุณ";
      isValidated = false;
    }

    if (!email) {
      emailRef.current?.classList.add(`is-invalid`);
      (emailFeedbackRef.current as HTMLDivElement).innerText =
        "โปรดกรอกอีเมลของคุณ";
      isValidated = false;
    }

    if (!password) {
      passwordRef.current?.classList.add(`is-invalid`);
      (passwordFeedbackRef.current as HTMLDivElement).innerText =
        "โปรดกรอกรหัสผ่านของคุณ";
      isValidated = false;
    }
    // else if (
    //   password.match(
    //     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    //   )
    // ) {
    //   passwordRef.current?.classList.add(`is-invalid`);
    //   (passwordFeedbackRef.current as HTMLDivElement).innerText =
    //     "รหัสผ่านของคุณยังไม่ผ่านเกณฑ์";
    //   isValidated = false;
    // }

    if (!confPassword) {
      confPasswordRef.current?.classList.add(`is-invalid`);
      (confPasswordFeedbackRef.current as HTMLDivElement).innerText =
        "โปรดกรอกยืนยันรหัสผ่านของคุณ";
      isValidated = false;
    }

    if (password && confPassword && password !== confPassword) {
      passwordRef.current?.classList.add(`is-invalid`);
      (passwordFeedbackRef.current as HTMLDivElement).innerText =
        "รหัสผ่านกับยืนยันรหัสผ่านไม่ตรงกัน";
      (confPasswordRef.current as HTMLInputElement).value = "";
      isValidated = false;
    }

    const userData: IUserData = {
      username,
      email,
      password,
    };

    if (!isValidated) return;

    dispatch(register(userData))
      .then(() => {
        toast.success("สมัครสมาชิกสำเร็จ");
        navigate(`/signup/confirm/${username}`);
      })
      .catch((err) => {
        console.log(err.message);
        if (
          (err.message as string).startsWith(
            "Password did not conform with policy:"
          )
        ) {
          passwordRef.current?.classList.add(`is-invalid`);
          (passwordFeedbackRef.current as HTMLDivElement).innerText =
            "รหัสผ่านของคุณยังไม่ผ่านเกณฑ์";
          (confPasswordRef.current as HTMLInputElement).value = "";
        }
      });
  };

  return (
    <div className={`${style.card} p-4`}>
      <Form className={`${style.form}`} onSubmit={(e) => handleSignup(e)}>
        <h1 className="text-center">สมัครสมาชิก</h1>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>ชื่อผู้ใช้</Form.Label>
          <Form.Control
            ref={usernameRef}
            type="username"
            placeholder="กรอกชื่อผู้ใช้ของคุณ"
          />
          <Form.Control.Feedback
            ref={usernameFeedbackRef}
            type="invalid"
          ></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>อีเมลผู้ใช้</Form.Label>
          <Form.Control
            ref={emailRef}
            type="email"
            placeholder="กรอกอีเมลผู้ใช้ของคุณ"
          />
          <Form.Control.Feedback
            ref={emailFeedbackRef}
            type="invalid"
          ></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>รหัสผ่าน</Form.Label>
          <Form.Control
            ref={passwordRef}
            type="password"
            placeholder="กรอกรหัสผ่านของคุณ"
          />
          <Form.Text className="text-muted">
            รหัสผ่านต้องมีอย่างน้อย 8 ตัวและประกอบด้วยตัวเลข ตัวอักษรพิเศษ
            ตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก อย่างน้อยอย่างละ 1 ตัว
          </Form.Text>
          <Form.Control.Feedback
            ref={passwordFeedbackRef}
            type="invalid"
          ></Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>ยืนยันรหัสผ่าน</Form.Label>
          <Form.Control
            ref={confPasswordRef}
            type="password"
            placeholder="กรอกรหัสผ่านของคุณอีกครั้ง"
          />
          <Form.Control.Feedback
            ref={confPasswordFeedbackRef}
            type="invalid"
          ></Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          สมัครสมาชิก
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
