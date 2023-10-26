import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import style from "../styles/CreateArticle.module.css";
import { Button, Card, Form } from "react-bootstrap";
import { Storage } from "aws-amplify";
import { useAppSelector } from "../app/hooks";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const imageTypes = ["image/png", "image/jpeg", "image/webp"];

const CreateArticle: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const imageFileRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const imageFileFeedbackRef = useRef<HTMLDivElement | null>(null);
  const titleFeedbackRef = useRef<HTMLDivElement | null>(null);
  const textFeedbackRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let isValidated = true;
    const title = titleRef.current?.value;
    const text = textRef.current?.value;
    const files = imageFileRef.current?.files;

    if (!title) {
      (titleFeedbackRef.current as HTMLDivElement).innerText =
        "โปรดใส่หัวข้อเรื่อง";
      (titleRef.current as HTMLInputElement).classList.add(`is-invalid`);
      isValidated = false;
    }

    if (!text) {
      (textFeedbackRef.current as HTMLDivElement).innerText =
        "โปรดใส่เนื้อหาของบทความ";
      (textRef.current as HTMLTextAreaElement).classList.add(`is-invalid`);
      isValidated = false;
    }

    if (files && files.length! > 0) {
      // console.log(files[0]);
      const file = files[0];
      if (!imageTypes.includes(file.type)) {
        (imageFileFeedbackRef.current as HTMLDivElement).innerText =
          "ไฟล์รูปภาพต้องเป็นประเภท PNG, JPEG หรือ WEBP เท่านั้น";
        (imageFileRef.current as HTMLInputElement).classList.add(`is-invalid`);
        isValidated = false;
      } else if (file.size > 1024 * 1024) {
        (imageFileFeedbackRef.current as HTMLDivElement).innerText =
          "ไฟล์รูปภาพต้องมีขนาดได้ไม่เกิน 1 MB";
        (imageFileRef.current as HTMLInputElement).classList.add(`is-invalid`);
        isValidated = false;
      }
    } else {
      (imageFileFeedbackRef.current as HTMLDivElement).innerText =
        "โปรดเลือกไฟล์รูปภาพ";
      (imageFileRef.current as HTMLInputElement).classList.add(`is-invalid`);
      isValidated = false;
    }

    if (!isValidated) return;

    try {
      const response = await Storage.put(
        files![0].name + `_` + user.username + `_` + Date.now(),
        files![0],
        {
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          },
        }
      )
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err.message);
          throw Error(`Error:`, err.messages);
        });

      const article = {
        title,
        imageKey: response.key,
        textKey: text,
      };

      await axios.post(
        process.env.REACT_APP_BACKEND_URI + `/article/author`,
        article,
        {
          withCredentials: true,
        }
      );
      // console.log(res);
      toast.success("สร้างบทความสำเร็จ");
      navigate("/myarticle");
    } catch (err: any) {
      console.log(`Error:`, err.message);
    }
  };

  const inputOnChange = (e: React.ChangeEvent) => {
    e.preventDefault();
    if ((e.currentTarget as HTMLTextAreaElement | HTMLInputElement).value) {
      document
        .querySelector(`#${e.currentTarget.id}`)
        ?.classList.remove("is-invalid");
      (
        document.querySelector(
          `#${e.currentTarget.id}-feedback`
        ) as HTMLDivElement
      ).innerText = "";
    } else {
      document
        .querySelector(`#${e.currentTarget.id}`)
        ?.classList.add("is-invalid");
    }
  };

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>HowWiki | เขียนบทความ</title>
      </Helmet>

      <Card className={`${style.card}`}>
        <Card.Body>
          <div className="d-flex">
            <h1 className="me-auto mb-0">เขียนบทความ</h1>
            <Button variant="link" onClick={navigateBack}>
              ย้อนกลับ
            </Button>
          </div>
          <hr />

          <Form>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>หัวข้อเรื่อง</Form.Label>
              <Form.Control
                ref={titleRef}
                type="text"
                onChange={(e) => inputOnChange(e)}
                placeholder="หัวข้อเรื่องของบทความ"
              />
              <Form.Control.Feedback
                ref={titleFeedbackRef}
                id="title-feedback"
                type="invalid"
              ></Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="image" className="mb-3">
              <Form.Label>ไฟล์รูปภาพ</Form.Label>
              <Form.Control
                ref={imageFileRef}
                onChange={(e) => inputOnChange(e)}
                type="file"
              />
              <Form.Control.Feedback
                ref={imageFileFeedbackRef}
                id="image-feedback"
                type="invalid"
              ></Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="textKey">
              <Form.Label>เนื้อหาบทความ</Form.Label>
              <Form.Control
                ref={textRef}
                onChange={(e) => inputOnChange(e)}
                as="textarea"
                rows={3}
                placeholder="เนื้อหาบทความ ...."
              />
              <Form.Control.Feedback
                ref={textFeedbackRef}
                id="textKey-feedback"
                type="invalid"
              ></Form.Control.Feedback>
            </Form.Group>
          </Form>

          <Button onClick={(e) => handleSubmit(e)}>สร้าง</Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default CreateArticle;
