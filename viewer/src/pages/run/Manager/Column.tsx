import type {ProColumns} from "@ant-design/pro-table";
import {FormattedMessage} from "@@/exports";
import {RunTemplate} from "@/domains/RunTemplate.d";

export function buildColumn(){
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
  ];

  return columns;
}
