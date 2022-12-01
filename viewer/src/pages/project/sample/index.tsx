import {Alert, Button, Card, Dropdown, Menu, message, Space} from 'antd';
import {
  ProFormInstance,
} from '@ant-design/pro-form';

//@ts-ignore
import {useRequest} from 'umi';
import type {FC} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType} from "@ant-design/pro-table";
import {Sample} from "@/domains/Sample.d";
import {Pagination, Result} from "@/domains/Common";
import {buildColumn} from "@/pages/project/detail/Column";
//@ts-ignore
import React, {Key, useRef, useState} from "react";
import {FormattedMessage} from "@@/exports";
import {useIntl} from "@umijs/max";
import SampleService from "@/services/SampleService";
import {DownloadOutlined, DownOutlined, UploadOutlined} from "@ant-design/icons";
import {url} from "@/utils/request";

const sampleLoad: FC<Record<string, any>> = () => {
  //ActionRef
  const sampleDetailFormRef = useRef<ProFormInstance>();
  //样本管理ref
  const tableRef = useRef<ActionType>(); //Table组件的引用
  const updateFormRef = useRef<ProFormInstance>();

  // 国际化
  const intl = useIntl();

  //分页
  const [total, setTotal] = useState<any>(); //数据总行
  const TargetTablePageSize = 50;

  //变量
  const [loading, setLoading] = useState<boolean>(); //数据总行数
  const [samplePredictDisable, setSampleDisable] = useState<boolean>(true);
  const [sampleDetail, setSampleDetail] = useState<any>(); //样本详情
  const [showExcelUpload, setShowExcelUpload] = useState<boolean>(false); //样本excel导入
  const [sampleRowKeys, setSampleRowKeys] = useState<Key[]>([]); //样本接收行Keys信息


  //service
  const sampleService = new SampleService();


  /**
   * 样本预估量保存
   */
  async function doPredictSampleSave(values: any): Promise<boolean> {
    try {
      setLoading(true);
      await sampleService.savePredictSampleSize({...values, projectId});
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'save.success'})}`);
      setSampleDisable(true);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'save.success'})}`);
      return false;
    } finally {
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
    const result = await sampleService.list({...params, projectId});
    setTotal(result.total);
    return Promise.resolve(result);
  }

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
   * 样本接受toolbar
   */
  function buildToolbar(): any {
    return {
      actions: [
        <Button
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
          onClick={() => {
            setSampleDisable(false);
          }}
        >
          <a href={`${url}/static/瑞金医院样本信息模板.xlsx`}><FormattedMessage id='download.template'/></a>
        </Button>,
        <Dropdown
          key="remove"
          overlay={
            <Menu items={[
              {
                key: '1',
                label: `${intl.formatMessage({id: 'delete'})}`,
                onClick: doRemove
              }
            ]}/>
          }
        >
          <Button>
            <FormattedMessage id='delete'/>
            <DownOutlined style={{marginLeft: 8}}/>
          </Button>
        </Dropdown>,
      ],
    };

  }

  return (
    <PageContainer>
      <Alert
        closable
        showIcon
        message={<FormattedMessage id='injection.load.sample'/>}
        style={{marginBottom: 24, width: 700}}
      />
      <Card bordered={false}>
        <div>
          <Card>
            <ProTable<Sample, Pagination>
              scroll={{x: 'max-content'}}
              headerTitle={<FormattedMessage id='sample'/>}
              actionRef={tableRef}
              rowKey="id"
              loading={loading}
              size="middle"
              toolbar={buildToolbar()}
              search={{span: 4}}
              tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
                <Space size={24}>
                  <span>
                     {selectedRowKeys.length} <FormattedMessage id='selected'/>
                    <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                      <FormattedMessage id='unselect'/>
                    </a>
                  </span>
                </Space>
              )}
              pagination={{
                total,
                pageSize: TargetTablePageSize,
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
          </Card>
        </div>
      </Card>
    </PageContainer>
  );
};

export default sampleLoad;
