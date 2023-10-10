import {Button, Card, Col, Row, Select, Space, Tag} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import type {IWellPickerProps} from "@/pages/arrangement/manager/WellPicker";
import {MultiWellPicker, RangeSelectionMode} from "@/pages/arrangement/manager/WellPicker";

import {ProTable} from '@ant-design/pro-components';
// @ts-ignore
import styles from "@/pages/run/Manager/AddTemplate/style.less";
import {IterationOrder, PositionFormat} from "well-plates";
import type {ActionType} from "@ant-design/pro-table";
import {blockRandom, completeRandom, randomBalance, stratifiedBalance} from "@/utils/CommonUtil";
import {Column, Scatter} from "@ant-design/charts";
import {
  BalanceMethodOptions,
  DimsEnum,
  DimsOptions,
  QCTypeEnum,
  RandomMethodOptions,
  SampleColors
} from "@/components/Enums/Const";
import type {Sample} from "@/domains/Sample.d";
import {groupBy} from "lodash";
import * as ExcelJs from 'exceljs';
import {generateHeaders, saveWorkbook} from "@/utils/ExcelUtils";
import {buildStyles} from "@/pages/arrangement/manager/util/PlateStyle";
import {TabletFilled} from "@ant-design/icons";
import {SampleColumns} from "@/pages/project/arrangement/Column";

type IStateFullWellPickerProps = Omit<IWellPickerProps, 'onChange'>;
const PlateDesign: React.FC = (props: any) => {

  const [setNo, setSetNo] = useState(1);
  const [sortedSamples, setSortedSamples] = useState<Record<string, any>[]>([])
  const [barData, setBarData] = useState<any[]>([])
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
  const [direction] = useState<IterationOrder>(props.direction)
  const [sampleGroups, setSampleGroups] = useState({})

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

  function insertQcSamples(plateNo: number, samples: any[]) {
    const qcSamples = BuildQcSamples(plateNo);
    const qcMap = groupBy(qcSamples, 'type')
    //如果有Blank样品,第一针调整为Blank
    if (qcMap[QCTypeEnum.Blank] && qcMap[QCTypeEnum.Blank].length > 0){
      samples.splice(0, 0, qcMap[QCTypeEnum.Blank][0]);
      qcMap[QCTypeEnum.Blank] = qcMap[QCTypeEnum.Blank].slice(1, qcMap[QCTypeEnum.Blank].length);
    }
    if (qcMap[QCTypeEnum.LTR] && qcMap[QCTypeEnum.LTR].length > 0){
      samples.splice(samples.length, 0, qcMap[QCTypeEnum.LTR][0]);
      qcMap[QCTypeEnum.LTR] = qcMap[QCTypeEnum.LTR].slice(1, qcMap[QCTypeEnum.LTR].length);
    }
    Object.entries(qcMap).forEach((entry) => {
      const step = Math.floor(samples.length / (entry[1].length + 1))
      for (let i = 1; i <= entry[1].length; i++) {
        samples.splice(step*i, 0, entry[1][i-1]);
      }
    })
    return samples;
  }

  function setSetMap(samples: any[]) {
    const groups = groupBy(samples, "set");
    Object.entries(groups).forEach(entry => {
      entry[1].sort((a, b) => a.index - b.index);
      const tempSamples = insertQcSamples(Number(entry[0]), entry[1]);
      tempSamples.map((item, index)=>item.index = index+1);
      groups[entry[0]] = tempSamples;
    })
    setSampleGroups(groups);
    props.setSetMap(groups)
  }

  function Init() {
    buildPlateType(props.plateRow, props.plateCol, props.wellSize);
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

  //切换算法的时候触发, props.sampleData是原始样品数据
  useEffect(() => {
    if (sampleData === undefined || sampleData.length === 0) {
      IntraBatchRandom(InterBatchBalance(props.sampleData));
    } else {
      IntraBatchRandom(InterBatchBalance(sampleData));
    }
  }, [interBatchBalanceMethod, interBatchBalanceDim])

  useEffect(() => {
    const newSampleData = sampleData?.sort((a: any, b: any) => a.index - b.index)
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

    setBarData(sampleStat);
    setSortedSamples(sampleData.filter((data: Record<string, any>) => data.set === setNo));
    setSetMap(newSampleData);
  }, [sampleData])

  //切换板子的时候触发
  useEffect(() => {
    setSortedSamples(sampleData.filter((data: Record<string, any>) => data.set === setNo))
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
    if (direction === IterationOrder.ByColumn) {
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
      values.forEach((value, index) => {
        value.index = nextPosition;
        value.position = platePositionList[nextPosition - 1];
        samplePosition.push(nextPosition);
        nextPosition++;
        nextPosition = getNextEmptyPosition(nextPosition);
      })
      samplePositionMap[currentSetNo] = samplePosition;
      totalSamples = totalSamples.concat(values);
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
      qcSamples.push({index: position, position: platePositionList[position - 1], type: QCTypeEnum.Blank, set: setNo});
    })

    solventQcPosition.forEach(position => {
      qcSamples.push({
        index: position,
        position: platePositionList[position - 1],
        type: QCTypeEnum.Solvent,
        set: setNo
      });
    })

    customQcPosition.forEach(position => {
      qcSamples.push({index: position, position: platePositionList[position - 1], type: QCTypeEnum.Custom, set: setNo});
    })

    ltrQcPosition.forEach(position => {
      qcSamples.push({index: position, position: platePositionList[position - 1], type: QCTypeEnum.LTR, set: setNo});
    })

    pooledQcPosition.forEach(position => {
      qcSamples.push({index: position, position: platePositionList[position - 1], type: QCTypeEnum.Pooled, set: setNo});
    })

    qcSamples.sort((a, b) => a.index - b.index);
    return qcSamples;
  }

  function StateFullWellPicker(pickerProps: IStateFullWellPickerProps) {
    const {value: initialValue, ...otherProps} = pickerProps;
    const [value, setValue] = useState(initialValue);

    return <MultiWellPicker value={value} onChange={(value1) => {
      setValue(value1)
    }} {...otherProps} />;
  }

  function onExportExcel() {
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('sheet');
    // 设置 sheet 的默认行高
    worksheet.properties.defaultRowHeight = 20;
    // 设置列
    worksheet.columns = generateHeaders(SampleColumns);
    // 添加行
    worksheet.addRows(sampleGroups[setNo]);
    // 导出excel
    saveWorkbook(workbook, 'Injection-Random-Simple-SetNo' + setNo + '.xlsx');
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
    }

  }
  // @ts-ignore
  return (
    <>
      <Row gutter={[5, 5]}>
        <Col span={8}>
          <Card size={"small"} title={"Base Information"}>
            <Space>
              Total Samples:<Tag color={'green'}>{props.sampleData?.length}</Tag>
              Total Plates:<Tag color={'green'}>{plateCount}</Tag>
              Direction:<Tag color={'green'}>{direction === IterationOrder.ByRow ? "Vertical" : "Horizontal"}</Tag>
            </Space>
          </Card>
        </Col>
        <Col span={16}>
          <Card size={"small"} title={"QC Information"}>
            <Space size={30}>
              <Space>
                <TabletFilled style={{color: SampleColors.Custom}}/><b>{customQcPosition.length}</b> Custom QC
              </Space>
              <Space>
                <TabletFilled style={{color: SampleColors.LTR}}/><b>{ltrQcPosition.length}</b> Long-Term Reference QC
              </Space>
              <Space>
                <TabletFilled style={{color: SampleColors.Pooled}}/><b>{pooledQcPosition.length}</b> Pooled QC
              </Space>
              <Space>
                <TabletFilled style={{color: SampleColors.Blank}}/><b>{blankQcPosition.length}</b> Blank QC
              </Space>
              <Space>
                <TabletFilled style={{color: SampleColors.Solvent}}/><b>{solventQcPosition.length}</b> Solvent QC
              </Space>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card size={'small'} title={"Distribution on Sets"} extra={<Space>
            Inter-Batch Balancing:<Select style={{width: 150}} defaultValue={BalanceMethodOptions[1]} size={'small'}
                                          options={BalanceMethodOptions}
                                          onSelect={(lv: any) => setInterBatchBalanceMethod(lv)}/>
            Dim:<Select style={{width: 80}} defaultValue={"1"} size={'small'}
                        options={DimsOptions} onSelect={(lv) => setInterBatchBalanceDim(lv)}/>
            <Button type={'primary'} size={'small'}
                    onClick={() => IntraBatchRandom(InterBatchBalance())}>Balance</Button></Space>}>
            <Column height={150} autoFit={true} isStack={true} data={barData} xField={'set'}
                    yField={'count'} seriesField={'dim'} {...config}/>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={"Injection Order on Set No" + setNo} size={'small'} extra={<Space>
            Intra-Batch Randomization:<Select style={{width: 150}} defaultValue={RandomMethodOptions[1]} size={'small'}
                                              options={RandomMethodOptions}
                                              onSelect={(lv: any) => setIntraBatchRandomMethod(lv)}/>
            Dim:<Select style={{width: 80}} defaultValue={"1"} size={'small'}
                        options={DimsOptions} onSelect={(lv) => setIntraBatchRandomDim(lv)}/>
            <Button type={'primary'} size={'small'} onClick={() => IntraBatchRandom()}>Random</Button></Space>}>
            <Scatter height={150} autoFit={true} data={sortedSamples} xField={'index'}
                     colorField={DimsEnum[intraBatchRandomDim]} size={5} shape={["circle", "square", "diamond"]}
                     yField={DimsEnum[intraBatchRandomDim]} shapeField={DimsEnum[intraBatchRandomDim]} {...config}
                     xAxis={false} legend={false}/>
          </Card>
        </Col>
        <Col span={10}>
          <Card size={'small'} title={"Plate Design--Set No" + setNo}
                extra={<Space>Set No.<Select size={'small'} defaultValue={1} style={{width: 80}}
                                             onSelect={(lv) => setSetNo(Number(lv))}
                                             options={plateCountArr?.map((item) => {
                                               return {value: item, label: item}
                                             })}/></Space>}>
            <center>
            <StateFullWellPicker
              rows={plateRow}
              columns={plateCol}
              wellSize={wellSize}
              renderText={({index}) => <div style={{fontSize: 12}}>{index + 1}</div>}
              value={[0]}
              displayAsGrid={false}
              format={yaxisFormat}
              order={direction}
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
            </center>
          </Card>
        </Col>
        <Col span={14}>
          <Card size={'small'} title={"Set No." + setNo}>
            <ProTable
              size={'small'}
              columns={SampleColumns}
              actionRef={tableRef}
              dataSource={sampleGroups[setNo]}
              rowKey="id"
              search={false}
              pagination={{
                pageSize: 15
              }}
              toolBarRender={false}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlateDesign;
