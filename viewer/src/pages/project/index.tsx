import type {Key} from 'react';
import React, {useState, useRef, useEffect} from 'react';
import type {ActionType,ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {Project} from '@/domains/Project.d';
import type {Pagination, Result} from '@/domains/Common';
import ProjectService from '@/services/ProjectService';
import type {ProFormInstance} from '@ant-design/pro-form';
import {buildCreateModal, buildUpdateModal} from '@/pages/project/Modals';
import {
  message,
  Button,
} from 'antd';
import {
  DeleteOutlined,
   RightSquareOutlined
} from '@ant-design/icons';
import {Popconfirm} from "antd";
import {Link} from "@@/exports";
//@ts-ignore
import { FormattedMessage, useIntl } from 'umi';

const TableList: React.FC = () => {
  /**
   * 项目管理服务
   */
  const service = new ProjectService();
  //全局引用区域
  const tableRef = useRef<ActionType>(); //Table组件的引用
  const createFormRef = useRef<ProFormInstance>();
  const updateFormRef = useRef<ProFormInstance>();

  //全局变量区域
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]); //当前选中的多行Keys信息
  const [total, setTotal] = useState<any>(); //数据总行数
  const [loading, setLoading] = useState<boolean>(); //数据总行数
  const [projectList, setProjectList] = useState<Project[]>([]); //当前展示的数据行
  const intl = useIntl();

  useEffect(() => {
  }, []);

  /**
   * column
   */
  const columns: ProColumns<Project>[] = [
    {
      key: 'ID',
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      key: 'name',
      title: <FormattedMessage id='name'/>,
      dataIndex: 'name',
      tip: 'Unique',
    },
    {
      key: 'alias',
      title: <FormattedMessage id='alias'/>,
      dataIndex: 'alias',
      copyable: true,
    },
    {
      key: 'owner',
      title: <FormattedMessage id='owner'/>,
      dataIndex: 'owner',
      hideInSearch: true,
    },
    {
      key: 'createDate',
      title:<FormattedMessage id='create.date'/>,
      dataIndex: 'createDate',
      valueType: 'dateTime',
      hideInSearch: true,
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.createDate > b?.createDate ? -1 : 1;
      },
    },
    {
      key: 'option',
      title: <FormattedMessage id='option'/>,
      valueType: 'option',
      fixed: 'right',
      width: '320px',
      hideInSearch: true,
      render: (text, project) => [
        <Link
          key="goProject"
          to={{
            pathname: '/project/detail',
            search: `?projectId=${project.id}`,
          }}
        >
          <RightSquareOutlined/> Start
        </Link>,
        buildUpdateModal(updateFormRef, doUpdate, project),
        <Popconfirm placement={'topLeft'} title={<FormattedMessage id='confirm.delete'/>} key="delete" onConfirm={() => doDelete(project.id)}>
          <a style={{color: 'red'}}><DeleteOutlined /> Delete</a>
        </Popconfirm>,
      ],
    },
  ];
  function buildToolbar(): any {
    return {
      actions: [
        buildCreateModal(createFormRef, doCreate),
        <Button danger onClick={doRemove}>
          <FormattedMessage id='delete'/>
        </Button>
      ],
    };
  }

  /**
   * 获取项目列表
   * @param params
   */
  async function doList(params: any): Promise<Result<Project[]>> {
    const result = await service.list({...params});
    setTotal(result.total);
    setProjectList(result.data);
    return Promise.resolve(result);
  }

  /**
   * 创建项目
   * @param values
   */
  async function doCreate(values: Project): Promise<boolean> {
    try {
      setLoading(true);
      await service.add(values);
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'create.success'})}`);
      setLoading(false);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'create.failed'})}`);
      return false;
    }
  }

  /**
   * 更新项目
   * @param values
   */
  async function doUpdate(values: Project): Promise<boolean> {
    try {
      setLoading(true);
      await service.update(values);
      tableRef?.current?.reload();
      setLoading(false);
      message.success(`${intl.formatMessage({id: 'update.success'})}`);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'update.failed'})}`);
      return false;
    }
  }

  /**
   * 批量删除
   */
  async function doRemove(): Promise<boolean> {
    if (selectedRowKeys.length == 0) {
      message.warn(`${intl.formatMessage({id: 'select.project'})}`);
      return false;
    }
    setLoading(true);
    await service.remove(selectedRowKeys);
    message.success(`${intl.formatMessage({id: 'delete.success'})}`);
    tableRef?.current?.reload();
    setLoading(false);
    return true;
  }

  /**
   * 指定删除
   * @param values
   */
  async function doDelete(values: Key): Promise<boolean> {
    try {
      setLoading(true);
      await service.delete(values);
      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      tableRef?.current?.reload();
      return true;
    } finally {
      setLoading(false);
    }
    return false;
  }

  return (
    <>
        <ProTable<Project, Pagination>
          scroll={{x: 'max-content'}}
          headerTitle='History'
          actionRef={tableRef}
          rowKey="id"
          loading={loading}
          size="middle"
          toolbar={buildToolbar()}
          search={{
            labelWidth: 120,
          }}
          pagination={{
            total,
          }}
          dataSource={projectList}
          request={doList}
          columns={columns}
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
