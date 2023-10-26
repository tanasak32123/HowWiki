import { useState, useRef } from "react";
import style from "../styles/ConfirmSignup.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Auth } from "aws-amplify";
import { FaCheck } from "react-icons/fa";
import Countdown from "react-countdown";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const ConfirmSignup: React.FC = () => {
  const { username } = useParams();

  const codeRef = useRef<HTMLInputElement | null>(null);
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const [isResend, setIsResend] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = codeRef.current?.value;
    if (!code) {
      (feedbackRef.current as HTMLDivElement).innerText =
        "โปรดใส่รหัสยืนยันของคุณ";
      (codeRef.current as HTMLDivElement).classList.add("is-invalid");
      return;
    }

    try {
      await Auth.confirmSignUp(username!, code!);
      //   console.log("confirming sign up success");
      toast.success("ยืนยันตัวตนสำเร็จ");
      navigate("/login");
    } catch (error: any) {
      // console.log("error confirming sign up", error.message);
      if (
        error.message ===
        "Invalid verification code provided, please try again."
      ) {
        (feedbackRef.current as HTMLDivElement).innerText =
          "รหัสยืนยันของคุณไม่ถูกต้อง โปรดลองอีกครั้ง";
        (codeRef.current as HTMLInputElement).value = "";
        (codeRef.current as HTMLInputElement).classList.add("is-invalid");
        return;
      }
    }
  };

  const resendConfirmationCode = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      await Auth.resendSignUp(username!);
      setIsResend(true);
    } catch (err: any) {
      console.log("error resending code: ", err.message);
    }
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

  const renderer = ({ seconds }: { seconds: number }) => {
    return <>{seconds} s</>;
  };

  const onComplete = () => {
    setIsResend(false);
  };

  return (
    <>
      <Helmet>
        <title>Chat | ยืนยันตัวตน</title>
      </Helmet>
      <div className={`${style.card} p-4`}>
        <Form className={`${style.form}`} onSubmit={(e) => handleConfirm(e)}>
          <h1 className="text-center">ยืนยันตัวตน</h1>
          <Form.Group className="mb-3" controlId="code">
            <Form.Label>รหัสยืนยันตัวตน</Form.Label>
            <Form.Control
              ref={codeRef}
              className="mb-1"
              name="code"
              type="text"
              onChange={(e: any) => onChange(e)}
              placeholder="กรอกรหัสยืนยันของคุณ"
            />
            <Form.Text className="text-muted">
              รหัสยืนยันตัวตนนี้ได้ถูกส่งไปยังอีเมลของคุณเรียบร้อยแล้ว
            </Form.Text>
            <Form.Control.Feedback
              id="code-feedback"
              ref={feedbackRef}
              type="invalid"
            ></Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            ยืนยัน
          </Button>

          <div className="d-flex align-items-center">
            <small className="me-2">คุณได้รับรหัสยืนยันตัวตนหรือไม่?</small>
            {!isResend ? (
              <Link
                to={""}
                className="btn btn-link p-0"
                onClick={(e) => resendConfirmationCode(e)}
              >
                ส่งอีกครั้ง
              </Link>
            ) : (
              <small className="text-success">
                <FaCheck />
                &nbsp;ส่งเรียบร้อย{" "}
                <Countdown
                  date={Date.now() + 30 * 1000}
                  renderer={renderer}
                  onComplete={onComplete}
                />
              </small>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

export default ConfirmSignup;
