import ProForm, { ModalForm } from '@ant-design/pro-form';
import { Button } from 'antd';
import { SampleFields } from '@/domains/Sample.d';
import { FormattedMessage } from 'umi';

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
        {SampleFields.species()}
        {SampleFields.matrix()}
        {SampleFields.groupName()}
        {SampleFields.position()}
      </ProForm.Group>
      <ProForm.Group>
        {SampleFields.volume()}
        {SampleFields.volumeUnit()}
      </ProForm.Group>
      <ProForm.Group>{SampleFields.description()}</ProForm.Group>
    </ModalForm>
  );
}
