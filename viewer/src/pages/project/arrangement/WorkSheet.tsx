import React, {useEffect, useState} from 'react';
import {Card, Switch, Table, Tag, Transfer} from 'antd';
import type {ColumnsType, TableRowSelection} from 'antd/es/table/interface';
import type {TransferItem, TransferProps} from 'antd/es/transfer';
import difference from 'lodash/difference';
import ProForm from "@ant-design/pro-form";
import {ProFormRadio} from '@ant-design/pro-components';
import {ProFormSelect} from "@ant-design/pro-form/es";
import RunTemplateService from "@/services/RunTemplateService";


/**
 * service
 */
const runTemplateService = new RunTemplateService();

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

      return (
        <Table
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
      );
    }}
  </Transfer>
);


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
    dataIndex: 'title',
    title: 'Title',
  },
  {
    dataIndex: 'description',
    title: 'Description',
  },
];

const rightTableColumns: ColumnsType<Pick<DataType, 'title'>> = [
  {
    dataIndex: 'title',
    title: 'Title',
  },
  {
    dataIndex: 'alias',
    title: 'Alias',
    render: alias => <Tag>{alias}</Tag>,
  },
  {
    dataIndex: 'option',
    title: "Option",
    render: (text, sample) => [
      <a>edit</a>
    ],
  }
];


const WorkSheet: React.FC = (props, context) => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(true);
  const [device, setDeviceType] = useState<string>();
  const [workSheetHeader, setWorkSheetHeader] = useState<RecordType[]>(dataFor6500Column);
  const [batchNo, setBatchNo] = useState<any>();
  const [injectTemplate, setInjectTemplate] = useState<any>();
  const randomSample = props?.randomSample;

  useEffect(() => {
    setTargetKeys(targetKeys)
    props.setTargetKey(targetKeys)
  }, [targetKeys])

  useEffect(() => {
    props.setSelectBatch(batchNo);
  }, [batchNo])

  useEffect(()=>{
    props.setInjectTemplate(injectTemplate)
  }, [injectTemplate])

  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const triggerShowSearch = (checked: boolean) => {
    setShowSearch(checked);
  };

  return (
    <>
      <ProForm layout="vertical" submitter={false}>
        <Card title={"Device"}>
          <ProForm.Group>
            <ProFormSelect
              width={200}
              mode="multiple"
              name="setNo"
              label={"Set No:"}
              onChange={(value: any) => {
                setBatchNo(value)
              }}
              placeholder="Please select"
              options={randomSample.plateCountArr?.map((item) => {
                return {value: item, label: item}
              })}
            >
            </ProFormSelect>

            <ProFormSelect
              label={"Inject Template:"}
              width="xl"
              name="runTemplate"
              rules={[{required: true, message: 'please select injection template'}]}
              onChange={(value)=>{
                setInjectTemplate(value)
              }}
              request={async () => {
                const res: any[] = [];
                const runTemplateListData = await runTemplateService.list({});
                runTemplateListData?.data.map((item: { name: any; id: any }) => {
                  const temp: Record<any, any> = {};
                  temp.label = item.name;
                  temp.value = item.name;
                  res.push(temp);
                  return null;
                });
                return res;
              }}
              placeholder="please select injection template"
            />

          </ProForm.Group>


          <ProForm.Group>
            <ProFormRadio.Group
              initialValue={"Thermo"}
              name="radio-group"
              label="Device Type:"
              onChange={(value) => {
                let device = value.target.value;
                if (device === 'Thermo') {
                  setWorkSheetHeader(dataFor6500Column)
                }
                if (device === 'sciex') {
                  setWorkSheetHeader(dataFor6500Column)
                }
                setDeviceType(device);
              }}
              options={[
                {
                  label: <img height={25} src={'/img/Thermo.webp'}/>,
                  value: 'Thermo',
                },
                {
                  label: <img height={25} src={'/img/Sciex.jpg'}/>,
                  value: 'sciex',
                },
                {
                  label: <img height={40} src={'/img/Agilent.png'}/>,
                  value: 'agilent',
                },
                {
                  label: <img height={40} src={'/img/Bruker.svg'}/>,
                  value: 'bruker',
                },
              ]}
            />
          </ProForm.Group>


        </Card>

        <Card title={"Config WorkSheet Header"} bordered={false} style={{marginTop: 10}}>
          <ProForm.Item name={"workSheetHeader"}>
            <TableTransfer
              dataSource={workSheetHeader}
              targetKeys={targetKeys}
              showSearch={showSearch}
              onChange={onChange}
              filterOption={(inputValue, item) =>
                item.title!.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
              }
              leftColumns={leftTableColumns}
              rightColumns={rightTableColumns}
            />
            <Switch
              unCheckedChildren="showSearch"
              checkedChildren="showSearch"
              checked={showSearch}
              onChange={triggerShowSearch}
              style={{marginTop: 16}}
            />
          </ProForm.Item>
        </Card>
      </ProForm>
    </>
  )
    ;
};

export default WorkSheet;
