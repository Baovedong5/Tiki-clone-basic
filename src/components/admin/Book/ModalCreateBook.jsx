import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import {
  callCategory,
  callCreateBook,
  callUploadBookImg,
} from "../../../service/apiBook";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const ModalCreateBook = (props) => {
  const { openModal, setOpenModal } = props;

  const [form] = Form.useForm();

  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    const res = await callCategory();
    if (res && res.data) {
      const data = res.data.map((item) => {
        return { value: item, label: item };
      });
      setListCategory(data);
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handlePreview = (file) => {
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };

  const handleChange = (info, type) => {
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };

  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataThumbnail([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi khi upload file");
    }
  };

  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi khi upload file");
    }
  };

  const onFinish = async (values) => {
    if (dataThumbnail.length === 0) {
      notification.error({
        message: "Đã xảy ra lỗi",
        description: "Vui lòng upload ảnh thumbnail",
      });
      return;
    }

    if (dataSlider.length === 0) {
      notification.error({
        message: "Đã xảy ra lỗi",
        description: "Vui lòng upload ảnh silder",
      });
    }
    const { mainText, author, price, sold, quantity, category } = values;
    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((item) => item.name);
    setIsSubmit(true);
    const res = await callCreateBook(
      thumbnail,
      slider,
      mainText,
      author,
      price,
      sold,
      quantity,
      category
    );
    if (res && res.data) {
      message.success("Tạo mới thành công");
      form.resetFields();
      setOpenModal(false);
      setDataSlider([]);
      setDataThumbnail([]);
      await props.fetchBook();
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title="Thêm mới book"
        open={openModal}
        onOk={() => {
          form.submit();
        }}
        okText="Tạo mới"
        cancelText="Hủy"
        onCancel={() => {
          setOpenModal(false);
          form.resetFields();
        }}
        maskClosable={false}
        confirmLoading={isSubmit}
        width={"720px"}
      >
        <Divider />

        <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                label="Tên sách"
                name="mainText"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên sách!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tác giả"
                name="author"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tác giả!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Giá tiền"
                name="price"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá tiền!",
                  },
                ]}
              >
                <InputNumber
                  addonAfter="VND"
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Thể loại"
                name="category"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập thể loại!",
                  },
                ]}
              >
                <Select options={listCategory} allowClear showSearch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Đã bán"
                name="sold"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng đã bán!" },
                ]}
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh Thumbnail"
                name="thumbnail"
              >
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  onPreview={handlePreview}
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh Slider"
                name="slider"
              >
                <Upload
                  multiple={true}
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUploadFileSlider}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "slider")}
                  onRemove={(file) => handleRemoveFile(file, "slider")}
                  onPreview={handlePreview}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default ModalCreateBook;
