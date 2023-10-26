import { Helmet } from "react-helmet-async";
import { Row, Col, Form, InputGroup, Button, Card } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import style from "../styles/Home.module.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Storage } from "aws-amplify";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const searchRef = useRef<HTMLInputElement | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const fetchArticles = async (keyword: string) => {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URI + `/article?keyword=${keyword}`,
      { withCredentials: true }
    );
    const newData = await Promise.all(
      response.data.map(async (o: any) => {
        const img_url = await getImageFromS3(o.imageKey);
        // console.log(img_url);
        return { ...o, img_url: img_url };
      })
    );
    return newData;
  };

  const { data, isLoading, mutate } = useMutation({
    mutationFn: async (keyword: string) => fetchArticles(keyword),
  });

  useEffect(() => {
    mutate("");
  }, [mutate]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const keyword = searchRef.current?.value || "";
    setIsSearch(true);
    setKeyword(keyword);
    mutate(keyword);
  };

  const getImageFromS3 = async (imageKey: string) => {
    try {
      const img_url = await Storage.get(imageKey).catch((err) =>
        console.log(err)
      );
      return img_url;
    } catch (err: any) {
      console.log(`Error:`, err.message);
    }
  };

  const goToThisArticle = (articleId: number) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <>
      <Helmet>
        <title>HowWiki | หน้าหลัก</title>
      </Helmet>

      <div className="d-flex justify-content-center">
        <div className={`${style.container}`}>
          <Row>
            <Col md={5} className="d-flex justify-content-center">
              <img
                alt="reading book HowWiki"
                src={`images/catreading.gif`}
                width={100}
                height={100}
                className={`${style.catgif}`}
              />
            </Col>
            <Col
              md={7}
              className="d-flex justify-content-center align-items-center"
            >
              <div className="text-center">
                <h1>เว็บไซต์บทความ</h1>
                <h1 className="mb-4">HowWiki</h1>
                <Form
                  className="d-flex justify-content-center"
                  onSubmit={(e) => handleSearch(e)}
                >
                  <InputGroup>
                    <Form.Control
                      ref={searchRef}
                      type="search"
                      placeholder="ค้นหาบทความ"
                      className={`${style.search_input}`}
                      aria-label="Search"
                    />
                    <Button type="submit" className={`${style.search_btn}`}>
                      <FaSearch />
                    </Button>
                  </InputGroup>
                </Form>
              </div>
            </Col>
          </Row>

          <hr />

          <Row>
            {" "}
            {!isSearch ? (
              <h3 className="text-center">บทความทั้งหมด</h3>
            ) : (
              <h3 className="text-center">บทความที่คุณค้นหาด้วย "{keyword}"</h3>
            )}
            <Col lg={12} className="pt-4">
              <Row>
                {!isLoading ? (
                  <>
                    {!data ||
                      (data.length === 0 && (
                        <div className="text-center">ไม่มีข้อมูล</div>
                      ))}
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
                                onClick={(event) =>
                                  goToThisArticle(a?.articleId)
                                }
                              >
                                ดูบทความ
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                  </>
                ) : (
                  <>Loading...</>
                )}
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Home;
