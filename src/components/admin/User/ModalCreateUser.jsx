import { Divider, Form, Input, Modal, message, notification } from "antd";
import { useState } from "react";
import { callCreateUser } from "../../../service/apiService";

const ModalCreateUser = (props) => {
  const { openModal, setOpenModal } = props;
  const [isSubmit, setIsSubmit] = useState(false);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { fullName, password, email, phone } = values;
    setIsSubmit(true);
    const res = await callCreateUser(fullName, password, email, phone);
    if (res && res.data) {
      message.success("Tạo mới thành công");
      form.resetFields();
      setOpenModal(false);
      await props.fetchUser();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title="Thêm mới người dùng"
        maskClosable={true}
        open={openModal}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => setOpenModal(false)}
        okText={"Tạo mới"}
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
          <Form.Item
            label="Tên hiển thị"
            labelCol={{ span: 24 }}
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            labelCol={{ span: 24 }}
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Email"
            labelCol={{ span: 24 }}
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input />
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

export default ModalCreateUser;
