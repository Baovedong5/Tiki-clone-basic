import { useEffect, useState } from "react";
import {
  callCategory,
  callUpdateBook,
  callUploadBookImg,
} from "../../../service/apiBook";
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Select,
  Upload,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const ModalUpdateBook = (props) => {
  const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();

  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [initForm, setInitForm] = useState(null);

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

  useEffect(() => {
    if (dataUpdate?._id) {
      const arrThumbnail = [
        {
          uid: uuidv4(),
          name: dataUpdate.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataUpdate.thumbnail
          }`,
        },
      ];

      const arrSlider = dataUpdate?.slider?.map((item) => {
        return {
          uid: uuidv4(),
          name: item,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        };
      });

      const init = {
        _id: dataUpdate._id,
        mainText: dataUpdate.mainText,
        author: dataUpdate.author,
        price: dataUpdate.price,
        category: dataUpdate.category,
        quantity: dataUpdate.quantity,
        sold: dataUpdate.sold,
        thumbnail: { fileList: arrThumbnail },
        slider: { fileList: arrSlider },
      };

      setInitForm(init);
      setDataThumbnail(arrThumbnail);
      setDataSlider(arrSlider);
      form.setFieldsValue(init);
    }
    return () => {
      form.resetFields();
    };
  }, [dataUpdate]);

  const onFinish = async (values) => {
    const { _id, mainText, author, price, sold, quantity, category } = values;
    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((item) => item.name);
    setIsSubmit(true);
    const res = await callUpdateBook(
      _id,
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
      setOpenModalUpdate(false);
      setDataSlider([]);
      setDataThumbnail([]);
      setInitForm(null);
      await props.fetchBook();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
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
      //copy previous state => upload multiple images
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

  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };

  const handlePreview = async (file) => {
    if (file.url && !file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      return;
    }
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };

  return (
    <>
      <Modal
        title="Cập nhật sách"
        open={openModalUpdate}
        onOk={() => {
          form.submit();
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        onCancel={() => {
          setOpenModalUpdate(false);
          form.resetFields();
          setInitForm(null);
          setDataUpdate(null);
        }}
        maskClosable={false}
        confirmLoading={isSubmit}
        width={"720px"}
      >
        <Divider />

        <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
          <Row gutter={15}>
            <Col hidden>
              <Form.Item hidden label="Id" labelCol={{ span: 24 }} name="_id">
                <Input />
              </Form.Item>
            </Col>
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
                <InputNumber min={0} style={{ width: "100%" }} disabled />
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
                  defaultFileList={initForm?.thumbnail?.fileList ?? []}
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
                  defaultFileList={initForm?.slider?.fileList ?? []}
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

export default ModalUpdateBook;
