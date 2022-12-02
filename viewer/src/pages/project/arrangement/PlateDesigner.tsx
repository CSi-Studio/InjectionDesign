import {Button, Card, Col, Row, Tag} from 'antd';
import type {CSSProperties} from 'react';
import React, {useEffect, useRef, useState} from 'react';
import type {IWellPickerProps} from "@/pages/arrangement/manager/WellPicker";
import {MultiWellPicker, RangeSelectionMode} from "@/pages/arrangement/manager/WellPicker";

import type {ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
// @ts-ignore
import styles from "@/pages/run/Manager/AddTemplate/style.less";
import {PositionFormat} from "well-plates";
import type {ActionType} from "@ant-design/pro-table";
import {blockRandom, completeRandom, randomBalance, stratifiedBalance} from "@/utils/CommonUtil";
import {Column, Scatter} from "@ant-design/charts";
import {BalanceMethodEnum, DimsEnum, RandomMethodEnum} from "@/components/Enums/Const";
import type {Sample, SampleSequence} from "@/domains/Sample.d";
import ProForm, {ProFormDigit} from "@ant-design/pro-form";
import {ProFormSelect} from "@ant-design/pro-form";
import {groupBy} from "lodash";
import * as ExcelJs from 'exceljs';
import {generateHeaders, saveWorkbook} from "@/utils/ExcelUtils";
import {DownloadOutlined} from "@ant-design/icons";

type IStateFullWellPickerProps = Omit<IWellPickerProps, 'onChange'>;
const PlateDesign: React.FC = (props: any) => {

  const [setNo, setSetNo] = useState(1);
  const [dataSource, setDataSource] = useState([])
  const [boardIndex, setBoardIndex] = useState([0])
  const [pageCurrent, setPageCurrent] = useState(1)
  const [sortedSamples, setSortedSamples] = useState<Record<string, any>[]>([])
  const [setSamples, setSetSamples] = useState<any[]>([])
  const [interBatchBalanceMethod, setInterBatchBalanceMethod] = useState<string>('2')
  const [interBatchBalanceDim, setInterBatchBalanceDim] = useState<string>('1')
  const [intraBatchRandomMethod, setIntraBatchRandomMethod] = useState<string>('2')
  const [intraBatchRandomDim, setIntraBatchRandomDim] = useState<string>('1')
  const [plateRow, setPlateRow] = useState<number>(8)
  const [plateCol, setPlateCol] = useState<number>(12)
  const [plateSize, setPlateSize] = useState<number>(40)
  const [plateFormat, setPlateFormat] = useState<PositionFormat>(PositionFormat.LetterNumber)
  const [maxSampleOnSinglePlate, setMaxSampleOnSinglePlate] = useState<number>(96)
  const [sampleData, setSampleData] = useState<any[]>([])
  const [plateCountArr, setPlateCountArr] = useState<number[]>([])
  const [plateCount, setPlateCount] = useState<number>(1)

  const actionRef = useRef<ActionType>();

  function setPlateType(row: number, col: number, size: number) {
    setPlateRow(row);
    setPlateCol(col);
    setPlateSize(size);
  }

  function setPropsSample(samples: any[]) {
    props.setRandomSampleRes({
      sampleData: samples,
      plateCountArr: plateCountArr
    })
  }

  const columns: ProColumns<SampleSequence>[] = [
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
      key: 'Set No',
      title: 'Set No',
      dataIndex: 'set',
      ellipsis: true,
      width: 80,
    },
    {
      key: 'dim1',
      title: 'dim1',
      dataIndex: 'dim1',
      ellipsis: true,
      width: 120,
    },
    {
      key: 'dim2',
      title: 'dim2',
      dataIndex: 'dim2',
      width: 120,
      ellipsis: true,
    },
    {
      key: 'dim3',
      title: 'dim3',
      dataIndex: 'dim3',
      ellipsis: true,
      width: 120,
    },
  ];

  function Init() {
    /**
     * props.platparam
     */
    switch (props.plateType) {
      case '1':
        setPlateType(9, 9, 50);
        break;
      case '2':
        setPlateType(8, 12, 50);
        break;
      case '3':
        setPlateType(16, 24, 28);
        break;
      default:
        setPlateType(8, 12, 40);
    }
    setPlateFormat(props.plateNumber === '1' ? PositionFormat.LetterNumber : PositionFormat.Sequential);
    setMaxSampleOnSinglePlate(props.maxSamplesOnSinglePlate);

    let pCount: number | undefined;
    if (props.sampleData?.length) {
      pCount = Math.ceil(props.sampleData.length / props.maxSamplesOnSinglePlate)
    } else {
      pCount = 1;
    }
    setSampleData(props.sampleData);
    setPlateCount(pCount);
    setPlateCountArr(Array.from(Array(pCount), (v, k) => k + 1));     // 生成孔板序列
  }

  function InterBatchBalance(samples?: Sample[]) {
    if (samples === undefined || samples.length === 0) {
      // eslint-disable-next-line no-param-reassign
      samples = sampleData;
    }
    if (samples === undefined) {
      return;
    }

    switch (interBatchBalanceMethod) {
      case "1":
        // eslint-disable-next-line no-param-reassign
        samples = randomBalance(samples, props.maxSamplesOnSinglePlate);
        break;
      case "2":
        // eslint-disable-next-line no-param-reassign
        samples = stratifiedBalance(samples, props.maxSamplesOnSinglePlate, interBatchBalanceDim);
        break;
      default:
        // eslint-disable-next-line no-param-reassign
        samples = randomBalance(samples, props.maxSamplesOnSinglePlate);
        break;
    }

    return samples;
  }

  function IntraBatchRandom(samples?: any[]) {
    if (samples === undefined || samples.length === 0) {
      // eslint-disable-next-line no-param-reassign
      samples = sampleData;
    }
    if (samples === undefined) {
      return [];
    }

    switch (intraBatchRandomMethod) {
      case "1": //完全随机
        // eslint-disable-next-line no-param-reassign
        samples = GetSamplePlateMapping(completeRandom(samples));
        break;
      case "2": //区块随机
        // eslint-disable-next-line no-param-reassign
        samples = GetSamplePlateMapping(blockRandom(samples, intraBatchRandomDim))
        break;
      default:
        // eslint-disable-next-line no-param-reassign
        samples = GetSamplePlateMapping(completeRandom(samples))
        break;
    }

    setSampleData(samples);
    return samples;
  }

  useEffect(() => {
    Init();
  }, [])

  useEffect(() => {
    if (sampleData === undefined || sampleData.length === 0) {
      IntraBatchRandom(InterBatchBalance(props.sampleData));
    } else {
      IntraBatchRandom(InterBatchBalance(sampleData));
    }
  }, [interBatchBalanceMethod, interBatchBalanceDim])

  useEffect(() => {
    const newSampleData = sampleData?.sort((a: any, b: any) => a.index - b.index)
    //@ts-ignore
    setDataSource(newSampleData)
    const sS = groupBy(JSON.parse(JSON.stringify(sampleData)), 'set');
    const sampleStat: any[] = [];
    Object.entries(sS).forEach((entry) => {
      const groupS = groupBy(entry[1], DimsEnum[interBatchBalanceDim]);
      Object.entries(groupS).forEach(groupEntry => {
        sampleStat.push({
          set: 'Set No' + entry[0],
          dim: groupEntry[0],
          count: groupEntry[1].length
        })
      })
    })

    setSetSamples(sampleStat);
    setSortedSamples(JSON.parse(JSON.stringify(sampleData)).filter((data: Record<string, any>) => data.set === setNo));

    setPropsSample(newSampleData);
  }, [sampleData])

  useEffect(() => {
    setSortedSamples(JSON.parse(JSON.stringify(sampleData)).filter((data: Record<string, any>) => data.set === setNo))
  }, [setNo])

  /**
   * 两个样本求排列
   * @param key1
   * @param key2
   * @param comma
   * @constructor
   */
  function GenList(key1: number[], key2: any[], comma: string) {
    const newArr = [];
    for (const a of key2) {
      for (const b of key1) {
        newArr.push(a + comma + b)
      }
    }
    return newArr;
  }

  /**
   * 补充样本信息
   * @param samples
   * @constructor
   */
  function GetSamplePlateMapping(samples: any[]) {
    if (samples.length === 0) {
      return [];
    }
    const colArr = new Array(plateCol).toString().split(',').map(function (item, index) {
      return index + 1;
    });
    let rowArr;
    if (plateFormat === PositionFormat.Sequential) {
      rowArr = new Array(plateRow).toString().split(',').map(function (item, index) {
        return index + 1;
      });
    }
    if (plateFormat === PositionFormat.LetterNumber) {
      rowArr = [...Array(plateRow).keys()].map(i => String.fromCharCode(i + 65))
    }
    // @ts-ignore
    const platePositionList = GenList(colArr, rowArr, ":");

    let lastSet: any;
    let iter = 0;
    samples.forEach((item, index) => {
      if (item.set !== lastSet) {
        lastSet = item.set;
        iter = 0;
      }
      item.index = index + 1;
      item.position = platePositionList[iter];
      iter++;
    })
    return samples;
  }

  function StateFullWellPicker(pickerProps: IStateFullWellPickerProps) {
    const {value: initialValue, ...otherProps} = pickerProps;
    const [value, setValue] = useState(initialValue);

    return <MultiWellPicker value={value} onChange={(value1) => {
      setValue(value1)
      setBoardIndex(value1)
      const totalValue = value1[0] + (setNo - 1) * maxSampleOnSinglePlate;
      if (totalValue < 20) {
        setPageCurrent(1)
      } else {
        if (totalValue % 20 === 0) {
          setPageCurrent(value1[0] / 20 + 1)
        } else {
          setPageCurrent(Math.ceil(totalValue / 20))
        }
      }
    }} {...otherProps} />;
  }

  /**
   * export
   */
  function onExportExcel() {
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('sheet');
    // 设置 sheet 的默认行高
    worksheet.properties.defaultRowHeight = 20;
    // 设置列
    worksheet.columns = generateHeaders(columns);
    // 添加行
    worksheet.addRows(dataSource);
    // 导出excel
    saveWorkbook(workbook, 'Injection-Random-Simple.xlsx');
  }

  const config = {
    xAxis: {
      label: {
        style:{
          fill: 'black',
          fontSize: 12,
          fontWeight: 500,
        }
      }
    },
    yAxis: {
      label: {
        style:{
          fill: 'black',
          fontSize: 16,
          fontWeight: 500,
        }
      }
    },
    legend: {
      itemName:{
        style:{
          fill: 'black',
          fontSize: 16,
          fontWeight: 500
        }
      }
    },
    regressionLine: {
      type: 'quad', // linear, exp, loess, log, poly, pow, quad
    },
  }
  return (
    <>
      <Row gutter={[5, 5]}>
        <Col span={10}>
          <Card>
            <Row>
              <Col span={24}>
                <ProForm layout="horizontal" submitter={false}>
                  <ProForm.Group>
                    <ProFormDigit readonly={true} label={"Total Samples"}>{props.sampleData?.length}</ProFormDigit>
                    <ProFormDigit readonly={true} label={"Total Plates"}>{plateCount}</ProFormDigit>
                    <ProFormSelect initialValue={"1"} width={100} name="setNo" label='Set No'
                                   fieldProps={{onChange: (value) => setSetNo(Number(value)), size: 'small'}}
                                   options={plateCountArr?.map((item) => {
                                     return {value: item, label: item}
                                   })}/>
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormSelect width={180} name="interBatchBalanceMethod" label='Inter-Batch Balance Method'
                                   valueEnum={BalanceMethodEnum} initialValue={"2"}
                                   fieldProps={{
                                     onChange: (value) => setInterBatchBalanceMethod(value),
                                     size: 'small'
                                   }}/>
                    <ProFormSelect width={100} name="interBatchBalanceDim" label='Dim'
                                   valueEnum={DimsEnum} initialValue={"1"}
                                   fieldProps={{
                                     onChange: (value) => {
                                       setInterBatchBalanceDim(value)
                                     }, size: 'small'
                                   }}/>
                    <Button type={'primary'} onClick={() => {
                      IntraBatchRandom(InterBatchBalance());
                    }}>Balance</Button>
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormSelect width={180} name="intraBatchRandomMethod" label='Intra-Batch Random Method'
                                   valueEnum={RandomMethodEnum} initialValue={"2"}
                                   fieldProps={{onChange: (value) => setIntraBatchRandomMethod(value), size: 'small'}}/>
                    <ProFormSelect width={100} name="intraBatchRandomDim" label='Dim'
                                   valueEnum={DimsEnum} initialValue={"1"}
                                   fieldProps={{
                                     onChange: (value) => {
                                       setIntraBatchRandomDim(value)
                                     }, size: 'small'
                                   }}/>
                    <Button type={'primary'} onClick={() => IntraBatchRandom()}>Random</Button>
                  </ProForm.Group>
                </ProForm>
              </Col>
            </Row>

            <StateFullWellPicker
              rows={plateRow}
              columns={plateCol}
              wellSize={plateSize}
              renderText={({index}) => {
                return (
                  <div style={{fontSize: 12}}>
                    <div>{index + 1}</div>
                  </div>
                );
              }}
              value={[0]}
              displayAsGrid={false}
              format={plateFormat}
              rangeSelectionMode={RangeSelectionMode.zone}
              style={({index, wellPlate, disabled, booked, selected}) => {
                const position = wellPlate.getPosition(index, 'row_column');
                const css: CSSProperties = {};
                if (disabled) {
                  if (position.row === 1) {
                    css.backgroundColor = 'grey';
                  } else {
                    css.backgroundColor = 'lightgray';
                  }
                }
                if (selected) {
                  css.backgroundColor = 'pink';
                }
                if (booked && !disabled) {
                  css.borderColor = 'red';
                }
                // 选中
                if (boardIndex[0] === index) {
                  css.borderColor = 'red'
                }

                // 筛选出set为当前set的样本
                const setArr = sampleData.filter(item => item.set === setNo);
                if (index < setArr.length) {
                  css.backgroundColor = 'gold'
                }
                return css;
              }}
            />
          </Card>
        </Col>
        <Col span={14}>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Card title={"Distribution on Sets"} size={'small'}>
                <Column height={150} autoFit={true} isStack={true} data={setSamples} xField={'set'}
                        yField={'count'} seriesField={'dim'} {...config}/>
              </Card>
            </Col>
            <Col span={24}>
              <Card title={"Injection Order on Set No" + setNo} size={'small'}>
                <Scatter height={150} autoFit={true} data={sortedSamples} xField={'index'} colorField={DimsEnum[intraBatchRandomDim]} size={5}
                         yField={DimsEnum[intraBatchRandomDim]} shapeField={DimsEnum[intraBatchRandomDim]} {...config} legend={false}/>
              </Card>
            </Col>
            <Col span={24}>
              <Button style={{float: "right", marginBottom: 10}} onClick={onExportExcel} type={"primary"}><DownloadOutlined />Export</Button>
              <ProTable<SampleSequence>
                size={'small'}
                columns={columns}
                actionRef={actionRef}
                cardBordered
                //@ts-ignore
                dataSource={dataSource}
                editable={{
                  type: 'multiple',
                }}
                columnsState={{
                  persistenceKey: 'pro-table-singe-demos',
                  persistenceType: 'localStorage',
                }}
                rowKey="id"
                search={false}
                options={{
                  setting: {
                    listsHeight: 400,
                  },
                }}
                rowClassName={(record, index) => {
                  if (boardIndex[0] % 20 === index) {
                    return `${styles.tableActiveRow}`
                  }
                  if (index == 0) {
                    // return `${styles.tableActiveRow}`
                    return ''
                  } else {
                    return ''
                  }
                }}
                form={{
                  // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                  syncToUrl: (values, type) => {
                    if (type === 'get') {
                      return {
                        ...values,
                        created_at: [values.startTime, values.endTime],
                      };
                    }
                    return values;
                  },
                }}
                pagination={{
                  pageSize: 15,
                  current: pageCurrent,
                  onChange: (page) => {
                    setPageCurrent(page)
                  },
                }}
                dateFormatter="string"
                headerTitle="Sample"
                toolBarRender={false}
              /></Col>
            <Col span={24}/>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default PlateDesign;
