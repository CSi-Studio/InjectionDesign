import React from 'react';
import {Card, Table, Tag} from 'antd';
import {SampleColors} from "@/components/Enums/Const";
import {Scatter} from "@ant-design/charts";
import * as ExcelJs from "exceljs";
import {generateHeaders, saveWorkbook} from "@/utils/ExcelUtils";
import {SampleColumns} from "@/pages/project/arrangement/Column";
import {Button} from "antd";

const WorkSheet: React.FC = (props, context) => {
  const setMap = props?.setMap;
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
      render: (text: any, dom: any) => <Button type={'primary'} size={'small'} onClick={() => onExportExcel(dom[0])}>Export</Button>,
    }
  ]

  // @ts-ignore
  return <Card size={'small'} title={"Plate List"}>
      <Table
        pagination={false}
        size={'small'}
        rowKey={'setNo'}
        columns={plateListColumn}
        dataSource={Object.entries(setMap)}
      />
    </Card>
};

export default WorkSheet;
