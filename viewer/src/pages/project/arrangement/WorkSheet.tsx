import React, {useEffect, useState} from 'react';
import {Card, Table, Tag, Transfer} from 'antd';
import type {ColumnsType, TableRowSelection} from 'antd/es/table/interface';
import type {TransferItem, TransferProps} from 'antd/es/transfer';
import difference from 'lodash/difference';
import ProForm from "@ant-design/pro-form";
import {DeviceGroup, SampleColors} from "@/components/Enums/Const";
import {Scatter} from "@ant-design/charts";
import { ProFormRadio } from '@ant-design/pro-components';

interface RecordType {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
  tag: string;
}

interface DataType {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
  tag: string;
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: ColumnsType<DataType>;
  rightColumns: ColumnsType<DataType>;
}

// Customize Table Transfer
const TableTransfer = ({leftColumns, rightColumns, ...restProps}: TableTransferProps) => (
  <Transfer {...restProps}>
    {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection: TableRowSelection<TransferItem> = {
        getCheckboxProps: (item) => ({disabled: listDisabled || item.disabled}),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({key}) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys as string[], selected);
        },
        onSelect({key}, selected) {
          onItemSelect(key as string, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredItems}
        size="small"
        style={{pointerEvents: listDisabled ? 'none' : undefined}}
        onRow={({key, disabled: itemDisabled}) => ({
          onClick: () => {
            if (itemDisabled || listDisabled) return;
            onItemSelect(key as string, !listSelectedKeys.includes(key as string));
          },
        })}
      />
    }}
  </Transfer>
);

const plateListColumn = [
  {
    key:"setNo",
    dataIndex: "setNo",
    title: "Set",
    width: 80,
    render: (text: any, dom: any) => dom[0],
  },
  {
    key:"qcSamples",
    dataIndex: "qcSamples",
    title: "QC",
    width: 80,
    render: (text: any, dom: any) => <Tag>{dom[1].filter((item: any)=>item.type !== "Normal").length}</Tag>,
  },
  {
    key:"samples",
    dataIndex: "samples",
    title: "Samples",
    width: 80,
    render: (text: any, dom: any) => <Tag>{dom[1].filter((item: any)=>item.type === "Normal").length}</Tag>,
  },
  {
    key:"sequence",
    dataIndex: "sequence",
    title: "Sequence",
    render: (text: any, dom: any) => <Scatter width={1400} height={30} data={dom[1]} xField={'index'} autoFit={true}
                                    colorField={"type"} size={5} xAxis={false} yAxis={false}
                                    yField={"set"} padding={[0,10,0,10]} legend={false} shape={'square'}
                                    color={({ type }) => { return SampleColors[type]}}
                                    tooltip={{
                                      fields: ['sampleNo', 'type', 'index', 'dim1', 'dim2', 'dim3']
                                    }}
    />,
  },
  {
    key:"link",
    title: "Link",
    width: 80,
    render: (text: any, dom: any) => <a>Download</a>,
  }
]

const dataFor6500Column: RecordType[] = [
  {
    key: "SampleName",
    title: "SampleName",
    description: "(Required) Sample name",
    disabled: false,
    tag: "1",
  },
  {
    key: "SampleID",
    title: "SampleID",
    description: "(Required) Sample No",
    disabled: false,
    tag: "2",
  },
  {
    key: "Comments",
    title: "Comments",
    description: "(Not Required) Describe the record",
    disabled: false,
    tag: "1",
  },
  {
    key: "AcqMethod",
    title: "AcqMethod",
    description: "(Required) Default 'device name'",
    disabled: false,
    tag: "1",
  },
  {
    key: "ProcMethod",
    title: "ProcMethod",
    description: "(Not Required) Default 'none'",
    disabled: false,
    tag: "1",
  },
  {
    key: "RackCode",
    title: "RackCode",
    description: "(Required) Default value 'MTP 96 Cooled'",
    disabled: false,
    tag: "1",
  },
  {
    key: "PlateCode",
    title: "PlateCode",
    description: "(Required) Default value 'MTP 96 Cooled'",
    disabled: false,
    tag: "1",
  },
  {
    key: "VialPos",
    title: "VialPos",
    description: "(Required) Sample Position",
    disabled: false,
    tag: "1",
  },
  {
    key: "SmplInjVol",
    title: "SmplInjVol",
    description: "(Required) Sample inject Volume",
    disabled: false,
    tag: "1",
  },
  {
    key: "DilutFact",
    title: "DilutFact",
    description: "(Required) Default '1'",
    disabled: false,
    tag: "1",
  },
]

const leftTableColumns: ColumnsType<DataType> = [
  {
    key: 'title',
    dataIndex: 'title',
    title: 'Title',
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Description',
  },
];

const rightTableColumns: ColumnsType<Pick<DataType, 'title'>> = [
  {
    key:"title",
    dataIndex: 'title',
    title: 'Title',
  },
  {
    key:"alias",
    dataIndex: 'alias',
    title: 'Alias',
    render: alias => <Tag>{alias}</Tag>,
  },
  {
    key: 'option',
    dataIndex: 'option',
    title: "Option",
    render: (text, sample) => [
      <a>edit</a>
    ],
  }
];


const WorkSheet: React.FC = (props, context) => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [workSheetHeader, setWorkSheetHeader] = useState<RecordType[]>(dataFor6500Column);
  const setMap = props?.setMap;

  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  // @ts-ignore
  return <>
    <Card size={'small'} title={"Device Type"}>
      <ProForm layout="horizontal" submitter={false}>
        <ProForm.Group>
          <ProFormRadio.Group
            initialValue={"Thermo"}
            name="radio-group"
            //@ts-ignore
            onChange={(value: any) => {
              let device = value.target.value;
              if (device === 'Thermo') {
                setWorkSheetHeader(dataFor6500Column)
              }
              if (device === 'sciex') {
                setWorkSheetHeader(dataFor6500Column)
              }
            }}
            options={DeviceGroup}
          />
        </ProForm.Group>
      </ProForm>
    </Card>
    <Card size={'small'} title={"Header Config"}>
      <TableTransfer
        dataSource={workSheetHeader}
        targetKeys={targetKeys}
        showSearch={false}
        onChange={onChange}
        filterOption={(inputValue, item) =>
          item.title!.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
        }
        leftColumns={leftTableColumns}
        rightColumns={rightTableColumns}
      />
    </Card>
    <Card size={'small'} title={"Plate List"}>
      <Table
        pagination={false}
        size={'small'}
        rowKey={'setNo'}
        columns={plateListColumn}
        dataSource={Object.entries(setMap)}
      />
    </Card>
  </>

};

export default WorkSheet;
