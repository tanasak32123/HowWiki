import React from "react";
import { Helmet } from "react-helmet-async";
import style from "../styles/OwnArticle.module.css";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Storage } from "aws-amplify";

const OwnArticle: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["myarticle"],
    queryFn: async () => {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URI + `/article/author`,
        { withCredentials: true }
      );
      const newData = await Promise.all(
        response.data.map(async (o: any) => {
          const img_url = await getImageFromS3(o.imageKey);
          return { ...o, img_url: img_url };
        })
      );
      return newData;
    },
  });

  const goToThisArticle = (articleId: number) => {
    navigate(`/article/${articleId}`);
  };

  const goToCreateArticle = () => {
    navigate("/article/create");
  };

  const getImageFromS3 = async (imageKey: string) => {
    try {
      const img_url = await Storage.get(imageKey);
      // console.log(img_url);
      return img_url;
    } catch (err: any) {
      console.log(`Error:`, err.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>HowWiki | บทความของฉัน</title>
      </Helmet>

      <Card className={`${style.card}`}>
        <Card.Body>
          <div className="d-flex">
            <h1 className="me-auto mb-0">บทความของคุณ</h1>
            <button
              type="button"
              className="btn btn-success"
              onClick={goToCreateArticle}
            >
              <FaPlus /> เพิ่ม
            </button>
          </div>
          <hr />
          {isLoading ? (
            <>
              <div
                className={`d-flex justify-content-center align-items-center ${style.empty}`}
              >
                กำลังโหลด...
              </div>
            </>
          ) : (
            <>
              {!data || data?.length === 0 ? (
                <div
                  className={`d-flex justify-content-center align-items-center ${style.empty}`}
                >
                  ไม่มีบทความ
                </div>
              ) : (
                <>
                  <Row>
                    {data &&
                      data.map((a: any) => (
                        <Col
                          lg={4}
                          md={6}
                          sm={12}
                          key={a?.articleId}
                          className="d-flex justify-content-center mb-3"
                        >
                          <Card style={{ width: "18rem" }}>
                            <Card.Img
                              variant="top"
                              src={a?.img_url}
                              className={`${style.img_card}`}
                            />
                            <Card.Body>
                              <Card.Title>{a?.title}</Card.Title>
                              <Card.Text className={`${style.card_text}`}>
                                {a?.textKey}
                              </Card.Text>
                              <Button
                                variant="primary"
                                onClick={() => goToThisArticle(a?.articleId)}
                              >
                                ดูบทความ
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                  </Row>
                </>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default OwnArticle;
