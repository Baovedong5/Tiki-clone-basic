import { Button, Col, Form, Input, Row } from "antd";

const InputSearchBook = (props) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    let query = "";

    if (values.mainText) {
      query += `mainText=/${values.mainText}/i`;
    }
    if (values.author) {
      query += `author=/${values.author}/i`;
    }
    if (values.category) {
      query += `category=/${values.category}/i`;
    }

    if (props) {
      props.handleSearch(query);
    }
  };

  const onRest = () => {
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
          <Form.Item
            label={"Tên Sách"}
            name={"mainText"}
            labelCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label={"Tác Giả"} name={"author"} labelCol={{ span: 24 }}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={"Thể loại"}
            name={"category"}
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
            <Button onClick={onRest}>Clear</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default InputSearchBook;
