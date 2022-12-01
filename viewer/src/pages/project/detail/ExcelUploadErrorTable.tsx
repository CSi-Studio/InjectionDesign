import { ModalForm } from "@ant-design/pro-form"
import type {ProColumns} from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { ReactElement } from "react"
import { FormattedMessage } from 'umi';

export default (props: { trigger: ReactElement; title?: string; width?: any; errorList?: any[]; columns?: ProColumns<any>[] }) => {
    return <ModalForm<any>
        key="addNew"
        width={props.width || '992px'}
        title={props.title || <FormattedMessage id='file.error.content'/>}
        submitter={{
            render: () => {
                return [

                ]
            }
        }}
        trigger={props.trigger}
    >
        <ProTable<any>
            scroll={{ x: '1000px' }}
            dataSource={props.errorList || []}
            rowKey="key"
            pagination={{
                showQuickJumper: true,
                defaultCurrent: 1,
                defaultPageSize: 5
            }}
            options={false}
            columns={props.columns || []}
            search={false}


        />
    </ModalForm>
}
