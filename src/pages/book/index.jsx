import { useLocation } from "react-router-dom";
import ViewDetail from "../../components/Book/ViewDetail";
import { useEffect, useState } from "react";
import { fetchBookById } from "../../service/apiBook";

const BookPage = () => {
  const [dataBook, setDataBook] = useState();
  let location = useLocation();

  console.log(">>> data book", dataBook);

  let params = new URLSearchParams(location.search);
  const id = params?.get("id");

  useEffect(() => {
    fetchBookBy(id);
  }, [id]);

  const fetchBookBy = async (_id) => {
    const res = await fetchBookById(_id);
    if (res && res.data) {
      let raw = res.data;
      raw.items = getImages(raw);
      setTimeout(() => {
        setDataBook(raw);
      }, 3000);
    }
  };

  const getImages = (raw) => {
    const images = [];
    if (raw.thumbnail) {
      images.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          raw.thumbnail
        }`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          raw.thumbnail
        }`,
        originalClass: "original-images",
        thumbnailClass: "thumbnail-images",
      });
    }
    if (raw.slider) {
      raw.slider?.map((item) => {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          originalClass: "original-images",
          thumbnailClass: "thumbnail-images",
        });
      });
    }
    return images;
  };

  return (
    <>
      <ViewDetail dataBook={dataBook} />
    </>
  );
};

export default BookPage;
