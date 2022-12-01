import type { ProColumns } from '@ant-design/pro-table';
import { Popconfirm} from 'antd';
import type { Sample } from '@/domains/Sample.d';
import { buildUpdateSampleModal } from '@/pages/project/detail/Modals';
import {DeleteOutlined} from "@ant-design/icons";
import { FormattedMessage } from 'umi';

export function buildColumn(updateForm: any, doUpdate: any, doDelete: any) {
  const columns: ProColumns<Sample>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      key: 'sampleNo',
      title: <FormattedMessage id='sample.no'/>,
      dataIndex: 'sampleNo',
      copyable: true,
    },
    {
      key: 'dim1',
      title: 'dim1',
      dataIndex: 'dim1',
      copyable: true,
    },
    {
      key: 'dim2',
      title: 'dim2',
      dataIndex: 'dim2',
      copyable: true,
    },
    {
      key: 'projectId',
      title: <FormattedMessage id='project'/>,
      dataIndex: 'projectId',
      copyable: true,
    },
    {
      key: 'createDate',
      title: <FormattedMessage id='create.date'/>,
      dataIndex: 'createDate',
      valueType: 'dateTime',
      hideInSearch: true,
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.createDate > b?.createDate ? -1 : 1;
      },
    },
    {
      key: 'option',
      title: <FormattedMessage id='option'/>,
      valueType: 'option',
      fixed: 'right',
      width: '220px',
      hideInSearch: true,
      render: (text, sample) => [
        buildUpdateSampleModal(updateForm, doUpdate, sample),
        <Popconfirm placement={'topLeft'} title={<FormattedMessage id='confirm.delete'/>} key="delete" onConfirm={() => doDelete(sample.id)}>
          <a style={{color: "red"}}><DeleteOutlined /><FormattedMessage id='delete'/></a>
        </Popconfirm>
      ],
    },
  ];

  return columns;
}
