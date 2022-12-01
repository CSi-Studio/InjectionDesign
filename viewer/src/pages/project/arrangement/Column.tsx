import type {ProColumns} from '@ant-design/pro-table';
import {Button, message, Popconfirm, Tag} from 'antd';
import {SampleStatus} from '@/components/Enums/Const';
import {buildMSOrderDetailModal, buildUpdateSampleModal} from '@/pages/project/detail/Modals';
import type {Sample} from '@/domains/Sample.d';
import {transToTags} from '@/components/Commons/Columns';
import type {OrderBoard} from '@/domains/PreOrder.d';
import type {MSOrder} from '@/domains/MSOrder.d';
import type {SampleProcess} from '@/domains/PreOrder.d';
import type {MsOrderSample} from '@/domains/MSOrder.d';
import styles from './Style.less';
import {DeleteOutlined, ExportOutlined} from "@ant-design/icons";
import {MsFileConvert} from "@/domains/MSFileConvert.d";
// @ts-ignore
import { FormattedMessage } from 'umi';
// @ts-ignore
import React from "react";

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

export function buildProcessSampleColumn() {
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
      sorter: (a: any, b: any) => a.sampleNo.localeCompare(b.sampleNo),
    },
    {
      key: 'status',
      title: <FormattedMessage id='status'/>,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: SampleStatus,
      // sorter: (a: any, b: any) => a.sampleStatus - b.sampleStatus,
    },
    {
      key: 'group',
      title: <FormattedMessage id='group'/>,
      dataIndex: 'groupName',
      hideInSearch: true,
      sorter: (a: any, b: any) => a.groupName - b.groupName,
    },
    {
      key: 'position',
      title: <FormattedMessage id='position'/>,
      dataIndex: 'position',
      hideInSearch: true,
      sorter: (a: any, b: any) => a.position.localeCompare(b.position),
    },
    {
      key: 'volume',
      title: <FormattedMessage id='volume'/>,
      dataIndex: 'volume',
      hideInSearch: true,
      sorter: (a: any, b: any) => a.volume.localeCompare(b.volume),
    },
    {
      key: 'description',
      title: <FormattedMessage id='description'/>,
      dataIndex: 'description',
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
  ];

  return columns;
}

export function buildMSOrderColumn(updateForm: any, doGetMSOrderSampleList: any, doDelete: any) {
  const columns: ProColumns<MSOrder>[] = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      key: 'name',
      title: <FormattedMessage id='name'/>,
      dataIndex: 'name',
      copyable: true,
    },
    {
      key: 'device',
      title: <FormattedMessage id='instrument'/>,
      dataIndex: 'device',
      hideInSearch: true,
    },
    {
      key: 'platform',
      title: <FormattedMessage id='platform'/>,
      dataIndex: 'platform',
      hideInSearch: true,
    },
    {
      key: 'runSampleMethod',
      title: <FormattedMessage id='injection.mode'/>,
      dataIndex: 'runSampleMethod',
      hideInSearch: true,
    },
    {
      key: 'runSample',
      title: <FormattedMessage id='injection'/>,
      dataIndex: 'runSample',
      hideInSearch: true,
    },
    {
      key: 'sampleVolume',
      title: <FormattedMessage id='injection.volume'/>,
      dataIndex: 'sampleVolume',
      hideInSearch: true,
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
      width: '320px',
      hideInSearch: true,
      render: (text, msOrder) => [
        <div
          style={{
            cursor: 'pointer',
          }}
          key="content"
        >
          {buildMSOrderDetailModal(doGetMSOrderSampleList, msOrder.id)}
        </div>,
        <div
          style={{
            cursor: 'pointer',
          }}
          key="export1"
          color="blue"
        >

          <Button type={'primary'} size={'small'}
                  href={`${API_URL}/msOrder/exportLc?id=${msOrder.id}`}><ExportOutlined/>
            <FormattedMessage id='export.ms.worksheet'/></Button>
        </div>,
        <div
          style={{
            cursor: `${
              msOrder?.device == 'HFX-1' || msOrder?.device == 'HFX-2' ? 'pointer' : 'not-allowed'
            }`,
          }}
          key="export2"
        >
          <Tag
            color={`${msOrder?.device == 'HFX-1' || msOrder?.device == 'HFX-2' ? 'geekblue' : ''}`}
          >
            {msOrder?.device == 'HFX-1' || msOrder?.device == 'HFX-2' ? (
              <a
                style={{
                  color: 'inherit',
                }}
                href={`${API_URL}/msOrder/exportMC?id=${msOrder.id}`}
              >
                <FormattedMessage id='export.lc.worksheet'/>
              </a>
            ) : (
              <a
                style={{
                  color: '#aaa',
                }}
                onClick={() => {
                  message.warning('Export LC worksheet function is not support for current instrument');
                }}
              >
                导出色谱工单
              </a>
            )}
          </Tag>
        </div>,
        <Popconfirm title={<FormattedMessage id='confirm.delete'/>} key="delete" onConfirm={() => doDelete(msOrder.id)}>
          <Button danger size={'small'}><DeleteOutlined/><FormattedMessage id='delete'/></Button>
        </Popconfirm>,
      ],
    },
  ];

  return columns;
}

export function buildSamplePositionColumn(arrangementType: string) {
  const columns: ProColumns<SampleProcess>[] = [
    {
      key: 'sampleId',
      title: <FormattedMessage id='sample.no'/>,
      dataIndex: 'sampleNo',
      width: "150px",
      hideInSearch: false,
      editable: false,
    },
    {
      key: 'matrix',
      title: <FormattedMessage id='matrix'/>,
      dataIndex: 'matrix',
      hideInSearch: true,
      editable: false,
      render: (text, entity) => {
        return transToTags(entity.matrix);
      },
    },
    {
      key: 'species',
      title: <FormattedMessage id='species'/>,
      dataIndex: 'species',
      hideInSearch: true,
      editable: false,
      render: (text, entity) => {
        return transToTags(entity.species, 'purple');
      },
    },
    {
      key: 'group',
      title: <FormattedMessage id='group'/>,
      editable: false,
      dataIndex: 'groupName',
      hideInSearch: true,
    },
    {
      key: 'position',
      title: <FormattedMessage id='position'/>,
      editable: false,
      dataIndex: 'position',
      hideInSearch: true,
    },
    {
      key: 'volume',
      title: <FormattedMessage id='volume'/>,
      editable: false,
      dataIndex: 'volume',
      hideInSearch: true,
    },
    {
      key: 'status',
      title: <FormattedMessage id='status'/>,
      dataIndex: 'sampleStatus',
      hideInSearch: true,
      editable: false,
      valueType: 'select',
      valueEnum: {
        1: {
          text: <FormattedMessage id='normal'/>,
          status: 'Success',
        },
        2 : {
          text: <FormattedMessage id='invalid'/>,
          status: 'Error',
        },
      },
    },
    {
      key: '99board',
      title:
        arrangementType == '1' ?
          <div style={{color: '#1890ff',}}>
            <FormattedMessage id='9.9.plate'/>
          </div>
         : <FormattedMessage id='9.9.plate'/>,
      className: `${arrangementType == '1' && styles.columnCenter}`,
      dataIndex: 'nineNineSampleBoardPosition',
      hideInSearch: true,
      editable: false,

      render: (text, entity) => {
        return <Tag color="purple">{entity.nineNineSampleBoardPosition}</Tag>;
      },
    },
    {
      key: '96board',
      title:
        arrangementType == '2' ?
            <div style={{color: '#1890ff',}}>
              <FormattedMessage id='96.plate'/>
            </div> : <FormattedMessage id='96.plate'/>,
      className: `${arrangementType == '2' && styles.columnCenter}`,
      dataIndex: 'ninetySixSampleBoardPosition',
      hideInSearch: true,
      editable: false,
      render: (text, entity) => {
        return <Tag color="green">{entity.ninetySixSampleBoardPosition}</Tag>;
      },
    },
    {
      title:
        arrangementType == '3' ? <div style={{color: '#1890ff',}}>
          <FormattedMessage id='ep.plate'/>
        </div> : <FormattedMessage id='ep.plate'/>,
      className: `${arrangementType == '3' && styles.columnCenter}`,
      key: 'EP_board',
      dataIndex: 'epPosition',
      hideInSearch: true,
      editable: false,
      render: (text, entity) => {
        return <Tag color="blue">{entity.epPosition}</Tag>;
      },
    },

    {
      key: 'isValid',
      title: <FormattedMessage id='is.valid'/>,
      dataIndex: 'isValid',
      valueType: 'switch',
      hideInSearch: true,
      fieldProps: {
        defaultChecked: true,
        checkedChildren: <FormattedMessage id='yes'/>,
        unCheckedChildren: <FormattedMessage id='no'/>,
      },
    },

  ];
  return columns;
}

export function buildOrderBoardColumn() {
  const columns: ProColumns<OrderBoard>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      key: 'BoardId',
      title: <FormattedMessage id='plate.id'/>,
      dataIndex: 'boardId',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      key: 'orderName',
      title: <FormattedMessage id='worksheet'/>,
      dataIndex: 'orderName',
      sorter: (a: any, b: any) => a.orderName.localeCompare(b.orderName),
    },
    {
      title: <FormattedMessage id='plate.global.index'/>,
      dataIndex: 'boardIndex',
      render: (text, entity) => {
        return <Tag color="blue">{entity.boardIndex}<FormattedMessage id='no.plate'/></Tag>;
      }
    },
    {
      title: <FormattedMessage id='sample.count'/>,
      dataIndex: 'boardSampleSize',
      hideInSearch: true,
      render: (text) => {
        return <Tag color="pink">{text}</Tag>;
      },
    },
    {
      key: 'hasInvalidSample',
      title: <FormattedMessage id='has.invalid.sample'/>,
      dataIndex: 'hasInvalidSample',
      hideInSearch: true,
      render: (text, entity) => {
        if (!entity.hasInvalidSample)
          return (
            <div>
              <Tag color="green"><FormattedMessage id='no'/></Tag>
            </div>
          );
        else
          return (
            <div>
              <Tag color="red"><FormattedMessage id='yes'/></Tag>
            </div>
          );
      },
    },
  ];

  return columns;
}

export function buildMsOrderSampleColumn() {
  const columns: ProColumns<MsOrderSample>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='sample.no'/>,
      dataIndex: 'sampleNo',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='status'/>,
      dataIndex: 'sampleStatus',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='sample.type'/>,
      dataIndex: 'sampleType',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='group'/>,
      dataIndex: 'groupName',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='injection.order'/>,
      dataIndex: 'injectionOrder',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='injection.position'/>,
      dataIndex: 'injectionPosition',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='instrument'/>,
      dataIndex: 'device',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='platform'/>,
      dataIndex: 'platform',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='comment'/>,
      dataIndex: 'comment',
      hideInSearch: true,
    }
  ];

  return columns;
}

export function buildFileConvertColumn() {
  const columns: ProColumns<MsFileConvert>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='worksheet'/>,
      dataIndex: 'msOrderName',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='batch.no'/>,
      dataIndex: 'boardNo',
      hideInTable: false,
      hideInSearch: true,
      render: (text) => {
        return text || " ";
      },
    },
    {
      title: <FormattedMessage id='status'/>,
      dataIndex: 'status',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='create.date'/>,
      dataIndex: 'createData',
      hideInTable: false,
      hideInSearch: true,
    }
  ];
  return columns;
}


export function addSampleListColumn(arrangementType: string) {
  const columns = [
    {
      key: 'sampleNo',
      title: <FormattedMessage id='sample.no'/>,
      dataIndex: 'sampleNo',
      hideInSearch: true,
    },
    {
      key: 'nineNinePosition',
      title:
        arrangementType == '1' ?
          <div style={{color: '#1890ff'}}>
            <FormattedMessage id='9.9.plate'/>
          </div> : <FormattedMessage id='9.9.plate'/>,
      className: `${arrangementType == '1' && styles.columnCenter}`,
      dataIndex: 'nineNinePosition',
      hideInSearch: true,
      render: (text: any) => {
        return <Tag color="purple">{text}</Tag>;
      },
    },
    {
      key: 'ninetySixPosition',
      title:
        arrangementType == '2' ?  <div style={{color: '#1890ff'}}>
          <FormattedMessage id='96.plate'/>
        </div> : <FormattedMessage id='96.plate'/>,
      className: `${arrangementType == '2' && styles.columnCenter}`,
      dataIndex: 'ninetySixPosition',
      hideInSearch: true,
      render: (text: any) => {
        return <Tag color="green">{text}</Tag>;
      },
    },
    {
      title:
        arrangementType == '3' ?  <div style={{color: '#1890ff'}}>
          <FormattedMessage id='ep.plate'/>
        </div> : <FormattedMessage id='ep.plate'/>,
      className: `${arrangementType == '3' && styles.columnCenter}`,
      key: 'epPosition',
      dataIndex: 'epPosition',
      hideInSearch: true,
      render: (text: any) => {
        return <Tag color="blue">{text}</Tag>;
      },
    },
  ];
  return columns;
}
