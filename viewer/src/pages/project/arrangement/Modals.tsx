import {ModalForm} from '@ant-design/pro-form';
import ProTable, {EditableProTable} from '@ant-design/pro-table';
import {SampleFields} from '@/domains/Sample.d';
import {Button} from 'antd';
import {Tag} from 'antd';
import {buildMsOrderSampleColumn, buildSamplePositionColumn} from '@/pages/project/detail/Column';
import type {SampleProcess} from '@/domains/PreOrder.d';
import type {Pagination} from '@/domains/Common';
import type {MsOrderSample} from '@/domains/MSOrder.d';
import {EditOutlined, FileSearchOutlined} from "@ant-design/icons";
import { FormattedMessage } from 'umi';

export function buildCreateSampleModal(createFormRef: any, doCreate: any) {
  return (
    <ModalForm
      width={640}
      layout={'horizontal'}
      labelCol={{span: 6}}
      wrapperCol={{span: 16}}
      key="create"
      formRef={createFormRef}
      title={<FormattedMessage id='create.sample'/>}
      trigger={<Button type="primary"><FormattedMessage id='create.sample'/></Button>}
      modalProps={{destroyOnClose: true, maskClosable: false}}
      onFinish={doCreate}
    >
      {SampleFields.sampleNo()}
      {SampleFields.species()}
      {SampleFields.matrix()}
      {SampleFields.groupName()}
      {SampleFields.position()}
      {SampleFields.volume()}
      {SampleFields.volumeUnit()}
      {SampleFields.description()}
    </ModalForm>
  );
}

export function buildUpdateSampleModal(updateFormRef: any, doUpdate: any, sample: any) {
  return (
    <ModalForm
      formRef={updateFormRef}
      autoFocusFirstInput
      title={<FormattedMessage id='update.sample'/>}
      trigger={
        <a><EditOutlined/><FormattedMessage id='update'/></a>
      }
      width={640}
      layout={'horizontal'}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      modalProps={{destroyOnClose: true, maskClosable: false}}
      onFinish={doUpdate}
    >

        {SampleFields.id(sample.id, true)}
        {SampleFields.projectId(sample.projectId, false)}
        {SampleFields.sampleNo(sample.sampleNo, false)}
        {SampleFields.species(sample.species, false)}
        {SampleFields.matrix(sample.matrix, false)}
        {SampleFields.groupName(sample.groupName, false)}
        {SampleFields.position(sample.position, false)}
        {SampleFields.volume(sample.volume, false)}
        {SampleFields.description(sample.description, false)}

    </ModalForm>
  );
}

export function buildOrderDetailModal(
  doGetMSOrderSampleList: any,
  id: string,
  sampleArrangementType: string,
  orderEditableKeys?: string[],
  setOrderEditableRowKeys?: any,
) {
  // setOrderEditableRowKeys(doGetMSOrderSampleList({ id: id })?.data?.map((item) => item.id));

  return (
    <ModalForm
      title={<FormattedMessage id='worksheet.content'/>}
      trigger={
        <Tag
          style={{
            cursor: 'pointer',
          }}
          key="check"
          color="cyan"
        >
          <FormattedMessage id='worksheet.content'/>
        </Tag>
      }
      width={1400}
      onFinish={async () => {
        return true;
      }}
    >
      {/* <ProTable<SampleProcess, Pagination>
        headerTitle="工单内容"
        toolBarRender={false}
        tableAlertRender={false}
        search={false}
        rowKey="id"
        request={(params) => {
          const result = doGetMSOrderSampleList({ ...params, id: id });
          return result;
        }}
        columns={buildSamplePositionColumn(arrangementType)}
      /> */}
      <EditableProTable<SampleProcess, Pagination>
        headerTitle={<FormattedMessage id='worksheet.content'/>}
        toolBarRender={false}
        tableAlertRender={false}
        search={false}
        rowKey="id"
        request={async (params) => {
          const result = await doGetMSOrderSampleList({...params, id: id});

          console.log('orderEditableKeys', orderEditableKeys);
          return result;
        }}
        recordCreatorProps={false}
        columns={buildSamplePositionColumn(sampleArrangementType)}
        editable={{
          type: 'multiple',
          editableKeys: orderEditableKeys,
          // editableKeys: ['62c90b75a23d5944afb188a6'],
          onChange: setOrderEditableRowKeys,
          onValuesChange: (record) => {
            console.log(record);
          },
          // actionRender: (action: any) => {
          //   return [
          //     <Tag color="blue" key="export">
          //       <a
          //         style={{
          //           color: 'inherit',
          //         }}
          //         href={API_URL + '/order/export?id=' + action.id}
          //       >
          //         导出
          //       </a>
          //     </Tag>,
          //   ];
          // },
        }}
      />
    </ModalForm>
  );
}

export function buildMSOrderDetailModal(doGetOrderSampleList: any, id: any) {
  return (
    <ModalForm
      title={<FormattedMessage id='ms.worksheet.content'/>}
      autoFocusFirstInput
      trigger={
        <Button type={'primary'} size={'small'}><FileSearchOutlined/><FormattedMessage id='view.worksheet'/></Button>
      }
      width={1200}
      modalProps={{destroyOnClose: true}}
      onFinish={async () => {
        return true;
      }}
    >
      <ProTable<MsOrderSample, Pagination>
        headerTitle={<FormattedMessage id='ms.worksheet.content'/>}
        toolBarRender={false}
        tableAlertRender={false}
        search={false}
        rowKey="id"
        request={(params) => {
          const result = doGetOrderSampleList({...params, id: id});
          return result;
        }}
        pagination={{
          pageSize: 50,
        }}
        columns={buildMsOrderSampleColumn()}
      />
    </ModalForm>
  );
}
