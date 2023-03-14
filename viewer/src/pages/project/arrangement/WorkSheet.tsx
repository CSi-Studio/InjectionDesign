import React, {useRef, useState} from 'react';
import {Alert, Card, Col, Divider, message, Row, Space, Table, Tag} from 'antd';
import {IndexMapping, SampleColors, SupportPlatForm} from "@/components/Enums/Const";
import {Scatter} from "@ant-design/charts";
import * as ExcelJs from "exceljs";
import {generateHeaders, saveWorkbook} from "@/utils/ExcelUtils";
import {SampleColumns} from "@/pages/project/arrangement/Column";
import {Button} from "antd";
import {ModalForm, ProForm, ProFormGroup, ProFormList, ProFormSelect, ProFormText, ProTable} from '@ant-design/pro-components';
import {ProFormInstance} from "@ant-design/pro-form";
import { DownloadOutlined } from '@ant-design/icons';

const WorkSheet: React.FC = (props, context) => {
  const setMap = props?.setMap;
  // formRef
  const runFormRef = useRef<ProFormInstance>();
  const [workSheetHeaderVisible, setWorkSheetHeaderVisible] = useState<boolean>(false);

  const [tableHeader, setTableHeader] = useState<any[]>();

  function onExportExcel(setNo: number) {
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('sheet');
    // 设置 sheet 的默认行高
    worksheet.properties.defaultRowHeight = 20;
    // 设置列
    worksheet.columns = generateHeaders(SampleColumns);
    // 添加行
    worksheet.addRows(setMap[setNo]);
    // 导出excel
    saveWorkbook(workbook, 'Injection-Random-Simple-SetNo' + setNo + '.xlsx');
  }

  const previewSetMap: any[] = []
  Object.keys(setMap).forEach(key => {
    setMap[key].forEach((item: any) => {
      previewSetMap.push(item)
    })
  })
  console.log("previewSetMap", previewSetMap)

  const plateListColumn = [
    {
      key: "setNo",
      dataIndex: "setNo",
      title: "Set",
      width: 80,
      render: (text: any, dom: any) => dom[0],
    },
    {
      key: "qcSamples",
      dataIndex: "qcSamples",
      title: "QC",
      width: 80,
      render: (text: any, dom: any) => <Tag>{dom[1].filter((item: any) => item.type !== "Normal").length}</Tag>,
    },
    {
      key: "samples",
      dataIndex: "samples",
      title: "Samples",
      width: 80,
      render: (text: any, dom: any) => <Tag>{dom[1].filter((item: any) => item.type === "Normal").length}</Tag>,
    },
    {
      key: "sequence",
      dataIndex: "sequence",
      title: "Sequence",
      render: (text: any, dom: any) => <Scatter width={1400} height={30} data={dom[1]} xField={'index'} autoFit={true}
                                                colorField={"type"} size={5} xAxis={false} yAxis={false}
                                                yField={"set"} padding={[0, 10, 0, 10]} legend={false} shape={'square'}
                                                color={({type}) => {
                                                  return SampleColors[type]
                                                }}
                                                tooltip={{
                                                  fields: ['sampleNo', 'type', 'index', 'dim1', 'dim2', 'dim3']
                                                }}
      />,
    },
    {
      key: "link",
      title: "Link",
      width: 80,
      render: (text: any, dom: any) => <Button type={'primary'} size={'small'} disabled={!tableHeader}
                                               onClick={() => {
                                                 onExportExcel(dom[0])
                                               }}>Export</Button>,
    }
  ]

  // @ts-ignore
  return <>
    <Card size={'small'} title={"Plate List"} extra={<Space>
      <Button type={'primary'} size={'small'} onClick={()=>{
        setWorkSheetHeaderVisible(true)
      }}>
        WorkSheet Header
      </Button>
      <Button type={'primary'} size={'small'} disabled={!tableHeader} onClick={() => {
      Object.keys(setMap).forEach(key => {
        onExportExcel(Number(key))
      })
    }
    }>Export All</Button>
    </Space>}>
      <Table
        pagination={false}
        size={'small'}
        rowKey={'setNo'}
        columns={plateListColumn}
        dataSource={Object.entries(setMap)}
      />
    </Card>

    <Card title={"Preview"} extra={<Button type={"primary"}>Export</Button>}>
      <ProTable<any>
        search={false}
        toolBarRender={false}
        size="small"
        columns={tableHeader || SampleColumns}
        dataSource={previewSetMap}
        pagination={{
          style: {marginBottom: 0},
          pageSize: 20,
        }}
      />
    </Card>

    <ModalForm
      modalProps={{
        destroyOnClose: true,
        maskClosable: true,
      }}
      submitter={false}
      title={'Edit WorkSheet Header'}
      width={1200}
      open={workSheetHeaderVisible}
      onOpenChange={setWorkSheetHeaderVisible}
      // onFinish={false}
    >
      <ProForm
        // @ts-ignore
        onFinish={(values) => {

          message.info('Update success');
          // 构造新的表头
          const newTable: React.SetStateAction<any[]> = [];
          values?.tableLabels.forEach(
            (item: { dataIndex: any; title: any; name: any; desc: any }) => {
              newTable.push({
                title: item.title,
                name: item.name,
                dataIndex: item.dataIndex,
                desc: item.desc,
              });
            },
          );
          setTableHeader(newTable);
          console.log("value", values, newTable)

        }}
        submitter={{
          // 配置按钮文本
          searchConfig: {
            resetText: 'reset',
            submitText: 'confirm',
          },
        }}
      >
        <ProFormList
          name="tableLabels"
          label="WorkSheet Header Description"
          deleteIconProps={{
            tooltipText: 'Delete',
          }}
          copyIconProps={{
          tooltipText: "copy"
        }}
          creatorButtonProps={{
            creatorButtonText: "add"
          }}
          initialValue={tableHeader || SampleColumns}
        >
          <ProFormGroup>
            <ProFormText required={true} name="title" label="title" width={'sm'} placeholder={""}/>
            <ProFormSelect
              width="sm"
              name="dataIndex"
              required={true}
              label={"Index Mapping"}
              valueEnum={IndexMapping}
              placeholder={""}
            />
            <ProFormText name="desc" label="description" width={'sm'}  placeholder={""}/>
          </ProFormGroup>
        </ProFormList>
      </ProForm>

      <Divider type={'horizontal'} />
      {tableHeader?.length > 0 ? (
        <Card
          title={'Preview'}
          extra={
            <Button type={'primary'}>
              <DownloadOutlined />
              Download
            </Button>
          }
        >
          <ProTable<any>
            search={false}
            toolBarRender={false}
            rowKey={(record) => record.dataIndex}
            size="small"
            columns={tableHeader}
            pagination={{
              style: { marginBottom: 0 },
              pageSize: 5,
            }}
          />
        </Card>
      ) : (
        <div
          onClick={() => {
            console.log('table', tableHeader);
          }}
        ></div>
      )}
    </ModalForm>



  </>
};

export default WorkSheet;
