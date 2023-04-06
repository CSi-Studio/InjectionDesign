import type {ProColumns} from '@ant-design/pro-table';
import {Popconfirm, Tag} from 'antd';
import type {Sample} from '@/domains/Sample.d';
import {DeleteOutlined} from "@ant-design/icons";
// @ts-ignore
import { FormattedMessage } from 'umi';
// @ts-ignore
import React from "react";
import {buildUpdateSampleModal} from "@/pages/sample/Modals";
import {SampleSequence} from "@/domains/Sample.d";
import {SampleColors} from "@/components/Enums/Const";

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


export const SampleColumns: ProColumns<SampleSequence>[] = [
  {
    key: 'index',
    title: 'index',
    dataIndex: 'index',
    width: 60,
    render: (text) => {
      return <Tag color={"gray"} style={{borderRadius: "70%"}}>{text}</Tag>;
    },
  },
  {
    key: 'Set No',
    title: 'Set No',
    dataIndex: 'set',
    ellipsis: true,
    width: 80,
  },
  {
    key: 'type',
    title: 'Type',
    dataIndex: 'type',
    width: 100,
    render: (text) => {
      switch (text) {
        case 'Normal':
          return <Tag color={'gold'}>{text}</Tag>;
        case 'Blank':
          return <Tag color={SampleColors.Blank}>{text}</Tag>;
        case 'Solvent':
          return <Tag color={SampleColors.Solvent}>{text}</Tag>;
        case 'Pooled':
          return <Tag color={SampleColors.Pooled}>{text}</Tag>;
        case 'LTR':
          return <Tag color={SampleColors.LTR}>{text}</Tag>;
        case 'Custom':
          return <Tag color={SampleColors.Custom}>{text}</Tag>;
      }
      return;
    }
  },
  {
    key: 'well',
    title: 'Position',
    dataIndex: 'position',
    ellipsis: true,
    width: 100,
    render: (text) => {
      return <Tag color={"gold"}>{text}</Tag>;
    },
  },
  {
    disable: true,
    title: 'Sample No',
    dataIndex: 'sampleNo',
    key: 'sampleNo',
    search: false,
  },
  {
    key: 'dim1',
    title: 'dim1',
    dataIndex: 'dim1',
    ellipsis: true,
  },
  {
    key: 'dim2',
    title: 'dim2',
    dataIndex: 'dim2',
    ellipsis: true,
  },
  {
    key: 'dim3',
    title: 'dim3',
    dataIndex: 'dim3',
    ellipsis: true,
  },
];
