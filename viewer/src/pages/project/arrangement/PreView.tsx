import React, {useEffect, useState} from 'react';
import {Button, Card, Pagination, Space, Table} from "antd";
import {DownloadOutlined, PrinterOutlined} from "@ant-design/icons";
import {jsPDF} from "jspdf";
import RunTemplateService from "@/services/RunTemplateService";

export interface CellConfig {
  name: string;
  prompt: string;
  align: "left" | "center" | "right";
  padding: number;
  width: number;
}

const runTemplateService = new RunTemplateService();
const Preview: React.FC = (props: any) => {
  const targetKey = props?.targetKeys;
  const sampleSequence = props?.randomSample?.sampleData;
  const injectionBatch = props?.selectBatch;
  const injectTemplate = props?.injectTemplate;

  // 根据title选择字段
  const columnArr: { title: any; dataIndex: any; key: any; }[] = [];
  targetKey.map((item: any) => {
    return columnArr.push({
      title: item,
      dataIndex: item,
      key: item
    });
  })

  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  // const [injectOrderData, setInjectOrderData] = useState<any[]>([]);
  const [finalInjectionSequence, setFinalInjectionSequence] = useState<any[]>([]);

  // 最终导出文件格式
  const [finalExportSequence, setFinalExportSequence] = useState<any[]>([]);


  useEffect(() => {
    setData(data)
  }, [data])

  // 请求进样模板
  useEffect(() => {
    getRunTemplate(injectTemplate)
  }, [])

  // 生成dataSource
  useEffect(() => {
    const finalInjectArr: React.SetStateAction<any[]> = []
    for (const subSequence of finalInjectionSequence) {
      subSequence.map((value: { id: any; sampleNo: any; set: any; position: any; }) => {
        finalInjectArr.push({
          "SampleID": value.id,
          "SampleName": value.sampleNo,
          "Comments": value.set,
          "AcqMethod": "D:/data",
          "ProcMethod": "D:/data",
          "Type": "Sample",
          "Vial": '1ul',
          "RackCode": "MTP 96 Cooled",
          "PlateCode": "MTP 96 Cooled",
          'VialPos': value.position,
          "SmplInjVol": 1,
          "DilutFact": 1,
          "WghtToVol": 0,
          "RackPos": 1,
          "PlatePos": 2
        })
      })
    }
    setFinalExportSequence(finalInjectArr)
  }, [finalInjectionSequence])


  async function getRunTemplate(template: string): Promise<any> {
    const result = await runTemplateService.getByName(template);
    if (result.success) {
      // setInjectOrderData(result.data.injectOrder)
      //先获取样本总数及循环进样的次数，决定分组
      const resultSequence = genInjectionSequence(result.data.injectOrder, injectionBatch, sampleSequence)
      setFinalInjectionSequence(resultSequence)
    }
    return result;
  }

  const exportToCsv = (filename: string, rows: any[]) => {
    let csvFile = '';
    rows.forEach(function (row) {
      csvFile += row.SampleID + "," + row.SampleName + "," + row.Comments + "," + row.AcqMethod + "," + row.ProcMethod + "," + row.Type + "," + row.Vial + "," + row.RackCode + "," + row.PlateCode+ ","  + row.VialPos + "," + row.SmplInjVol + "," + row.DilutFact + "\r\n";
    });

    const blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});

    const link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const handleDownload = () => {
    exportToCsv("table.csv", finalExportSequence)
  }

  const handlePrint = () => {
    const headers: CellConfig[] = [
      {name: "SampleName", prompt: "SampleName", width: 40, align: 'center', padding: 0},
      {name: "SampleID", prompt: "SampleID", width: 40, align: 'center', padding: 0},
      {name: "AcqMethod", prompt: "AcqMethod", width: 40, align: 'center', padding: 0},
      {name: "ProcMethod", prompt: "ProcMethod", width: 40, align: 'center', padding: 0},
      {name: "Type", prompt: "Type", width: 10, align: 'center', padding: 0},
      {name: "Vial", prompt: "Vial", width: 10, align: 'center', padding: 0},
      {name: "PlateCode", prompt: "PlateCode", width: 10, align: 'center', padding: 0},
      {name: "RackCode", prompt: "RackCode", width: 10, align: 'center', padding: 0},
      {name: "VialPos", prompt: "VialPos", width: 10, align: 'center', padding: 0},
      {name: "SmplInjVol", prompt: "SmplInjVol", width: 10, align: 'center', padding: 0},
      {name: "DilutFact", prompt: "DilutFact", width: 10, align: 'center', padding: 0},
      {name: "WghtToVol", prompt: "WghtToVol", width: 10, align: 'center', padding: 0},
      {name: "RackPos", prompt: "RackPos", width: 10, align: 'center', padding: 0},
      {name: "PlatePos", prompt: "PlatePos", width: 10, align: 'center', padding: 0},
    ];
    const doc = new jsPDF({putOnlyUsedFonts: true});
    doc.table(1, 1, finalExportSequence, headers, {});
    doc.save("table.pdf")
  }

  /**
   * 生成进样序列
   * 先按 sample的数量进行分组，对于qc则每次从qc数组中取一个，对于sample样本每次取一组，将所有样本均分成相同组
   */
  function genInjectionSequence(injections: any[], batch: any[], sequence: any[]) {
    if (injections.length > 0) {
      const sampleInjectConfig = injections.filter(item => item.name === 'Sample')
      const injectionTime = sampleInjectConfig[0]?.times;
      const injectSampleSequence = sequence.filter(item => batch.includes(item.set));
      const _ = require('lodash');
      const groupSampleSequence = _.chunk(injectSampleSequence, injectionTime);
      return groupSampleSequence;
    }
    // let resArr = []
    // for (let data of injectOrderData) {
    //   let injectSubSequence = [];
    //   switch (data.name) {
    //     case "CommonQc":
    //       injectSubSequence = genQcInjectionOrder(data)
    //       break;
    //     case "Long-Term Reference":
    //       injectSubSequence = genQcInjectionOrder(data)
    //       break;
    //     case "Pooled Qc":
    //       injectSubSequence = genQcInjectionOrder(data)
    //       break;
    //     case "Solvent Blank Qc":
    //       injectSubSequence = genQcInjectionOrder(data)
    //       break;
    //     case "Sample":
    //       injectSubSequence = genSampleInjectionOrder(data)
    //       break;
    //     default:
    //       injectSubSequence = genSampleInjectionOrder(data)
    //   }
    //   resArr.push(injectSubSequence)
    // }
    // console.log(resArr)
    return [];
  }

  return (
    <>
      <Card style={{marginTop: 10}}>

        <div className="table-container">
          <Space direction="vertical" style={{display: 'flex'}}>
            <Space style={{display: 'flex', justifyContent: 'end'}}>
              <Button type="primary" shape="round" icon={<DownloadOutlined/>} onClick={handleDownload}>Download</Button>
              <Button type="primary" shape="round" icon={<PrinterOutlined/>} onClick={handlePrint}>Print</Button>
            </Space>
            <Card>
              <Table
                dataSource={finalExportSequence}
                columns={columnArr}
                pagination={false}
              />
              <Pagination
                current={page}
                total={10}
                defaultPageSize={10}
                onChange={setPage}
              />
            </Card>
          </Space>
        </div>
      </Card>
    </>
  )
};

export default Preview;
