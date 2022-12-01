import type { ProColumns } from '@ant-design/pro-table';
import type { Project } from '@/domains/Project.d';
import {Popconfirm} from 'antd';
// @ts-ignore
import { Link } from 'umi';
import { buildUpdateModal } from '@/pages/project/Modals';
import { transToTags } from '@/components/Commons/Columns';
import {DeleteOutlined} from "@ant-design/icons";
import {RightSquareOutlined} from "@ant-design/icons";
import { FormattedMessage } from 'umi';

export function buildColumn(updateForm: any, doUpdate: any, doDelete: any) {
  const columns: ProColumns<Project>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      key: 'name',
      title: <FormattedMessage id='name'/>,
      dataIndex: 'name',
      tip: 'Unique',
      copyable: true,
    },
    {
      key: 'alias',
      title: <FormattedMessage id='alias'/>,
      dataIndex: 'alias',
      copyable: true,
    },

    {
      key: 'platform',
      title: <FormattedMessage id='analytical.platform'/>,
      dataIndex: 'platform',
      hideInSearch: true,
      render: (text, entity) => {
        return transToTags(entity.platforms);
      },
    },
    {
      key: 'owner',
      title: <FormattedMessage id='owner'/>,
      dataIndex: 'owner',
      hideInSearch: true,
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
      render: (text, project) => [
        <Link
          key="goProject"
          to={{
            pathname: '/project/detail',
            search: `?projectId=${project.id}`,
          }}
        >
          <a><RightSquareOutlined/><FormattedMessage id='view.project'/></a>
        </Link>,
        buildUpdateModal(updateForm, doUpdate, project),
        <Popconfirm placement={'topLeft'} title={<FormattedMessage id='confirm.delete'/>} key="delete" onConfirm={() => doDelete(project.id)}>
          <a style={{color: 'red'}}><DeleteOutlined /><FormattedMessage id='delete'/></a>
        </Popconfirm>,
      ],
    },
  ];

  return columns;
}
