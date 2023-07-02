import { Button, Col, Form, Input, Row } from "antd";

const InputSearch = (props) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    let query = "";

    if (values.fullName) {
      query += `&fullName=/${values.fullName}/i`;
    }
    if (values.email) {
      query += `&email=/${values.email}/i`;
    }
    if (values.phone) {
      query += `&phone=/${values.phone}/i`;
    }

    if (props) {
      props.handleSearch(query);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      style={{ margin: "13px", marginBottom: "0px", marginTop: "0px" }}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label={"Name"} name={"fullName"} labelCol={{ span: 24 }}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label={"Email"} name={"email"} labelCol={{ span: 24 }}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={"Số điện thoại"}
            name={"phone"}
            labelCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} style={{ display: "flex", justifyContent: "right" }}>
          <Form.Item>
            <Button
              type="primary"
              style={{ marginRight: "13px" }}
              htmlType="submit"
            >
              Search
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={onReset}>Clear</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default InputSearch;
