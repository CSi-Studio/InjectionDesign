import {Button, Card, Col, Row, Tag} from 'antd';
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
import {BalanceMethodEnum, DimsEnum, QCColors, QCTypeEnum, RandomMethodEnum} from "@/components/Enums/Const";
import type {Sample, SampleSequence} from "@/domains/Sample.d";
import ProForm, {ProFormDigit} from "@ant-design/pro-form";
import {ProFormSelect} from "@ant-design/pro-form";
import {groupBy} from "lodash";
import * as ExcelJs from 'exceljs';
import {generateHeaders, saveWorkbook} from "@/utils/ExcelUtils";
import {DownloadOutlined} from "@ant-design/icons";
import {buildStyles} from "@/pages/arrangement/manager/util/PlateStyle";
import {IterationOrder} from "_well-plates@6.0.3@well-plates";

type IStateFullWellPickerProps = Omit<IWellPickerProps, 'onChange'>;
const PlateDesign: React.FC = (props: any) => {

  const [setNo, setSetNo] = useState(1);
  const [dataSource, setDataSource] = useState([])
  const [sortedSamples, setSortedSamples] = useState<Record<string, any>[]>([])
  const [setSamples, setSetSamples] = useState<any[]>([])
  const [interBatchBalanceMethod, setInterBatchBalanceMethod] = useState<string>('2')
  const [interBatchBalanceDim, setInterBatchBalanceDim] = useState<string>('1')
  const [intraBatchRandomMethod, setIntraBatchRandomMethod] = useState<string>('2')
  const [intraBatchRandomDim, setIntraBatchRandomDim] = useState<string>('1')
  const [plateRow, setPlateRow] = useState<number>(8)
  const [plateCol, setPlateCol] = useState<number>(12)
  const [wellSize, setWellSize] = useState<number>(40)
  const [yaxisFormat, setYaxisFormat] = useState<PositionFormat>(PositionFormat.LetterNumber)
  const [sampleData, setSampleData] = useState<any[]>([])
  const [plateCountArr, setPlateCountArr] = useState<number[]>([])
  const [plateCount, setPlateCount] = useState<number>(1)
  const [direction] = useState<string>(props.direction)

  const getAllQcPosition = () => {
    return [...props.customQcPosition,
      ...props.pooledQcPosition,
      ...props.solventQcPosition,
      ...props.ltrQcPosition,
      ...props.blankQcPosition]
  }

  const [customQcPosition] = useState<number[]>(props.customQcPosition);
  const [pooledQcPosition] = useState<number[]>(props.pooledQcPosition);
  const [solventQcPosition] = useState<number[]>(props.solventQcPosition);
  const [ltrQcPosition] = useState<number[]>(props.ltrQcPosition);
  const [blankQcPosition] = useState<number[]>(props.blankQcPosition);
  const [samplePositionMap, setSamplePositionMap] = useState<any>({});
  const [allQcPosition] = useState<number[]>(getAllQcPosition().sort((a: number, b: number) => a - b));

  const tableRef = useRef<ActionType>();

  function buildPlateType(row: number, col: number, size: number) {
    setPlateRow(row);
    setPlateCol(col);
    setWellSize(size);
  }

  const platePositionList = GenerateList();

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
            return <Tag color={QCColors.Blank}>{text}</Tag>;
          case 'Solvent':
            return <Tag color={QCColors.Solvent}>{text}</Tag>;
          case 'Pooled':
            return <Tag color={QCColors.Pooled}>{text}</Tag>;
          case 'LTR':
            return <Tag color={QCColors.LTR}>{text}</Tag>;
          case 'Custom':
            return <Tag color={QCColors.Custom}>{text}</Tag>;
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
    switch (props.plateType) {
      case '1':
        buildPlateType(9, 9, 50);
        break;
      case '2':
        buildPlateType(8, 12, 50);
        break;
      case '3':
        buildPlateType(16, 24, 28);
        break;
      default:
        buildPlateType(8, 12, 40);
    }
    setYaxisFormat(props.plateNumber);

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
   */
  function GenerateList() {
    const colArr = new Array(plateCol).toString().split(',').map(function (item, index) {
      return index + 1;
    });
    let rowArr: any[] = [];
    if (yaxisFormat === PositionFormat.Sequential) {
      rowArr = new Array(plateRow).toString().split(',').map(function (item, index) {
        return index + 1;
      });
    }
    if (yaxisFormat === PositionFormat.LetterNumber) {
      rowArr = [...Array(plateRow).keys()].map(i => String.fromCharCode(i + 65))
    }

    const newArr = [];
    if (direction === "Horizontal") {
      for (const a of rowArr) {
        for (const b of colArr) {
          newArr.push(a + ":" + b)
        }
      }
    } else {
      for (const b of colArr) {
        for (const a of rowArr) {
          newArr.push(a + ":" + b)
        }
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

    let totalSamples: any[] = [];
    const samplesSetMap = groupBy(samples, 'set');
    Object.entries(samplesSetMap).forEach((entry) => {
      const currentSetNo = Number(entry[0]);
      const values = entry[1];
      let nextPosition = getNextEmptyPosition(1);
      let samplePosition: number[] = [];
      let qcSamples = BuildQcSamples(currentSetNo);
      values.forEach((value, index) => {
        value.index = nextPosition;
        value.position = platePositionList[nextPosition];
        samplePosition.push(nextPosition);
        nextPosition++;
        nextPosition = getNextEmptyPosition(nextPosition);
      })
      samplePositionMap[currentSetNo] = samplePosition;
      totalSamples = totalSamples.concat(qcSamples.concat(values));
    })

    setSamplePositionMap(samplePositionMap);
    return totalSamples;
  }

  function getNextEmptyPosition(iter: number) {
    while (allQcPosition.indexOf(iter) > -1) {
      iter++;
    }
    return iter;
  }

  function BuildQcSamples(setNo: number) {
    const qcSamples: any[] = [];

    blankQcPosition.forEach(position => {
      qcSamples.push({index: position, position: platePositionList[position], type: QCTypeEnum.Blank, set: setNo});
    })

    solventQcPosition.forEach(position => {
      qcSamples.push({index: position, position: platePositionList[position], type: QCTypeEnum.Solvent, set: setNo});
    })

    customQcPosition.forEach(position => {
      qcSamples.push({index: position, position: platePositionList[position], type: QCTypeEnum.Custom, set: setNo});
    })

    ltrQcPosition.forEach(position => {
      qcSamples.push({index: position, position: platePositionList[position], type: QCTypeEnum.LTR, set: setNo});
    })

    pooledQcPosition.forEach(position => {
      qcSamples.push({index: position, position: platePositionList[position], type: QCTypeEnum.Pooled, set: setNo});
    })

    return qcSamples;
  }

  function StateFullWellPicker(pickerProps: IStateFullWellPickerProps) {
    const {value: initialValue, ...otherProps} = pickerProps;
    const [value, setValue] = useState(initialValue);

    return <MultiWellPicker value={value} onChange={(value1) => {
      setValue(value1)
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
        style: {
          fill: 'black',
          fontSize: 12,
          fontWeight: 500,
        }
      }
    },
    yAxis: {
      label: {
        style: {
          fill: 'black',
          fontSize: 12,
          fontWeight: 500,
        }
      }
    },
    legend: {
      itemName: {
        style: {
          fill: 'black',
          fontSize: 12,
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
        <Col span={8}>
          <Card size={"small"}
                extra={<Button onClick={onExportExcel} type={"primary"}><DownloadOutlined/>Export</Button>}>
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
                <ProFormSelect width={150} name="interBatchBalanceMethod" label='Inter-Batch'
                               valueEnum={BalanceMethodEnum} initialValue={"2"}
                               fieldProps={{
                                 onChange: (value) => setInterBatchBalanceMethod(value),
                                 size: 'small'
                               }}/>
                <ProFormSelect width={80} name="interBatchBalanceDim" label='Dim'
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
                <ProFormSelect width={150} name="intraBatchRandomMethod" label='Intra-Batch'
                               valueEnum={RandomMethodEnum} initialValue={"2"}
                               fieldProps={{onChange: (value) => setIntraBatchRandomMethod(value), size: 'small'}}/>
                <ProFormSelect width={80} name="intraBatchRandomDim" label='Dim'
                               valueEnum={DimsEnum} initialValue={"1"}
                               fieldProps={{
                                 onChange: (value) => {
                                   setIntraBatchRandomDim(value)
                                 }, size: 'small'
                               }}/>
                <Button type={'primary'} onClick={() => IntraBatchRandom()}>Random</Button>
              </ProForm.Group>
            </ProForm>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={"Distribution on Sets"} size={'small'}>
            <Column height={200} autoFit={true} isStack={true} data={setSamples} xField={'set'}
                    yField={'count'} seriesField={'dim'} {...config}/>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={"Injection Order on Set No" + setNo} size={'small'}>
            <Scatter height={200} autoFit={true} data={sortedSamples} xField={'index'}
                     colorField={DimsEnum[intraBatchRandomDim]} size={5}
                     yField={DimsEnum[intraBatchRandomDim]} shapeField={DimsEnum[intraBatchRandomDim]} {...config}
                     legend={false}/>
          </Card>
        </Col>
        <Col span={12}>
          <StateFullWellPicker
            rows={plateRow}
            columns={plateCol}
            wellSize={wellSize}
            renderText={({index}) => <div style={{fontSize: 12}}>{index + 1}</div>}
            value={[0]}
            displayAsGrid={false}
            format={yaxisFormat}
            order={direction === "Vertical" ? IterationOrder.ByRow : IterationOrder.ByColumn}
            rangeSelectionMode={RangeSelectionMode.zone}
            style={({index, wellPlate, disabled, booked, selected}) => {
              return buildStyles({index, wellPlate, disabled, booked, selected},
                customQcPosition,
                ltrQcPosition,
                pooledQcPosition,
                solventQcPosition,
                blankQcPosition,
                samplePositionMap[setNo]
              )
            }
            }
          />
        </Col>
        <Col span={12}>
          <ProTable<SampleSequence>
            size={'small'}
            columns={columns}
            actionRef={tableRef}
            //@ts-ignore
            dataSource={dataSource.filter(data => data.set === setNo)}
            editable={{
              type: 'multiple',
            }}
            scroll={{
              y: 800
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
            pagination={false}
            dateFormatter="string"
            headerTitle="Sample"
            toolBarRender={false}
          />
        </Col>
      </Row>
    </>
  );
};

export default PlateDesign;
