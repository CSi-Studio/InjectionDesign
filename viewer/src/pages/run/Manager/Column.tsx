import type {ProColumns} from "@ant-design/pro-table";
import {Tag} from "antd";
import {FormattedMessage} from "@@/exports";
import {RunTemplate} from "@/domains/RunTemplate.d";

export function buildColumn(updateFormRef: any, doUpdate: any){
  const columns: ProColumns<RunTemplate>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      key: 'templateName',
      title: <FormattedMessage id='run.template.name'/>,
      dataIndex: 'name',
    },
    {
      key: 'device',
      title: <FormattedMessage id='run.template.device'/>,
      dataIndex: 'device',
    },
    {
      key: 'boardType',
      title: 'Board Type',
      dataIndex: 'boardType',
    },
    {
      key: 'status',
      title: <FormattedMessage id='run.template.status'/>,
      dataIndex: 'status'
    },
    {
      key: 'option',
      title: <FormattedMessage id='run.template.option'/>,
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (text, run) => (
        <>
          <a><Tag color="blue"><FormattedMessage id='detail'/></Tag></a>
        </>
      ),
    },
  ];

  return columns;
}
