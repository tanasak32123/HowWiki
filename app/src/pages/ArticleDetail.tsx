import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { Storage } from "aws-amplify";
import style from "../styles/ArticleDetail.module.css";
import { Helmet } from "react-helmet-async";

const ArticleDetail: React.FC = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: [`article_${id}`],
    queryFn: async () => {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URI + `/article/articleid/${id}`,
        { withCredentials: true }
      );
      const imgKey = response.data.imageKey;
      const img_url = await getImageFromS3(imgKey);
      return { ...response.data, img_url: img_url };
    },
  });

  //   console.log(data);

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

  //   console.log(data);

  if (isLoading) return <>กำลังโหลด...</>;

  //   console.log(data);

  return (
    <>
      <Helmet>
        <title>HowWiki | บทความ {data?.title}</title>
      </Helmet>

      <div className={`${style.container}`}>
        <figure>
          <blockquote className="blockquote">
            <h1>{data?.title}</h1>
          </blockquote>
          <figcaption className="blockquote-footer">
            ผู้แต่ง: {data?.authorName}
          </figcaption>
        </figure>

        <div className="text-center mb-4">
          <img
            src={data?.img_url}
            alt={`pic of ${data?.title}`}
            className={`${style.article_img}`}
          />
        </div>

        <div>
          <p>&emsp;&emsp;{data?.textKey}</p>
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;
