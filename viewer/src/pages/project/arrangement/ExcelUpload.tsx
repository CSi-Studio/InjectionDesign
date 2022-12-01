import { CloseOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-form";
import type { ProColumns } from "@ant-design/pro-table";
import { FileAdditionOne, FileExcel } from "@icon-park/react";
import type { UploadProps } from "antd";
import { Button, Col, Progress, Row } from "antd";
import { Upload } from "antd";
import { Form, message } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import type { UploadFile } from "antd/lib/upload/interface";
import type { ReactElement} from "react";
import { useState } from "react";
import ExcelErrorText from "./ExcelErrorText";
import styles from './ExcelUpload.less';
import ExcelUploadErrorTable from "./ExcelUploadErrorTable";
import { FormattedMessage, useIntl } from 'umi';

const ADD_NEW = 2;
const ADD_COVER = 1;
const columns: ProColumns<{
    sampleId: string;
    errorMsg: string;
    empno: string;
    departIds: string;
    sex: string;
    role: string;
    realNameErr: string[];
    empnoErr: string[];
    phoneErr: string[];
    departIdsErr: string[];
    sexErr: string[];
    roleErr: string[];
}>[] = [
        {
            title: <FormattedMessage id='sample.no'/>,
            dataIndex: 'sampleId',
            key: 'realName',
            showSorterTooltip: false,
            width: '20%',
            ellipsis: true,
            render(text, record) {
                const errorInfo = record.sampleId;
                return <ExcelErrorText errorInfo={errorInfo} text={text}/>;
            }
        },
        {
            title: <FormattedMessage id='error.msg'/>,
            dataIndex: 'errorMsg',
            key: 'errorMsg',
            showSorterTooltip: false,
            width: '25%',
            ellipsis: true,
            render(text, record) {
                const errorInfo = record.errorMsg;
                return <ExcelErrorText errorInfo={errorInfo} text={text}/>;
            }
        }
    ]
export default (props: {
    visible: boolean;
    uploadHandle: (addMode: number, file: any) => Promise<boolean>;
    setVisible: any;
    standardFileUrl: string;
    actionUrl: string;
    title?: string;
    id?: string;
    newAddStr?: string;
    newAddStrDesc?: string;
    coverStr?: string;
    outVoStr?: string;
    children?: ReactElement;
    columns?: ProColumns<any>[];
    addCoverStrDesc?: string;
    exportUrl?: string;
    draggerStr?: string;
    needSyncBank?: boolean;
    syncBankFlag?: boolean;
    setSyncBankFirstFlag?: any;
}) => {
    const [uploadExcelForm] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [addNewVisible, setAddNewVisible] = useState<boolean>(false);
    const [addCoverVisible, setAddCoverVisible] = useState<boolean>(false);
    const [erroring, setErroring] = useState<boolean>(false);
    const [addNewBtnLoading, setAddNewBtnLoading] = useState<boolean>(false);
    const [addCoverLoading, setAddCoverLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(100);
    const [errorList, setErrorList] = useState<any[]>([]);
    const intl = useIntl();
    const userExcelProps: UploadProps = {
        name: 'file',
        action: props.actionUrl,
        method: 'POST',
        accept: '.xls,.xlsx',
        maxCount: 1,
        headers: {
            'X-Access-Token': '',
        },
        data: (file) => {
            if (props.id?.length) {
                return { file: file, id: props.id };
            }
            return { file }
        },

        beforeUpload: (file) => {
            const isExcel =
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel';
            if (!isExcel) {
                message.error(`${file.name} is not an excel file`);
            }
            return isExcel || Upload.LIST_IGNORE;
        },
        onChange(info) {
            console.log('info', info, "error", erroring);
            if (info.file.status === 'removed') {
                setFileList([]);
                return;
            }
            if (info.file.status === 'uploading') {
                setUploading(false);
                setErroring(false)
            }
            if (info.file.status === 'done') {
                const res = info.file.response;
                setFileList([info.file]);
                setUploading(true);
                if (res.success) {
                    if (res.data?.length) {
                        setErroring(true)
                        setErrorList(res.data)
                        return;
                    }
                    setErroring(false)
                } else {
                    message.error(`${info.file.name} ${intl.formatMessage({id: 'upload.failed'})},: ${res.errorMessage}`);
                    setFileList([]);
                    setErroring(true)
                    info.file.status = 'error'
                }
            } else if (info.file.status === 'error') {
                setUploading(true);
                message.error(`${info.file.name} ${intl.formatMessage({id: 'upload.failed'})}`);
                setErroring(true)
            }
        },
    };


    {/* Excel导入 */ }
    return <ModalForm
        width="542px"
        submitter={{
            render: () => {
                return [
                    <Button onClick={() => {
                        if(props.needSyncBank && props.syncBankFlag){
                            message.error('Please Select Async Question Bank')
                            props.setSyncBankFirstFlag(false)
                            return
                        }
                        setAddNewVisible(true)
                    }} disabled={fileList.length == 0 || !uploading || erroring} htmlType="button" key="add">
                        {props.newAddStr}
                    </Button>,
                    <Button onClick={() => {
                        if(props.needSyncBank && props.syncBankFlag){
                            message.error('Please Select Async Question Bank')
                            props.setSyncBankFirstFlag(false)
                            return
                        }
                        setAddCoverVisible(true)
                    }} disabled={fileList.length == 0 || !uploading || erroring} htmlType="button" key="read">
                        {props.coverStr}
                    </Button>,
                ];
            },
        }}
        title={props.title ? props.title : `${intl.formatMessage({id: 'import.excel'})}`}
        visible={props.visible}
        form={uploadExcelForm}
        onVisibleChange={props.setVisible}
        modalProps={{
            destroyOnClose: true,
        }}
    >
        <div className={styles.excelDes}>
            <Row><Col span={16}>{props.draggerStr ||`${intl.formatMessage({id: '1.upload.tip'})}`}</Col>

                <Col span={8}><a href={props.standardFileUrl}>
                  <FormattedMessage id='download.template'/>
                </a></Col>
            </Row>
            <div><FormattedMessage id='2.upload.tip'/></div>
        </div>
        <br />
        <Dragger
            // eslint-disable-next-line @typescript-eslint/no-shadow
            itemRender={(originNode: ReactElement, file: UploadFile, fileList: any[], actions: { download: Function, preview: Function, remove: Function }) => {
                if (file.status == 'done') {
                    setProgress(100)
                    return <></>;
                }
                if (file.status == 'uploading') {
                    // @ts-ignore
                  setProgress(file.percent)
                    return <></>;
                }
                return originNode;
            }}
            // 样式
            className={styles.dragger}
            {...userExcelProps}
        >
            {(fileList?.length && !uploading) ? <p className={styles.progressStr}>{progress + '%'}</p> : null}
            {!fileList?.length ? <>
                {/* icon */}
                <FileAdditionOne theme="outline" size="32" fill="#333" />
                {/* 提示文字 */}
                <p style={{color: '#999'}}>
                  <FormattedMessage id='click.to.upload'/>
                </p>
                <p style={{color: '#999'}}>
                  <FormattedMessage id='or'/> <FormattedMessage id='drag.file.here'/>
                </p> </> : !uploading ? <><Progress
                    className={styles.progress}
                    strokeColor={{
                        '0%': '#1E90FF',
                        '100%': '#70A1FF',
                    }}
                    showInfo={false}
                    percent={progress}
                /></> : <div className={styles.successDiv} onClick={(e) => {
                    e.stopPropagation()
                }}> <br />
                <span className={styles.successStrP}>{erroring ? <span><FormattedMessage id='upload.error.tip'/>  <ExcelUploadErrorTable columns={props.columns || columns} errorList={errorList} trigger={<a className={styles.errorSpanA}><FormattedMessage id='check.errors'/></a>} /> </span> : <FormattedMessage id='upload.file.success.please.select'/>}</span>
                <br />
                <br />
                <div className={styles.excelSuccess}><span className={styles.fileNameSpan}><FileExcel /> {'  '}<span className={styles.nameSpan}>{fileList[0].name}</span></span>
                    <a onClick={(e) => {
                        e.stopPropagation();
                        setFileList([])
                    }}><span className={styles.closeSpan}><CloseOutlined /></span></a></div>
            </div>}
        </Dragger>
        {props.children}
        <ModalForm<any>
            key="addNew"
            width={'482px'}
            title={props.newAddStr || `${intl.formatMessage({id: 'create.user'})}`}
            visible={addNewVisible}
            submitter={{
                render: () => {
                    return [
                        <Button onClick={() => {
                            if(addNewBtnLoading){
                                message.warn(`${intl.formatMessage({id: 'wait.for.creation'})}`);
                                return
                            }
                            setAddNewVisible(false)
                        }} style={{ width: '88px' }} key={'cancel'} type='default' htmlType="submit">
                          <FormattedMessage id='cancel'/>
                        </Button>,
                        <Button loading={addNewBtnLoading} onClick={async () => {
                            setAddNewBtnLoading(true)
                            if (fileList.length > 0) {
                                if (erroring) {
                                    message.error(`${intl.formatMessage({id: 'file.upload.failed.retry'})}`);
                                    setAddNewBtnLoading(false)
                                    return;
                                }
                                if (!uploading) {

                                    message.warning(`${intl.formatMessage({id: 'wait.for.uploading'})}`);
                                    setAddNewBtnLoading(false)
                                    return;
                                }
                              try {
                                  const res = await props.uploadHandle(ADD_NEW, fileList[0].originFileObj);
                                  setFileList([]);
                                  setAddNewVisible(false);
                                  if (res.valueOf()) {
                                    props.setVisible(false);
                                    uploadExcelForm.resetFields();
                                    setUploading(false);
                                    setAddNewBtnLoading(false)
                                    // tableRef?.current?.reload();
                                    return Promise.resolve();
                                  }
                                } catch (error) {
                                setAddNewBtnLoading(false)
                              }

                            } else {
                                message.error(`${intl.formatMessage({id: 'please.upload.file'})}`);
                            }
                            setAddNewBtnLoading(false)
                        }} style={{ width: '88px' }} key={'submit'} type='primary' htmlType="submit">
                          <FormattedMessage id='confirm'/>
                        </Button>
                    ]
                }
            }}
            // eslint-disable-next-line react/no-children-prop
            children={<span style={{ fontSize: '16px' }}>{props.newAddStrDesc || `${intl.formatMessage({id: 'user.add.confirm.tip'})}`}</span>}
            onFinish={async (values) => {
                message.success(`${intl.formatMessage({id: 'success'})}`);
                return true;
            }}
        />
        <ModalForm<any>
            key="addCover"
            width={'482px'}
            title={props.coverStr || `${intl.formatMessage({id: 'overwrite.current.user'})}`}
            visible={addCoverVisible}
            submitter={{
                render: () => {
                    return [
                        <Button onClick={() => {
                            if(addCoverLoading){
                                message.warn(`${intl.formatMessage({id: 'wait.for.overwrite'})}`);
                                return
                            }
                            setAddCoverVisible(false)
                        }} style={{ width: '88px' }} key={'cancel'} type='default' htmlType="submit">
                          <FormattedMessage id='cancel'/>
                        </Button>,
                        <Button loading={addCoverLoading} onClick={async () => {
                            setAddCoverLoading(true)
                            if (fileList.length > 0) {
                                if (erroring) {
                                    message.error(`${intl.formatMessage({id: 'file.upload.failed.retry'})}`);
                                    setAddCoverLoading(false)
                                    return;
                                }
                                if (!uploading) {
                                    message.warning(`${intl.formatMessage({id: 'wait.for.uploading'})}`);
                                    setAddCoverLoading(false)
                                    return;
                                }
                                try {
                                  const res = await props.uploadHandle(ADD_COVER, fileList[0].originFileObj);
                                  setFileList([]);
                                  setAddCoverVisible(false);
                                  if (res.valueOf()) {
                                    props.setVisible(false);
                                    uploadExcelForm.resetFields();
                                    setUploading(false);
                                    setAddCoverLoading(false)
                                    return Promise.resolve();
                                  }
                                } catch (error) {
                                  setAddNewBtnLoading(false)
                                }
                            } else {
                                message.error(`${intl.formatMessage({id: 'please.upload.file'})}`);
                            }
                            setAddCoverLoading(false)
                        }} style={{ width: '88px' }} key={'submit'} type='primary' htmlType="submit">
                          {intl.formatMessage({id: 'confirm'})}
                        </Button>
                    ]
                }
            }}
            // eslint-disable-next-line react/no-children-prop
            children={<span style={{ fontSize: '16px' }}>{props.addCoverStrDesc}</span>}
            onFinish={async (values) => {
                message.success(`${intl.formatMessage({id: 'success'})}`);
                return true;
            }}
        />

    </ModalForm>
}
