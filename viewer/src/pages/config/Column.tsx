import type {ProColumns} from "@ant-design/pro-table";
import {Tooltip} from "antd";
import {buildUpdateModal} from "@/pages/platform/Modals";
import type {Platform} from "@/domains/Platform.d";
import {FormattedMessage} from "@@/exports";

export function buildColumn(updateForm: any, doUpdate: any){
  const columns: ProColumns<Platform>[] = [
    {
      key: 'Id',
      title: 'id',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      key: 'name',
      title: <FormattedMessage id='name'/>,
      dataIndex: 'name',
      copyable: true,
      render: (text, record) => {
        return (
          <Tooltip title={`ID: ${record.id}`} placement="topLeft">
            <a onClick={() => {}}>{text}</a>
          </Tooltip>
        );
      },
    },
    {
      key: 'device',
      title: <FormattedMessage id='device.no'/>,
      dataIndex: 'device',
      hideInSearch: true
    },
    {
      key: 'checkPlatform',
      title: <FormattedMessage id='analytical.platform'/>,
      hideInSearch: true,
      dataIndex: 'checkPlatform',
    },
    {
      key: "sopFile",
      title: <FormattedMessage id='SOP.file'/>,
      hideInSearch: true,
      dataIndex: "sopFile",
    },
    {
      key: "owner",
      title: <FormattedMessage id='owner'/>,
      hideInSearch: true,
      dataIndex: "owner"
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
      render: (text, platform) => (
        <>
          {buildUpdateModal(updateForm, doUpdate, platform)}
        </>
      ),
    },
  ];

  return columns;
}
