import { Button, Col, Row, Table, message } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import InputSearchBook from "./InputSearchBook";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { callFetchBook } from "../../../service/apiBook";
import BookViewDetail from "./BookViewDetail";
import ModalCreateBook from "./ModalCreateBook";

const BookTable = () => {
  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("");

  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState({});

  const [openModal, setOpenModal] = useState(false);

  const columns = [
    {
      title: "Id",
      render: (text, record, index) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenDetail(true);
              setDataDetail(record);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      render: (text, record, index) => {
        return <>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
      sorter: true,
    },
    {
      title: "Action",
      width: 100,
      render: (text, record, index) => {
        return (
          <>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", margin: "0 10px" }}
            />

            <DeleteTwoTone twoToneColor="#ff4d4f" />
          </>
        );
      },
    },
  ];

  const renderHeader = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "15px",
      }}
    >
      <div>Table List Books</div>
      <div style={{ display: "flex", gap: "14px" }}>
        <Button className="btn" type="primary" icon={<ExportOutlined />}>
          Export
        </Button>
        <Button
          className="btn"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenModal(true)}
        >
          Thêm mới
        </Button>
        <Button
          className="btn"
          type="ghost"
          onClick={() => {
            setFilter("");
            setSortQuery("");
          }}
        >
          <ReloadOutlined />
        </Button>
      </div>
    </div>
  );

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

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }

    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
  };

  const handleSearch = (query) => {
    setFilter(query);
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearchBook handleSearch={handleSearch} />
        </Col>
        <Col span={24}>
          <Table
            style={{ margin: "15px", marginTop: "0px" }}
            caption={renderHeader}
            loading={isLoading}
            columns={columns}
            dataSource={listBook}
            onChange={onChange}
            rowKey="_id"
            pagination={{
              current: current,
              pageSize: pageSize,
              total: total,
              showTotal: (total, range) => {
                return (
                  <>
                    {range[0]} - {range[1]} trên {total}
                  </>
                );
              },
            }}
          />
        </Col>
      </Row>
      <BookViewDetail
        openDetail={openDetail}
        setOpenDetail={setOpenDetail}
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
      />

      <ModalCreateBook
        openModal={openModal}
        setOpenModal={setOpenModal}
        fetchBook={fetchBook}
      />
    </>
  );
};

export default BookTable;
