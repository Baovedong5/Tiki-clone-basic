import { Badge, Descriptions, Drawer } from "antd";
import moment from "moment";

const UserViewDetail = (props) => {
  const { openViewDetail, dataViewDetail, setOpenViewDetail } = props;
  return (
    <>
      <Drawer
        title="Xem chi tiết User"
        placement="right"
        open={openViewDetail}
        onClose={() => setOpenViewDetail(false)}
        maskClosable={false}
        width={"55vw"}
      >
        <Descriptions title="Thông tin User" bordered column={2}>
          <Descriptions.Item label="Id">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">
            {dataViewDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {dataViewDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {dataViewDetail?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Role" span={2}>
            <Badge status="processing" text={dataViewDetail?.role} />
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {moment(dataViewDetail?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {moment(dataViewDetail?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default UserViewDetail;
