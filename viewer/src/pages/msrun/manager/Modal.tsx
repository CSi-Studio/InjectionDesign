import ProForm, {ModalForm} from '@ant-design/pro-form';
import { RunFields} from "@/domains/Run.d";
import {Tag} from "antd";
import {RunTemplate} from "@/domains/RunTemplate.d";
import {FormattedMessage} from "@@/exports";

export function buildUpdateModal(updateFormRef: any, doUpdate: any, run: RunTemplate){
  return <ModalForm
    formRef={updateFormRef}
    autoFocusFirstInput
    title={<FormattedMessage id='edit'/>}
    trigger={<a><Tag color="green"><FormattedMessage id='edit'/></Tag></a>}
    width={1200}
    modalProps={{destroyOnClose: true}}
    onFinish={doUpdate}>
    <ProForm.Group>
      {RunFields.id(run.id, true)}
      {RunFields.name(run.name, true)}
    </ProForm.Group>
  </ModalForm>
}
