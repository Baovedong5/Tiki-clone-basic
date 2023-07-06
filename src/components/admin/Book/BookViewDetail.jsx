import { Drawer, Badge, Descriptions, Divider, Modal, Upload } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const BookViewDetail = (props) => {
  const { openDetail, setOpenDetail, dataDetail, setDataDetail } = props;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (dataDetail) {
      let imgThumbnail = {},
        imgSlider = [];
      if (dataDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: dataDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataDetail.thumbnail
          }`,
        };
      }
      if (dataDetail.slider && dataDetail.slider.length > 0) {
        dataDetail.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [dataDetail]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    console.log(">>> file ", file);
    setPreviewImage(file.url);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <>
      <Drawer
        title="Xem chi tiết sách"
        width="50vw"
        open={openDetail}
        onClose={() => {
          setOpenDetail(false), setDataDetail(null);
        }}
        maskClosable={false}
      >
        <Descriptions title="Thông tin sách" bordered column={2}>
          <Descriptions.Item label="Id">{dataDetail?._id}</Descriptions.Item>
          <Descriptions.Item label="Tên sách">
            {dataDetail?.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {dataDetail?.author}
          </Descriptions.Item>
          <Descriptions.Item label="Giá tiền">
            {dataDetail?.price}
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng">
            {dataDetail?.quantity}
          </Descriptions.Item>
          <Descriptions.Item label="Đã bán">
            {dataDetail?.sold}
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại" span={2}>
            <Badge status="processing" text={dataDetail?._id} />
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {moment(dataDetail?.createdAt).format("DD-MM-YYYY HH-mm-ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {moment(dataDetail?.updatedAt).format("DD-MM-YYYY HH-mm-ss")}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">Ảnh Books</Divider>

        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        ></Upload>

        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </Modal>
      </Drawer>
    </>
  );
};

export default BookViewDetail;
