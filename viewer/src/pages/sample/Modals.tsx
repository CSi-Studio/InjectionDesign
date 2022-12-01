import ProForm, { ModalForm } from '@ant-design/pro-form';
import { Button } from 'antd';
import { SampleFields } from '@/domains/Sample.d';
import { FormattedMessage } from 'umi';
import {EditOutlined} from "@ant-design/icons";

export function buildCreateModal(createFormRef: any, doCreate: any) {
  return (
    <ModalForm
      key="create"
      formRef={createFormRef}
      title={<FormattedMessage id='create.sample'/>}
      trigger={<Button type="primary"><FormattedMessage id='create.sample'/></Button>}
      width={750}
      modalProps={{ destroyOnClose: true }}
      onFinish={doCreate}
    >
      <ProForm.Group>
        {SampleFields.projectId()}
        {SampleFields.sampleNo()}
        {SampleFields.dim1()}
        {SampleFields.dim2()}
        {SampleFields.dim3()}
      </ProForm.Group>
      <ProForm.Group>{SampleFields.description()}</ProForm.Group>
    </ModalForm>
  );
}


export function buildUpdateSampleModal(updateFormRef: any, doUpdate: any, sample: any) {
  return (
    <ModalForm
      key={'update'}
      formRef={updateFormRef}
      autoFocusFirstInput
      title={<FormattedMessage id='update.sample'/>}
      trigger={
        <a><EditOutlined/></a>
      }
      width={640}
      layout={'horizontal'}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      modalProps={{destroyOnClose: true, maskClosable: false}}
      onFinish={doUpdate}
    >

      {SampleFields.id(sample.id, true)}
      {SampleFields.projectId(sample.projectId, true)}
      {SampleFields.sampleNo(sample.sampleNo, false)}
      {SampleFields.dim1(sample.dim1, false)}
      {SampleFields.dim2(sample.dim2, false)}
      {SampleFields.dim3(sample.dim3, false)}

    </ModalForm>
  );
}
