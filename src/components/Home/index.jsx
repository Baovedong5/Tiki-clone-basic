import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  InputNumber,
  Pagination,
  Rate,
  Row,
  Spin,
  Tabs,
} from "antd";
import "./home.scss";
import { useEffect, useState } from "react";
import { callCategory, callFetchBook } from "../../service/apiBook";

const Home = () => {
  const [form] = Form.useForm();

  const [listCategory, setListCategory] = useState([]);

  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-sold");

  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initCategory();
  }, []);

  const initCategory = async () => {
    const res = await callCategory();
    if (res && res.data) {
      const data = res.data.map((item) => {
        return { value: item, label: item };
      });

      setListCategory(data);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filter, sortQuery]);

  const fetchBook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchBook(query);

    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleOnChangePagination = (pagination) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
  };

  const handleChangeFilter = (changedValues, values) => {
    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`category=${f}`);
      } else {
        setFilter("");
      }
    }
  };

  const onFinish = (values) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
      if (values?.category?.length) {
        const cate = values?.category?.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
  };

  const items = [
    {
      key: "sort=-sold",
      label: `Phổ biến`,
      children: <></>,
    },
    {
      key: "sort=-updatedAt",
      label: `Hàng Mới`,
      children: <></>,
    },
    {
      key: "sort=price",
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: "sort=-price",
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="homepage-container"
        style={{ maxWidth: 1276, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Col md={4} sm={0} xs={0}>
            <div
              style={{ background: "#fff", borderRadius: 5, padding: "12px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 500 }}>
                  <FilterTwoTone /> Bộ lọc tìm kiếm
                </span>
                <ReloadOutlined
                  title="reset"
                  onClick={() => {
                    form.resetFields();
                    setFilter("");
                    setSortQuery("sort=-sold");
                  }}
                />
              </div>
              <Divider />
              <Form
                form={form}
                onFinish={onFinish}
                onValuesChange={(changedValues, values) =>
                  handleChangeFilter(changedValues, values)
                }
              >
                <Form.Item
                  name="category"
                  label="Danh mục sản phẩm"
                  labelCol={{ span: 24 }}
                >
                  <Checkbox.Group>
                    {listCategory.map((item, index) => {
                      return (
                        <Col
                          span={24}
                          key={`index-${index}`}
                          style={{ padding: "7px 0" }}
                        >
                          <Checkbox value={item.value}>{item.label}</Checkbox>
                        </Col>
                      );
                    })}
                  </Checkbox.Group>
                </Form.Item>
                <Divider />
                <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                  <Row gutter={[10, 10]} style={{ width: "100%" }}>
                    <Col xl={11} md={24}>
                      <Form.Item name={["range", "from"]}>
                        <InputNumber
                          name="from"
                          min={0}
                          placeholder="đ TỪ"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={2} md={0}>
                      <div> - </div>
                    </Col>
                    <Col xl={11} md={24}>
                      <Form.Item name={["range", "to"]}>
                        <InputNumber
                          name="to"
                          min={0}
                          placeholder="đ ĐẾN"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div>
                    <Button
                      onClick={() => form.submit()}
                      style={{ width: "100%" }}
                      type="primary"
                    >
                      Áp dụng
                    </Button>
                  </div>
                </Form.Item>
                <Divider />
                <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                  <div>
                    <Rate
                      value={5}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text"></span>
                  </div>
                  <div>
                    <Rate
                      value={4}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={3}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={2}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={1}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col md={20} xs={24}>
            <Spin spinning={isLoading} tip="Loading...">
              <div
                style={{ padding: "20px", background: "#fff", borderRadius: 5 }}
              >
                <Row>
                  <Tabs
                    defaultActiveKey="sort=-sold"
                    items={items}
                    onChange={(value) => {
                      {
                        setSortQuery(value);
                      }
                    }}
                    style={{ overflowX: "auto" }}
                  />
                </Row>
                <Row className="customize-row">
                  {listBook?.map((item, index) => {
                    return (
                      <div className="column" key={`index-${index}`}>
                        <div className="wrapper">
                          <div className="thumbnail">
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/images/book/${item.thumbnail}`}
                              alt="thumbnail book"
                            />
                          </div>
                          <div className="text">{item.mainText}</div>
                          <div className="price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item?.price ?? 0)}
                          </div>
                          <div className="rating">
                            <Rate
                              value={5}
                              disabled
                              style={{ color: "#ffce3d", fontSize: 10 }}
                            />
                            <span>Đã bán {item.sold}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Row>
                <Divider />
                <Row style={{ display: "flex", justifyContent: "center" }}>
                  <Pagination
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    responsive
                    onChange={(p, s) =>
                      handleOnChangePagination({ current: p, pageSize: s })
                    }
                  />
                </Row>
              </div>
            </Spin>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
