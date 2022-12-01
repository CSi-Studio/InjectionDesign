import type { Key } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { Pagination, Result } from '@/domains/Common';
import { buildColumn } from '@/pages/sample/Column';
import { Dropdown, Menu, message, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { Run } from '@/domains/Run.d';
import type { ProFormInstance } from '@ant-design/pro-form';
import SampleService from '@/services/SampleService';
import type { Sample } from '@/domains/Sample.d';
import { buildCreateModal } from '@/pages/sample/Modals';
import { FormattedMessage, useIntl } from 'umi';

const TableList: React.FC = (props: any) => {
  const service = new SampleService();

  //全局引用区域
  const tableRef = useRef<ActionType>(); //Table组件的引用
  const updateFormRef = useRef<ProFormInstance>();
  const createFormRef = useRef<ProFormInstance>();

  //全局变量区域
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]); //当前选中的多行Keys信息
  const [total, setTotal] = useState<any>(); //数据总行数
  const [loading, setLoading] = useState<boolean>(); //数据总行数
  const [projectId, setProjectId] = useState<string>(props?.location?.query?.projectId); //所属项目
  const intl = useIntl();
  const TargetTablePageSize = 50;

  useEffect(() => {}, []);

  function buildToolbar(): any {
    return {
      actions: [
        buildCreateModal(createFormRef, doCreate),
        <Dropdown
          key="remove"
          overlay={
            // @ts-ignore
            <Menu items={[{
              key:'1',
              label:<FormattedMessage id='delete'/>,
              onClick: doRemove
            }]}/>
          }
        >
          <Button>
            <FormattedMessage id='delete'/>
            <DownOutlined style={{ marginLeft: 8 }} />
          </Button>
        </Dropdown>,
      ],
    };
  }

  async function doCreate(values: Sample): Promise<boolean> {
    setLoading(true);
    await service.add(values);
    tableRef?.current?.reload();
    message.success(`${intl.formatMessage({id: 'create.success'})}`);
    setLoading(false);
    return true;
  }

  async function doList(
    params: { pageSize: number; current: number } & any,
  ): Promise<Result<Sample[]>> {
    setProjectId(projectId);
    const result = await service.list({ ...params, projectId });
    setTotal(result.total);
    return Promise.resolve(result);
  }

  async function doUpdate(values: Run): Promise<boolean> {
    setLoading(true);
    await service.update(values);
    tableRef?.current?.reload();
    message.success(`${intl.formatMessage({id: 'update.success'})}`);
    setLoading(false);
    return true;
  }

  async function doRemove(): Promise<boolean> {
    if (selectedRowKeys.length == 0) {
      message.warn(`${intl.formatMessage({id: 'select.sample'})}`);
      return false;
    }
    setLoading(true);
    await service.remove(selectedRowKeys);
    message.success(`${intl.formatMessage({id: 'delete.success'})}`);
    tableRef?.current?.reload();
    setLoading(false);
    return true;
  }

  async function doDelete(value: Key): Promise<boolean> {
    try {
      setLoading(true);
      await service.delete(value);
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      return true;
    } finally {
      setLoading(false);
    }
    return false;
  }

  return (
    <>
      <ProTable<Sample, Pagination>
        scroll={{ x: 'max-content' }}
        headerTitle={<FormattedMessage id='sample'/>}
        actionRef={tableRef}
        rowKey="id"
        loading={loading}
        size="middle"
        toolbar={buildToolbar()}
        search={{ span: 4 }}
        tableAlertRender={false}
        pagination={{
          total,
          pageSize: TargetTablePageSize,
        }}
        request={doList}
        columns={buildColumn(updateFormRef, doUpdate, doDelete)}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys: Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
      />
    </>
  );
};

export default TableList;
