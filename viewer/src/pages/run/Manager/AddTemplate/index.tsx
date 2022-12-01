import React, {useEffect, useRef, useState} from 'react';
import type { FormInstance} from 'antd';
import {Collapse, message, Popconfirm} from 'antd';
import {Card, Result, Button, Divider, Alert, Tag} from 'antd';
import type {ProFormInstance} from '@ant-design/pro-form';
import ProForm, {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm
} from '@ant-design/pro-form';
import type {StepDataType} from './data';
import styles from './style.less';
import {AddThree, ReduceOne} from "@icon-park/react";
import {BackwardOutlined, CheckCircleTwoTone, MenuOutlined, PlusOutlined} from "@ant-design/icons";
import type {PreInjectionDetailType} from "./data";
import PreHeartTable from "@/pages/run/Manager/AddTemplate/PreCollection";
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import type { ProColumns} from '@ant-design/pro-components';
import {arrayMoveImmutable, useRefFunction, ProTable, ModalForm} from '@ant-design/pro-components';
import {FormattedMessage, history} from "@@/exports";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import RunTemplateService from "@/services/RunTemplateService";

/**
 * import service
 */
const runTemplateService = new RunTemplateService();


const StepForm: React.FC<Record<string, any>> = () => {
  /**
   * 进样样本详情
   */
  const [preInjectionDetailDemo, setPreInjectionDetailDemo] = useState<PreInjectionDetailType[]>([{
    injectionType: "warm-up",
    priority: 0,
    key: "0",
    sampleList: []
  }]);

  const PreInjectionDemo: PreInjectionDetailType = {
    injectionType: "warm-up",
    priority: 0,
    key: "0",
    sampleList: [],
  }

  const data = [
    {
      key: '1',
      name: 'CommonQC',
      times: 1,
      index: 0,
    },
    {
      key: '2',
      name: 'Long-Term Reference',
      times: 1,
      index: 1,
    },
    {
      key: '3',
      name: 'Pooled QC',
      times: 1,
      index: 2,
    },
    {
      key: '4',
      name: 'Solvent Blank QC',
      times: 1,
      index: 3,
    },
    {
      key: '5',
      name: 'Sample',
      times: 4,
      index: 4,
    },
  ];

  const [current, setCurrent] = useState(0);
  const formRef = useRef<FormInstance>();
  const [showRunSampleDetail, setShowRunSampleDetail] = useState<boolean>(false);
  const [currentCard, setCurrentCard] = useState<any>();

  //@ts-ignore
  // const [preInjectionType, setPreInjectionType] = useState<any>();
  const [cyclicRunVisible, setCyclicRunVisible] = useState<boolean>(false);
  const createFormRef = useRef<ProFormInstance>();
  const [dataSource, setDataSource] = useState<any>(data);

  // 可拖动
  const DragHandle = SortableHandle(() => <MenuOutlined style={{cursor: 'grab', color: '#999'}}/>);
  const columns: ProColumns[] = [
    {
      title: <FormattedMessage id='run.sort'/>,
      dataIndex: 'sort',
      width: 60,
      className: 'drag-visible',
      render: () => <DragHandle/>,
    },
    {
      title: <FormattedMessage id='run.sample.type'/>,
      dataIndex: 'name',
      className: 'drag-visible',
    },
    {
      title: <FormattedMessage id='run.sample.injection.times'/>,
      dataIndex: 'times',
    },
    {
      title: <FormattedMessage id='run.sample.injection.area'/>,
      dataIndex: 'address',
    },
    {
      title: <FormattedMessage id='run.template.option'/>,
      dataIndex: 'index',
      render: (text, sample) => [
        <Popconfirm placement={'topLeft'} title={<FormattedMessage id='confirm.delete'/>} key="delete"
                    onConfirm={() => {
                      const newDataSource = data;
                      newDataSource.splice(sample.key, 1)
                      setDataSource(newDataSource)
                    }}>
          <a><FormattedMessage id='delete'/></a>
        </Popconfirm>
      ],
    },
  ];

  const SortableItem = SortableElement((props: any) => <tr {...props} />);
  const SortContainer = SortableContainer((props: any) => <tbody {...props} />);
  const onSortEnd = useRefFunction(
    ({oldIndex, newIndex}: { oldIndex: number; newIndex: number }) => {
      if (oldIndex !== newIndex) {
        const newData = arrayMoveImmutable([...dataSource], oldIndex, newIndex).filter((el) => !!el);
        setDataSource([...newData]);
      }
    },
  );

  useEffect(() => {
    console.log("dataSource", dataSource)
  }, [dataSource]);

  const DraggableContainer = (props: any) => (
    <SortContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );
  const DraggableBodyRow = (props: any) => {
    const {className, style, ...restProps} = props;
    const index = dataSource.findIndex((x: any) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  /**
   * 创建模板接口
   */
  const handleAddRunTemplate = async (fields: any, datasource: any) => {
    const hide = message.loading("creating");
    try {
      await runTemplateService.submit({...fields, dataSource:datasource});
      message.success('create success');
      return true;
    } catch (error) {
      hide();
      message.error("create failed, try again");
      return false;
    }
  };

  return (
    <>
      <a style={{margin: 20}} onClick={() => {
        history.push("/run/list")
      }}><BackwardOutlined/><FormattedMessage id='run.template.return.view'/></a>
      <Card bordered={false}>
        <StepsForm
          current={current}
          onCurrentChange={setCurrent}
          onFinish={async (values) => {

            console.log("final", values, dataSource);
            // @ts-ignore
            handleAddRunTemplate(values, dataSource)
            message.success('submit success');
            return true;
          }}
          submitter={{
            render: (props) => {
              if (props.step === 0) {
                return (
                  <Button type="primary" onClick={() => props.onSubmit?.()}>
                    <FormattedMessage id='next.step'/> {'>'}
                  </Button>
                );
              }

              if (props.step === 1) {
                return [
                  <Button key="pre" onClick={() => props.onPre?.()}>
                    <FormattedMessage id='last.step'/>
                  </Button>,
                  <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                    <FormattedMessage id='next.step'/> {'>'}
                  </Button>,
                ];
              }
              if (props.step === 2) {
                return [
                  <Button key="pre" onClick={() => props.onPre?.()}>
                    <FormattedMessage id='last.step'/>
                  </Button>,
                  <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                    <FormattedMessage id='next.step'/> {'>'}
                  </Button>,
                ];
              }

              return [
                <Result
                  status="success"
                  title={<FormattedMessage id='run.operator.success'/>}
                  extra={
                    <>
                      <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                        {'<'} <FormattedMessage id='last.step'/>
                      </Button>,
                      <Button type="primary" onClick={() => {
                        formRef.current?.resetFields();
                        setCurrent(0);
                      }}>
                        <FormattedMessage id='run.template.return'/>
                      </Button>
                      <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                        <FormattedMessage id='submit'/> √
                      </Button>,
                    </>
                  }
                  className={styles.result}
                 />,
              ];
            },
          }}
        >
          <StepsForm.StepForm<StepDataType>
            formRef={formRef}
            // @ts-ignore
            title={<FormattedMessage id='run.template.new'/>}
            onFinish={async () => {
              return true;
            }}
          >
            <ProFormText
              label={<FormattedMessage id='run.template.name'/>}
              width="md"
              name="templateName"
              rules={[{required: true, message: <FormattedMessage id='run.template.name.rule'/>}]}
              placeholder="please input template name"
            />

            <ProFormText
              label={<FormattedMessage id='owner'/>}
              width="md"
              name="owner"
              rules={[{required: true, message: <FormattedMessage id='input.owner.tip'/>}]}
              // @ts-ignore
              placeholder={<FormattedMessage id='input.owner.tip'/>}
            />
            <ProFormSelect
              label={<FormattedMessage id='run.template.select.well.plate.type'/>}
              width="md"
              name="boardType"
              rules={[{required: true, message: <FormattedMessage id='run.template.select.well.plate.type'/>}]}
              valueEnum={{
                '96-well': '96-well',
                'ep-bottle': 'ep-bottle',
              }}
            />
            <ProFormTextArea
              label={<FormattedMessage id='run.template.desc'/>}
              width="md"
              name="comment"
              // @ts-ignore
              placeholder={<FormattedMessage id='run.template.desc'/>}
            />
          </StepsForm.StepForm>

          <StepsForm.StepForm<StepDataType>
            formRef={formRef}
            // @ts-ignore
            title={<FormattedMessage id='run.template.start.up.config'/>}
            onFinish={async () => {
              return true;
            }}
          >
            <ProForm.Group title={<FormattedMessage id='run.template.set.preinjection.sample'/>}>

              {/*{getResultConfigCard()}*/}
              <div className={styles.resultConfigCardsDiv}>
                <div>
                  {preInjectionDetailDemo.map((item, index) => {
                    return (
                      <div key={item.key}>
                        {preInjectionDetailDemo.length > 1 ? <span onClick={() => {
                          const newPreInjectionDemo = JSON.parse(JSON.stringify(preInjectionDetailDemo));
                          newPreInjectionDemo.splice(index, 1);
                          setPreInjectionDetailDemo(newPreInjectionDemo);
                        }} className={styles.deleteIcon}><ReduceOne/></span> : null}
                        <div>
                          <ProFormSelect
                            name={"preInjectionType" + item.key}
                            label={<FormattedMessage id='run.template.set.preInjection.type'/>}
                            tooltip={<FormattedMessage id='run.template.set.preInjection.type.tip'/>}
                            initialValue={item?.injectionType}
                            rules={[{
                              required: true,
                              message: <FormattedMessage id='run.template.set.preInjection.type.tip'/>
                            }]}
                            valueEnum={{
                              1: <FormattedMessage id='preInjection.sample.type.warmup'/>,
                              2: <FormattedMessage id='preInjection.sample.type.linear'/>,
                              3: <FormattedMessage id='preInjection.sample.type.qc'/>,
                              4: <FormattedMessage id='preInjection.sample.type.sample'/>
                            }}
                            //@ts-ignore
                            onChange={(value: any) => {
                              // setPreInjectionType(value)
                              console.log(value)
                            }}
                          />
                        </div>

                        <div>
                          <ProFormDigit
                            label={<FormattedMessage id='injection.priority'/>}
                            name={"priority" + item.key}
                            initialValue={item.priority}
                            min={-1}
                            max={999}
                            rules={[
                              {required: true, message: <FormattedMessage id='injection.priority.tip'/>},
                            ]}
                          />
                        </div>
                        <div>
                          <a onClick={() => {
                            setCurrentCard(item)
                            setShowRunSampleDetail(true)
                          }}>
                            <PlusOutlined/><FormattedMessage id='injection.add'/>
                          </a>
                          {item?.sampleList?.length === 0 ?
                            <Tag style={{color: "gray", marginLeft: 10}}><FormattedMessage
                              id='injection.empty'/></Tag> :
                            <a style={{marginLeft: 10}} onClick={() => {
                              setCurrentCard(item)
                              setShowRunSampleDetail(true)
                            }
                            }><CheckCircleTwoTone twoToneColor="#52c41a"/><FormattedMessage id='injection.view'/></a>}
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>
            </ProForm.Group>
            <a onClick={() => {
              const newPreInjectionDemo = JSON.parse(JSON.stringify(preInjectionDetailDemo));
              PreInjectionDemo.key = new Date().getTime().toString();
              newPreInjectionDemo.push(PreInjectionDemo);
              setPreInjectionDetailDemo(newPreInjectionDemo);
            }}>
              <span style={{fontSize: "12px", margin: '4px'}}><AddThree/><FormattedMessage id='injection.sequence.add'/></span>
            </a>

          </StepsForm.StepForm>

          <StepsForm.StepForm
            //@ts-ignore
            title={<FormattedMessage id='injection.Cyclic.sequence'/>}>
            <div className={styles.result}>
              <Alert
                closable
                showIcon
                message={<FormattedMessage id='injection.Cyclic.message'/>}
                style={{marginBottom: 24, width: 700}}
              />

              <Card
                bordered={true}
                style={{marginTop: 24, width: 700}}
                bodyStyle={{padding: '0 32px 40px 32px'}}
              >
                <ProTable
                  columns={columns}
                  rowKey="index"
                  pagination={false}
                  search={false}
                  toolBarRender={false}
                  dataSource={dataSource}
                  components={{
                    body: {
                      wrapper: DraggableContainer,
                      row: DraggableBodyRow,
                    },
                  }}
                />
                <Button
                  type="dashed"
                  onClick={() => {
                    setCyclicRunVisible(true);
                  }}
                  style={{width: '100%', marginBottom: 8}}
                >
                  <PlusOutlined/>
                  <FormattedMessage id='injection.Cyclic.add'/>
                </Button>
                <Collapse ghost>
                  <CollapsePanel header={<FormattedMessage id='injection.advanced.setting'/>} key={1} />
                </Collapse>
              </Card>
            </div>
          </StepsForm.StepForm>
          <StepsForm.StepForm
            //@ts-ignore
            title={<FormattedMessage id='injection.preview'/>} />
        </StepsForm>
        <Divider style={{margin: '40px 0 24px'}}/>
        <div className={styles.desc}>
          <h3>Tips:</h3>
          <p><FormattedMessage id='injection.tips'/></p>
        </div>
      </Card>

      {/*前置进样进样信息*/}
      <PreHeartTable
        visible={showRunSampleDetail}
        onOk={(dataList: any[]) => {
          // ok的时候当前行清空，同时把当前行的值传递出去
          currentCard.sampleList = dataList
          setShowRunSampleDetail(false)
        }}
        onCancel={() => {
          currentCard.sampleList = []
          setShowRunSampleDetail(false)
        }} value={""} />

      {/*添加循环进样*/}
      <ModalForm
        key="create"
        formRef={createFormRef}
        title={"Add"}
        width={750}
        visible={cyclicRunVisible}
        layout={'horizontal'}
        labelCol={{span: 6}}
        wrapperCol={{span: 16}}
        onVisibleChange={setCyclicRunVisible}
        modalProps={{destroyOnClose: true, maskClosable: false}}
        //@ts-ignore
        onFinish={(value) => {
          const newData = data
          newData.push({
            key: '5',
            name: value?.sampleType,
            times: value?.injectionTimes,
            // address: value?.injectionArea,
            index: 10,
          });
          setDataSource(data)
          setCyclicRunVisible(false);
        }}
      >
        <ProFormText
          width="md"
          name="sampleType"
          rules={[
            {
              required: true,
              pattern: /^.{1,50}$/,
              message: <FormattedMessage id='input.correct.matrix.name'/>,
            },
          ]}
          placeholder="Please input matrix name, Demo: serum"
          label={<FormattedMessage id='sample.type'/>}
        />
        <ProFormDigit
          label={<FormattedMessage id='injection.times'/>}
          width="md"
          name="injectionTimes"
          min={0}
          max={999}
          rules={[
            {required: true, message: 'please input injection times'},
          ]}
          placeholder="please input injection times"
        />
        <ProFormText
          width="md"
          name="injectionArea"
          rules={[
            {
              required: true,
              pattern: /^.{1,50}$/,
              message: <FormattedMessage id='input.correct.matrix.name'/>,
            },
          ]}
          placeholder="please input correct matrix name"
          label={<FormattedMessage id='run.sample.injection.area'/>}
        />
      </ModalForm>
    </>
  );
};

export default StepForm;
