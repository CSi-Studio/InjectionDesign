import { Table, Tag } from 'antd';
import { AdductColumns } from '@/components/Commons/Columns';

export function buildAdductTable(adductList: [], mass: number) {
  <Table
    title={() => <Tag color="red">Current M: {mass}</Tag>}
    style={{ marginTop: 5 }}
    size="small"
    dataSource={adductList}
    columns={AdductColumns}
    rowKey="ionForm"
    pagination={false}
  />;
}
