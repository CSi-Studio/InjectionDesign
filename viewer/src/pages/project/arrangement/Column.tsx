import type {ProColumns} from '@ant-design/pro-table';
import {Popconfirm} from 'antd';
import type {Sample} from '@/domains/Sample.d';
import {DeleteOutlined} from "@ant-design/icons";
// @ts-ignore
import { FormattedMessage } from 'umi';
// @ts-ignore
import React from "react";
import {buildUpdateSampleModal} from "@/pages/sample/Modals";

export function buildColumn(updateForm: any, doUpdate: any, doDelete: any) {
  const columns: ProColumns<Sample>[] = [
    {
      key: 'id',
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
      sorter: (a, b) => {
        return a?.sampleNo > b?.sampleNo ? -1 : 1;
      },
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
    },
    {
      key: 'dim1',
      title: 'dim1',
      dataIndex: 'dim1',
    },
    {
      key: 'dim2',
      title: 'dim2',
      dataIndex: 'dim2',
    },
    {
      key: 'dim3',
      title: 'dim3',
      dataIndex: 'dim3',
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
        <Popconfirm title={<FormattedMessage id='confirm.delete'/>} key="delete" onConfirm={() => doDelete(sample.id)}>
          <a style={{color: "red"}}><DeleteOutlined/></a>
        </Popconfirm>,
      ],
    },
  ];

  return columns;
}
