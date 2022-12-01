import {PageContainer,} from '@ant-design/pro-components';
import {Button, Card, FormInstance, message, Result, Select} from 'antd';
import React, {CSSProperties, useRef, useState} from 'react';
import {IWellPickerProps, MultiWellPicker, RangeSelectionMode} from "@/pages/arrangement/manager/WellPicker";
import {PositionFormat} from "well-plates";
import {BackwardOutlined} from "@ant-design/icons";
import {history} from "@@/core/history";
import {StepsForm} from "@ant-design/pro-components";
import {FormattedMessage} from "@@/exports";
// @ts-ignore
import styles from "@/pages/run/Manager/AddTemplate/style.less";
import {StepDataType} from "@/pages/run/Manager/AddTemplate/data";
import {ProFormText} from "@ant-design/pro-form";

type IStateFullWellPickerProps = Omit<IWellPickerProps, 'onChange'>;

function StateFullWellPicker(props: IStateFullWellPickerProps) {
    const { value: initialValue, ...otherProps } = props;
    const [value, setValue] = useState(initialValue);

    return <MultiWellPicker value={value} onChange={(value1, label)=>{
        setValue(value1)
        console.log(value, label)

    }} {...otherProps} />;
}


const arrangementTemplate: React.FC<unknown> = () => {

  const [current, setCurrent] = useState(0);
  const formRef = useRef<FormInstance>();

    return (
        <PageContainer
            pageHeaderRender={()=>{
              return <a style={{margin: 20}} onClick={() => {
                history.push("/run/list")
              }}><BackwardOutlined/>返回排版模板列表</a>
            }}
        >
        <Card bordered={false}>
          <StepsForm
            current={current}
            onCurrentChange={setCurrent}
            onFinish={async ()=>{
              console.log("finish")
              message.success("提交成功")
              return true;
            }}
            submitter={{
              render: (props, dom) => {
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
                        <Button type="primary" onClick={(value) => {
                          // formRef.current?.resetFields();
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
                  >
                  </Result>,
                ];
              },
            }}
          >
            <StepsForm.StepForm<StepDataType>
              formRef={formRef}
              // @ts-ignore
              title={"设置模板信息"}
              onFinish={async (values) => {
                return true;
              }}
            >
              <ProFormText
                label={<FormattedMessage id='run.template.name'/>}
                width="md"
                name="templateName"
                rules={[{required: true, message: <FormattedMessage id='run.template.name.rule'/>}]}
                placeholder="请输入模板名称"
              />
              <ProFormText
                label={<FormattedMessage id='owner'/>}
                width="md"
                name="owner"
                rules={[{required: true, message: <FormattedMessage id='input.owner.tip'/>}]}
                // @ts-ignore
                placeholder={<FormattedMessage id='input.owner.tip'/>}
              />
            </StepsForm.StepForm>

            <StepsForm.StepForm<StepDataType>
              formRef={formRef}
              // @ts-ignore
              title={"配置孔板信息"}
              onFinish={async (values) => {
                return true;
              }}
            >
              <Select>选择样本版类型</Select>
              <Button>标记</Button>
              <StateFullWellPicker
                rows={8}
                columns={12}
                wellSize={60}
                renderText={({ index, label }) => {
                  return (
                    <div style={{ fontSize: 12 }}>
                      <div>{label}</div>
                      {/*<div>{index}</div>*/}
                    </div>
                  );
                }}
                value={[14]}
                // disabled={[5, 20]}
                displayAsGrid={false}
                format={PositionFormat.Sequential}
                rangeSelectionMode={RangeSelectionMode.zone}
                style={({ index, wellPlate, disabled, booked, selected }) => {
                  const position = wellPlate.getPosition(index, 'row_column');
                  const styles: CSSProperties = {};
                  if (disabled) {
                    if (position.row === 1) {
                      styles.backgroundColor = 'grey';
                    } else {
                      styles.backgroundColor = 'lightgray';
                    }
                  }
                  if (selected) {
                    styles.backgroundColor = 'pink';
                  }
                  if (booked && !disabled) {
                    styles.borderColor = 'red';
                  }
                  return styles;
                }}

              />

            </StepsForm.StepForm>



          </StepsForm>








        </Card>

        </PageContainer>
    );
};

export default arrangementTemplate;
