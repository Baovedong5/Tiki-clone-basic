import { Button, Col, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { callFetchListUser } from "../../../service/apiService";
import InputSearch from "./InputSearch";
import {
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import "./table.scss";
import UserViewDetail from "./UserViewDetail";

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("");

  const [dataViewDetail, setDataViewDetail] = useState({});
  const [openViewDetail, setOpenViewDetail] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, filter, sortQuery]);

  const columns = [
    {
      title: "Id",
      // dataIndex: "_id",
      render: (text, record, index) => {
        console.log(">>> record", record);
        return (
          <a
            href="#"
            onClick={() => {
              setDataViewDetail(record);
              setOpenViewDetail(true);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <>
            <button>Delete</button>
          </>
        );
      },
    },
  ];

  const renderHeader = (
    <div className="table-header">
      <div className="title">Table List Users</div>
      <div>
        <Button className="btn" type="primary" icon={<ImportOutlined />}>
          Import
        </Button>
        <Button className="btn" type="primary" icon={<ExportOutlined />}>
          Export
        </Button>
        <Button className="btn" type="primary" icon={<PlusOutlined />}>
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

  const fetchUser = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchListUser(query);
    if (res && res.data) {
      setListUser(res.data.result);
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
      setCurrent(1);
    }
    if (sorter && sorter.field) {
      console.log("sort", sorter);
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
          <InputSearch handleSearch={handleSearch} />
        </Col>
        <Col span={24}>
          <Table
            style={{ margin: "15px", marginTop: "0px" }}
            caption={renderHeader}
            loading={isLoading}
            columns={columns}
            dataSource={listUser}
            onChange={onChange}
            rowKey="_id"
            pagination={{
              current: current,
              pageSize: pageSize,
              total: total,
              showTotal: (total, range) => {
                return (
                  <div>
                    {range[0]} - {range[1]} trên {total} row
                  </div>
                );
              },
            }}
          />
        </Col>
      </Row>

      <UserViewDetail
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
      />
    </>
  );
};

export default UserTable;