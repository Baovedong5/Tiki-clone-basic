import { Divider, Form, Input, Modal, message, notification } from "antd";
import { useEffect, useState } from "react";
import { callUpdateUser } from "../../../service/apiService";

const ModalUpdateUser = (props) => {
  const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } =
    props;
  const [isSubmit, setIsSubmit] = useState(false);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { _id, fullName, phone } = values;
    setIsSubmit(true);
    const res = await callUpdateUser(_id, fullName, phone);
    if (res && res.data) {
      message.success("Cập nhật thành công");
      setOpenModalUpdate(false);
      await props.fetchUser();
    } else {
      notification.error({
        description: res.message,
        message: "Đã có lỗi xảy ra",
      });
    }
    setIsSubmit(false);
  };

  useEffect(() => {
    form.setFieldsValue(dataUpdate);
  }, [dataUpdate]);

  return (
    <>
      <Modal
        title="Cập nhật người dùng"
        maskClosable={false}
        open={openModalUpdate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalUpdate(false);
          setDataUpdate(null);
        }}
        okText={"Cập nhật"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
      >
        <Divider />
        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item hidden labelCol={{ span: 24 }} label="Id" name="_id">
            <Input />
          </Form.Item>

          <Form.Item
            label="Tên hiển thị"
            labelCol={{ span: 24 }}
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            labelCol={{ span: 24 }}
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            labelCol={{ span: 24 }}
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalUpdateUser;
