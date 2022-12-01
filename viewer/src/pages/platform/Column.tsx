import type { ProColumns } from '@ant-design/pro-table';
import { buildUpdateModal } from '@/pages/platform/Modals';
import type { Platform } from '@/domains/Platform.d';
import { url } from '@/utils/request';
import { FormattedMessage } from 'umi';

export function buildColumn(updateForm: any, doUpdate: any) {
  const columns: ProColumns<Platform>[] = [
    {
      key: 'Id',
      title: 'id',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      key: 'name',
      title: <FormattedMessage id='name'/>,
      dataIndex: 'name',
      copyable: true,
      render: (text) => {
        return text || ' ';
      },
    },
    {
      key: 'device',
      title: <FormattedMessage id='device'/>,
      dataIndex: 'device',
      hideInSearch: true,
      render: (text) => {
        return text == '-' ? '' : text;
      },
    },
    {
      key: 'mathPath',
      title: <FormattedMessage id='method.file'/>,
      hideInSearch: true,
      dataIndex: 'mathPath',
      render: (text) => {
        return text == '-' ? '' : text;
      },
    },
    {
      key: 'msFilePath',
      title: <FormattedMessage id='ms.output.file'/>,
      hideInSearch: true,
      dataIndex: 'msFilePath',
      render: (text) => {
        return text == '-' ? '' : text;
      },
    },
    {
      key: 'status',
      title: <FormattedMessage id='status'/>,
      hideInSearch: true,
      dataIndex: 'status',
      render: (text) => {
        return text == '-' ? '' : text;
      },
    },
    {
      key: 'sopFile',
      title: <FormattedMessage id='SOP.file'/>,
      hideInSearch: true,
      dataIndex: 'sopFile',
      render: (text, platform) => {
        return (
          <a
            target={'_blank'}
            href={`${url}/platform/file/download?fileId=${platform.fileId}`}
            rel="noreferrer"
          >
            {platform.fileName}
          </a>
        );
      },
    },
    {
      key: 'owner',
      title: <FormattedMessage id='owner'/>,
      hideInSearch: true,
      dataIndex: 'owner',
      render: (text) => {
        return text == '-' ? '' : text;
      },
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
      render: (text) => {
        // @ts-ignore
        return !text?.props?.text ? '' : text;
      },
    },
    {
      key: 'option',
      title: <FormattedMessage id='option'/>,
      valueType: 'option',
      fixed: 'right',
      width: '220px',
      hideInSearch: true,
      render: (text, record) => {
        return record.device ? <>{buildUpdateModal(updateForm, doUpdate, record)}</> : '';
      },
    },
  ];

  return columns;
}
