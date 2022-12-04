import type {Pagination, Result} from '@/domains/Common';
import type {Sample} from '@/domains/Sample.d';
import {buildColumn} from '@/pages/project/arrangement/Column';
import PreOrderService from '@/services/PreOrderService';
import SampleService from '@/services/SampleService';
import {url} from '@/utils/request';
import {DeleteOutlined, DownloadOutlined, TabletFilled, UploadOutlined,} from '@ant-design/icons';
import {ProForm} from '@ant-design/pro-components';
import type {ProFormInstance} from '@ant-design/pro-form';
import {ProFormDigit} from '@ant-design/pro-form';
import type {ActionType} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {Alert, Button, Card, Col, message, Modal, Row, Space, Steps,} from 'antd';
import type {Key} from 'react';
import React, {useEffect, useRef, useState} from 'react';
import {Direction, PlateNumber, PlateTypeEnum, QCColors, QCTypeEnum} from '@/components/Enums/Const';

import ExcelUpload from '@/pages/project/arrangement/ExcelUpload';
import {getParam} from "@/utils/StringUtil";
import {ProFormSelect} from "@ant-design/pro-form/es";
//@ts-ignore
import {FormattedMessage, useIntl, useLocation} from "umi";
import {groupByAndCount4Samples, groupBySample} from "@/utils/CommonUtil";
import {Column} from "@ant-design/charts";
import PlateDesign from "@/pages/project/arrangement/PlateDesigner";
import {MultiWellPicker} from "@/pages/arrangement/manager/WellPicker";
import {IterationOrder, PositionFormat} from "well-plates";
import WorkSheet from "@/pages/project/arrangement/WorkSheet";
import Preview from "@/pages/project/arrangement/PreView";
import {buildStyles} from "@/pages/arrangement/manager/util/PlateStyle";

const {Step} = Steps;
const ProjectDetail: React.FC = () => {

  /**
   * service
   */
  const sampleService = new SampleService();
  new PreOrderService();

  const [projectId, setProjectId] = useState<string | undefined>();
  const [current, setCurrent] = useState(0);
  /**
   * 样本管理tableRef
   */
  const tableRef = useRef<ActionType>(); //Table组件的引用
  const updateFormRef = useRef<ProFormInstance>();

  const [total, setTotal] = useState<any>(); //数据总行
  const [loading, setLoading] = useState<boolean>(); //数据总行数
  const [sampleRowKeys, setSampleRowKeys] = useState<Key[]>([]); //样本接收行Keys信息
  const [showExcelUpload, setShowExcelUpload] = useState<boolean>(false); //样本excel导入

  const [plateRow, setPlateRow] = useState<number>(8);
  const [plateCol, setPlateCol] = useState<number>(12);
  const [wellSize, setWellSize] = useState<number>(60);

  const [paramsSizeError, setParamsSizeError] = useState<string>();
  const [plateCount, setPlateCount] = useState<number>(1); //需要的板子数目
  const [selectedValues, setSelectedValues] = useState<any[]>([]);

  // 工单拷贝
  useState<any>(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  const intl = useIntl();

  const [customQcPosition, setCustomQcPosition] = useState<any[]>([]);
  const [pooledQcPosition, setPooledQcPosition] = useState<any[]>([]);
  const [solventQcPosition, setSolventQcPosition] = useState<any[]>([]);
  const [ltrQcPosition, setLtrQcPosition] = useState<any[]>([]);
  const [blankQcPosition, setBlankQcPosition] = useState<any[]>([]);

  const [plateType, setPlateType] = useState<string>('2');
  const [maxSamplesOnSinglePlate, setMaxSamplesOnSinglePlate] = useState<number>(96);
  const [plateNumber, setPlateNumber] = useState<PositionFormat>(PositionFormat.LetterNumber);
  const [plateDirection, setPlateDirection] = useState<string>("Vertical");

  // randomization return
  const [randomSampleRes, setRandomSampleRes] = useState<any>({});
  const [targetKeys, setTargetKeys] = useState<any>([]);
  const [selectBatch, setSelectBatch] = useState<any>();
  const [injectTemplate, setInjectTemplate] = useState<any>();
  const [judge, setJudge] = useState<number>(1);

  /********************
   * 质谱工单 function
   *******************/
  const [sampleData, setSampleData] = useState<Sample[]>();
  const [dim1Sample, setDim1Sample] = useState<any>();
  const [dim2Sample, setDim2Sample] = useState<any>();
  const [dim3Sample, setDim3Sample] = useState<any>();
  const [dim1, setDim1] = useState<Record<string, any>[]>([]);
  const [dim2, setDim2] = useState<Record<string, any>[]>([]);
  const [dim3, setDim3] = useState<Record<string, any>[]>([]);

  /**
   * 项目id
   */
  const currentProjectId = getParam(useLocation(), "projectId");

  /**
   * 初始化页面
   */
  useEffect(() => {
    setProjectId(currentProjectId);
  }, []);

  useEffect(() => {
    judgeIfOutOfIndex()
  }, [judge]);

  const onChange = (value: number) => {
    setCurrent(value);
  };

  const buildPlateType = (row: number, col: number, wSize: number) => {
    setPlateRow(row);
    setPlateCol(col);
    setWellSize(wSize);
  }

  const removeFromOther = (values: number[]) => {
    values.forEach(value => {
      if (customQcPosition.indexOf(value) !== -1) {
        customQcPosition.splice(customQcPosition.indexOf(value), 1);
      }
      if (ltrQcPosition.indexOf(value) !== -1) {
        ltrQcPosition.splice(ltrQcPosition.indexOf(value), 1);
      }
      if (solventQcPosition.indexOf(value) !== -1) {
        solventQcPosition.splice(solventQcPosition.indexOf(value), 1);
      }
      if (pooledQcPosition.indexOf(value) !== -1) {
        pooledQcPosition.splice(pooledQcPosition.indexOf(value), 1);
      }
      if (blankQcPosition.indexOf(value) !== -1) {
        blankQcPosition.splice(blankQcPosition.indexOf(value), 1);
      }
    })
    buildQCInfo(customQcPosition, blankQcPosition, ltrQcPosition, solventQcPosition, pooledQcPosition);
  }

  const getTotalCapacity = () => {
    return maxSamplesOnSinglePlate + pooledQcPosition.length + ltrQcPosition.length + solventQcPosition.length + customQcPosition.length + blankQcPosition.length
  }

  const getCapacity = () => {
    return pooledQcPosition.length + ltrQcPosition.length + solventQcPosition.length + customQcPosition.length + blankQcPosition.length
  }

  const judgeIfOutOfIndex = () => {
    setParamsSizeError(undefined);
    switch (plateType) {
      case "1":
        if (getTotalCapacity() > 81) {
          if (getCapacity() > 81) {
            setParamsSizeError("Max Samples Count + QC Count must <= 81");
          } else {
            setMaxSamplesOnSinglePlate(81 - getCapacity());
          }
        }
        break;
      case "2":
        if (getTotalCapacity() > 96) {
          if (getCapacity() > 96) {
            setParamsSizeError("Max Samples Count + QC Count must <= 96");
          } else {
            setMaxSamplesOnSinglePlate(96 - getCapacity());
          }

        }
        break;
      case "3":
        if (getTotalCapacity() > 384) {
          if (getCapacity() > 384) {
            setParamsSizeError("Max Samples Count + QC Count must <= 384");
          } else {
            setMaxSamplesOnSinglePlate(384 - getCapacity());
          }
        }
        break;
    }
  }

  /**
   * 样本接受toolbar
   */
  function buildToolbar(): any {
    return {
      actions: [
        <Button
          type={'primary'}
          key="batchImport"
          icon={<UploadOutlined/>}
          onClick={() => {
            setShowExcelUpload(true);
          }}
        >
          <FormattedMessage id='batch.import.samples'/>
        </Button>,
        <Button
          key="downloadTemplate"
          icon={<DownloadOutlined/>}
        >
          <a href={`${url}/static/SampleTemplate.xlsx`}> Download Sample Excel</a>
        </Button>,
        <Button key={'delete'} danger icon={<DeleteOutlined/>} onClick={doRemove}> Delete</Button>
      ],
      settings: []
    };

  }

  const buildQCInfo = (customQcP: number[], blankQcP: number[], ltrQcP: number[], solventQcP: number[], pooledQcP: number[]) => {
    setCustomQcPosition(customQcP);
    setBlankQcPosition(blankQcP);
    setLtrQcPosition(ltrQcP);
    setSolventQcPosition(solventQcP);
    setPooledQcPosition(pooledQcP);
    setJudge(judge + 1);
  }

  /********************
   * 样本接收 function
   *******************/
  /**
   * 样本修改
   * @param values
   */
  async function doSampleUpdate(values: Sample): Promise<boolean> {
    try {
      setLoading(true);
      await sampleService.update(values);
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'update.success'})}`);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'update.failed'})}`);
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 删除样本
   * @param value
   */
  async function doSampleDelete(value: Key): Promise<boolean> {
    try {
      setLoading(true);
      await sampleService.delete(value);
      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'delete.failed'})}`);
      return false;
    } finally {
      tableRef?.current?.reload();
      setLoading(false);
    }
  }

  /**
   * 批量删除样本
   */
  async function doRemove(): Promise<boolean> {
    if (sampleRowKeys.length == 0) {
      message.warn(`${intl.formatMessage({id: 'select.project'})}`);
      return false;
    }
    try {
      setLoading(true);
      await sampleService.remove(sampleRowKeys);
      setSampleRowKeys([]);
      tableRef?.current?.reload();

      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'delete.failed'})}`);
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 样本列表查询
   * @param params
   */
  async function doSampleList(params: {
    pageSize: number;
    current: number;
  }): Promise<Result<Sample[]>> {
    const result = await sampleService.all({...params, projectId});
    const sList = result.data;
    setPlateCount(Math.ceil(sList.length / 96));
    const {dim1List, dim2List, dim3List} = groupBySample(sList);
    setSampleData(result.data);
    setDim1Sample(dim1List);
    setDim2Sample(dim2List);
    setDim3Sample(dim3List);

    const {dimRes1, dimRes2, dimRes3} = groupByAndCount4Samples(sList);
    setDim1(dimRes1);
    setDim2(dimRes2);
    setDim3(dimRes3);
    setTotal(sList.length);
    return Promise.resolve(result);
  }

  /********************
   * 前处理 function
   *******************/
  const columnConfig: any = {
    height: 600,
    isStack: true,
    isPercent: true,
    xField: 'dim',
    seriesField: 'name',
    xAxis: {
      label: {
        style: {
          fill: 'black',
          fontSize: 16,
          fontWeight: 500,
        }
      }
    },
    yAxis: {
      label: {
        style: {
          fill: 'black',
          fontSize: 14,
          fontWeight: 300,
        }
      }
    },
    yField: 'count',
    padding: [100, 0, 0, 0],
    legend: {
      position: 'top',
      // maxRow: 4,
      itemHeight: 12,
      layout: 'horizontal',
      flipPage: false,
      itemName: {
        style: {
          fill: 'black',
          fontSize: 12,
          fontWeight: 500
        }
      }
    },
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
      content: (item: any) => {
        return (item.count * 100).toFixed(2) + "%";
      },
    }
  }

  const clearQcPosition = (label?: string) => {
    switch (label) {
      case QCTypeEnum.Custom: // Custom QC
        setCustomQcPosition([]);
        break;
      case QCTypeEnum.LTR: //Long-Term Reference QC
        setLtrQcPosition([]);
        break;
      case QCTypeEnum.Pooled: //Pooled QC
        setPooledQcPosition([]);
        break;
      case QCTypeEnum.Solvent: //Solvent QC
        setSolventQcPosition([]);
        break;
      case QCTypeEnum.Blank: //Blank QC
        setBlankQcPosition([]);
        break;
      default:
        buildQCInfo([], [], [], [], []);
        break;
    }
    setJudge(judge + 1)
  }

  const onQcPositionSelected = (label?: string) => {
    if (selectedValues && selectedValues.length > 0) {
      const selectedPositions = selectedValues.map(value => value + 1);
      removeFromOther(selectedPositions);
      switch (label) {
        case QCTypeEnum.Custom: // Custom QC
          setCustomQcPosition(selectedPositions);
          break;
        case QCTypeEnum.LTR: //Long-Term Reference QC
          setLtrQcPosition(selectedPositions);
          break;
        case QCTypeEnum.Pooled: //Pooled QC
          setPooledQcPosition(selectedPositions);
          break;
        case QCTypeEnum.Solvent: //Solvent QC
          setSolventQcPosition(selectedPositions);
          break;
        case QCTypeEnum.Blank: //Blank QC
          setBlankQcPosition(selectedPositions);
          break;
        default:
          break;
      }

      setJudge(judge + 1);
      setSelectedValues([]);
    }
  }
  /**
   * 项目管理流程
   */
  const projectSteps = [
    {
      title: "Upload Samples",
      content:
        <Card>
          <Row gutter={[5, 5]}>
            <Col span={16}>
              <ProTable<Sample, Pagination>
                scroll={{x: 'max-content'}}
                headerTitle={total + " Samples"}
                actionRef={tableRef}
                rowKey="id"
                loading={loading}
                size="small"
                toolbar={buildToolbar()}
                search={false}
                pagination={{
                  pageSize: 20
                }}
                request={doSampleList}
                columns={buildColumn(updateFormRef, doSampleUpdate, doSampleDelete)}
                rowSelection={{
                  selectedRowKeys: sampleRowKeys,
                  onChange: (newSelectedRowKeys: Key[]) => {
                    setSampleRowKeys(newSelectedRowKeys);
                  },
                }}
              />
            </Col>
            <Col span={8}>
              <Row gutter={[5, 5]}>
                <Col span={8}>
                  <Card size={'small'} title={'Dim1'}>
                    <Column data={dim1} {...columnConfig}/>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size={'small'} title={'Dim2'}>
                    <Column data={dim2} {...columnConfig}/>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size={'small'} title={'Dim3'}>
                    <Column data={dim3} {...columnConfig}/>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
    },
    {
      title: 'Design Params',
      content: <Card>
        <Row gutter={[5, 5]}>
          <Col span={4}>
            <Row>
              <Col span={24}>
                {paramsSizeError !== undefined ?
                  <Alert type={"error"} banner={true} message={paramsSizeError}/> : <></>}
                <Alert type={'success'} banner={true} message={plateCount + " Plates Needed"}/>
              </Col>
              <Col span={24}>
                <ProForm
                  style={{marginTop: 20}}
                  onValuesChange={(changedValues) => {
                    setParamsSizeError(undefined);
                    if (changedValues.plateType) {
                      setPlateType(changedValues.plateType)
                    }
                    if (changedValues.maxSamplesOnSinglePlate) {
                      setMaxSamplesOnSinglePlate(changedValues.maxSamplesOnSinglePlate)
                    }
                    setPlateCount(Math.ceil(total / maxSamplesOnSinglePlate))
                    setJudge(judge + 1)
                  }}
                  name="basic"
                  layout="vertical"
                  submitter={false}
                  initialValues={{
                    plateNumber,
                    maxSamplesOnSinglePlate,
                    plateType,
                  }}>
                  <ProForm.Group>
                    <ProFormSelect rules={[{required: true, message: 'required'}]} width={150} name="plateType"
                                   label={"Plate"} valueEnum={PlateTypeEnum}
                                   fieldProps={{
                                     onSelect: function (label: string) {
                                       switch (label) {
                                         case "1":
                                           buildPlateType(9, 9, 60);
                                           break;
                                         case "2":
                                           buildPlateType(8, 12, 60);
                                           break;
                                         case "3":
                                           buildPlateType(16, 24, 35);
                                           break;
                                         default:
                                           buildPlateType(8, 12, 60);
                                       }
                                       buildQCInfo([], [], [], [], []);
                                     }
                                   }}
                    />
                    <ProFormDigit rules={[{required: true, message: 'required'}]} width={150}
                                  name="maxSamplesOnSinglePlate" min={1} label={"Max Samples on Single Plate"}
                                  fieldProps={{
                                    value: maxSamplesOnSinglePlate,
                                    onChange: (value: any) => {
                                      setMaxSamplesOnSinglePlate(value);
                                    }
                                  }}
                    />
                    <ProFormSelect rules={[{required: true, message: 'required'}]} width={150} name="plateNumber"
                                   label={"Plate Number"} valueEnum={PlateNumber}
                                   fieldProps={{
                                     onSelect: (label: PositionFormat) => {
                                       setPlateNumber(label);
                                     }
                                   }}/>
                    <ProFormSelect rules={[{required: true, message: 'required'}]} width={150} name="direction"
                                   label={"Direction"} valueEnum={Direction} initialValue={plateDirection}
                                   fieldProps={{
                                     onSelect: (label: string) => {
                                       setPlateDirection(label);
                                       buildQCInfo([],[],[],[],[])
                                     }
                                   }}/>
                  </ProForm.Group>
                </ProForm>
              </Col>
            </Row>
          </Col>
          <Col span={10}>
            <MultiWellPicker value={selectedValues} rows={plateRow} columns={plateCol} wellSize={wellSize}
                             format={plateNumber}
                             order={plateDirection === "Vertical" ? IterationOrder.ByRow : IterationOrder.ByColumn}
                             style={({index, wellPlate, disabled, booked, selected}) => {
                               return buildStyles({index, wellPlate, disabled, booked, selected},
                                 customQcPosition,
                                 ltrQcPosition,
                                 pooledQcPosition,
                                 solventQcPosition,
                                 blankQcPosition,
                                 []);
                             }}
                             onChange={(values, labels) => {
                               if (values.length === 1 && selectedValues.length === 1 && values[0] === selectedValues[0]) {
                                 setSelectedValues([]);
                               } else {
                                 setSelectedValues(values);
                               }
                             }}
                             renderText={({label}) => {
                               return (
                                 <div style={{fontSize: 12}}>
                                   <div>{label}</div>
                                 </div>
                               );
                             }}/>
          </Col>
          <Col span={10}>
            <Space direction={"vertical"} style={{marginBottom: 10}}>
              <Space>
                <Button type={'primary'} onClick={() => onQcPositionSelected(QCTypeEnum.Custom)}>Add</Button>
                <Button danger onClick={() => clearQcPosition(QCTypeEnum.Custom)}>Clear</Button>
                <TabletFilled
                  style={{fontSize: "24px", color: QCColors.Custom}}/><b>{customQcPosition.length}</b> Custom QC
              </Space>
              <Space>
                <Button type={'primary'} onClick={() => onQcPositionSelected(QCTypeEnum.LTR)}>Add</Button>
                <Button danger onClick={() => clearQcPosition(QCTypeEnum.LTR)}>Clear</Button>
                <TabletFilled style={{fontSize: "24px", color: QCColors.LTR}}/><b>{ltrQcPosition.length}</b> Long-Term
                Reference QC
              </Space>
              <Space>
                <Button type={'primary'} onClick={() => onQcPositionSelected(QCTypeEnum.Pooled)}>Add</Button>
                <Button danger onClick={() => clearQcPosition(QCTypeEnum.Pooled)}>Clear</Button>
                <TabletFilled
                  style={{fontSize: "24px", color: QCColors.Pooled}}/><b>{pooledQcPosition.length}</b> Pooled QC
              </Space>
              <Space>
                <Button type={'primary'} onClick={() => onQcPositionSelected(QCTypeEnum.Solvent)}>Add</Button>
                <Button danger onClick={() => clearQcPosition(QCTypeEnum.Solvent)}>Clear</Button>
                <TabletFilled
                  style={{fontSize: "24px", color: QCColors.Solvent}}/><b>{solventQcPosition.length}</b> Solvent QC
              </Space>
              <Space>
                <Button type={'primary'} onClick={() => onQcPositionSelected(QCTypeEnum.Blank)}>Add</Button>
                <Button danger onClick={() => clearQcPosition(QCTypeEnum.Blank)}>Clear</Button>
                <TabletFilled style={{fontSize: "24px", color: QCColors.Blank}}/><b>{blankQcPosition.length}</b> Blank
                QC
              </Space>
              <Button danger onClick={() => clearQcPosition()}>Clear All</Button>
            </Space>
          </Col>
        </Row>
      </Card>,
    },
    {
      title: "Randomization",
      //@ts-ignore
      content: <PlateDesign plateType={plateType} maxSamplesOnSinglePlate={maxSamplesOnSinglePlate}
                            plateNumber={plateNumber} dimRes={[dim1Sample, dim2Sample, dim3Sample]}
                            customQcPosition={customQcPosition}
                            blankQcPosition={blankQcPosition}
                            pooledQcPosition={pooledQcPosition}
                            solventQcPosition={solventQcPosition}
                            ltrQcPosition={ltrQcPosition}
                            direction={plateDirection}
                            sampleData={sampleData} setRandomSampleRes={setRandomSampleRes}/>
    },
    {
      title: "WorkSheet",
      //@ts-ignore
      content: <WorkSheet randomSample={randomSampleRes} setTargetKey={setTargetKeys} setSelectBatch={setSelectBatch}
                          setInjectTemplate={setInjectTemplate}/>
    },
    {
      title: "Finish",
      //@ts-ignore
      content: <Preview randomSample={randomSampleRes} targetKeys={targetKeys} selectBatch={selectBatch}
                        injectTemplate={injectTemplate}/>
    },
  ];
  return (
    <>
      <Card
        actions={[
          <Space>
            <Button key="Prev" onClick={() => setCurrent(current - 1)} disabled={current === 0}>Prev</Button>
            {current < 4 ? <Button key="Next" type="primary" onClick={() => setCurrent(current + 1)}
                                   disabled={paramsSizeError !== undefined}>Next</Button> :
              <Button type={"primary"}>Finish</Button>}
          </Space>
        ]}
      >
        <Steps
          type="navigation"
          size="small"
          labelPlacement="vertical"
          current={current}
          onChange={onChange}
          className="site-navigation-steps">
          {projectSteps.map((item) => (
            <Step key={item.title} title={item.title}/>
          ))}
        </Steps>
        <div className="steps-content">{projectSteps[current]?.content}</div>
      </Card>

      {/* 样本接收excel导入 */}
      <ExcelUpload
        addCoverStrDesc={`${intl.formatMessage({id: 'sample.overwrite.warning'}) + "," + intl.formatMessage({id: 'confirm.overwrite'})}`}
        newAddStrDesc={`${intl.formatMessage({id: 'upload.sample.file.tip.1'})}`}
        outVoStr=""
        draggerStr={`${intl.formatMessage({id: 'download.to.fill.tip'})}`}
        id={projectId}
        coverStr={`${intl.formatMessage({id: 'overwrite.current.sample'})}`}
        newAddStr={`${intl.formatMessage({id: 'create.sample'})}`}
        title={`${intl.formatMessage({id: 'import.sample.by.excel'})}`}
        visible={showExcelUpload}
        setVisible={setShowExcelUpload}
        standardFileUrl={`${url}/static/SampleTemplate.xlsx`}
        actionUrl={`${url}/sample/check/excel`}
        uploadHandle={async function (addMode: number, file: any): Promise<boolean> {
          const res = await sampleService.uploadExcel({
            projectId: projectId,
            addMode: addMode,
            file: file,
          });
          if (res.success) {
            if (res.data.length) {
              Modal.warning({
                title: `${intl.formatMessage({id: 'samples.not.imported.successful.exist'})}`,
                content: <>`${intl.formatMessage({id: 'samples.not.imported.successful'})}`..</>,
              });
            } else {
              message.success(`${intl.formatMessage({id: 'upload.success'})}`);
              setProjectId(res.featureMap.projectId);
            }
            tableRef?.current?.reload();
            return true;
          } else {
            if (res.data.length && res.data instanceof Array) {
              Modal.warning({
                title: `${intl.formatMessage({id: 'samples.not.imported.successful.exist'})}`,
                content: <>`${intl.formatMessage({id: 'samples.not.imported.successful'})}`..</>,
              });
            }
            return false;
          }
        }}
      />

    </>
  );
};

export default ProjectDetail;
