import { Row, Col, Rate, Divider } from "antd";
import "./book.scss";
import ImageGallery from "react-image-gallery";
import { useRef, useState } from "react";
import ModalGallery from "./ModalGallery";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import BookLoader from "./BookLoader";

const ViewDetail = (props) => {
  const { dataBook } = props;
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const refGallery = useRef(null);

  const images = dataBook?.items ?? [];

  const handleOnClickImage = () => {
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-book"
        style={{ maxWidth: 1230, margin: "0 auto" }}
      >
        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
          {dataBook && dataBook._id ? (
            <Row gutter={[20, 20]}>
              <Col md={10} sm={0} xs={0}>
                <ImageGallery
                  items={images}
                  ref={refGallery}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  renderLeftNav={() => <></>}
                  renderRightNav={() => <></>}
                  slideOnThumbnailOver={true}
                  onClick={() => handleOnClickImage()}
                />
              </Col>
              <Col md={14} sm={24}>
                <Col md={0} sm={24} xs={24}>
                  <ImageGallery
                    ref={refGallery}
                    items={images}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    renderLeftNav={() => <></>}
                    renderRightNav={() => <></>}
                    showThumbnails={false}
                  />
                </Col>
                <Col span={24}>
                  <div className="author">
                    Tác giả: <a href="#">{dataBook?.author}</a>{" "}
                  </div>
                  <div className="title">{dataBook?.mainText}</div>
                  <div className="rating">
                    <Rate
                      value={5}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 12 }}
                    />
                    <span className="sold">
                      <Divider type="vertical" />
                      {dataBook?.sold}
                    </span>
                  </div>
                  <div className="price">
                    <span className="currency">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(dataBook?.price)}
                    </span>
                  </div>
                  <div className="delivery">
                    <div>
                      <span className="left-side">Vận chuyển</span>
                      <span className="right-side">Miễn phí vận chuyển</span>
                    </div>
                  </div>
                  <div className="quantity">
                    <span className="left-side">Số lượng</span>
                    <span className="right-side">
                      <button>
                        <MinusOutlined />
                      </button>
                      <input defaultValue={1} />
                      <button>
                        <PlusOutlined />
                      </button>
                    </span>
                  </div>
                  <div className="buy">
                    <button className="cart">
                      <BsCartPlus className="icon-cart" />
                      <span>Thêm vào giỏ hàng</span>
                    </button>
                    <button className="now">Mua ngay</button>
                  </div>
                </Col>
              </Col>
            </Row>
          ) : (
            <BookLoader />
          )}
        </div>
        <ModalGallery
          isOpen={isOpenModalGallery}
          setIsOpen={setIsOpenModalGallery}
          currentIndex={currentIndex}
          items={images}
          title={"hardcode"}
        />
      </div>
    </div>
  );
};

export default ViewDetail;
