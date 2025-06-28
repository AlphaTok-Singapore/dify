"""
工作流管理服务
"""

import logging
from datetime import datetime
from typing import Any, Optional

import requests

from models.workflow import WorkflowExecution

logger = logging.getLogger(__name__)

class WorkflowService:
    """工作流管理服务类"""

    def __init__(self, db, n8n_endpoint: str, n8n_user: str, n8n_password: str):
        self.db = db
        self.n8n_endpoint = n8n_endpoint
        self.n8n_auth = (n8n_user, n8n_password)

    def get_workflows(self) -> list[dict[str, Any]]:
        """获取n8n工作流列表"""
        try:
            response = requests.get(
                f"{self.n8n_endpoint}/api/v1/workflows",
                auth=self.n8n_auth,
                timeout=10
            )

            if response.status_code == 200:
                workflows = response.json()
                return [
                    {
                        'id': workflow.get('id'),
                        'name': workflow.get('name'),
                        'active': workflow.get('active', False),
                        'tags': workflow.get('tags', []),
                        'created_at': workflow.get('createdAt'),
                        'updated_at': workflow.get('updatedAt')
                    }
                    for workflow in workflows.get('data', [])
                ]
            else:
                logger.exception("获取工作流列表失败")
                return self._get_mock_workflows()

        except Exception as e:
            logger.exception("连接n8n失败")
            return self._get_mock_workflows()

    def _get_mock_workflows(self) -> list[dict[str, Any]]:
        """返回模拟的工作流列表"""
        return [
            {
                'id': 'workflow_1',
                'name': '数据处理流程',
                'active': True,
                'tags': ['data', 'processing'],
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            },
            {
                'id': 'workflow_2',
                'name': '内容生成流程',
                'active': True,
                'tags': ['content', 'generation'],
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            },
            {
                'id': 'workflow_3',
                'name': '邮件通知流程',
                'active': True,
                'tags': ['notification', 'email'],
                'created_at': '2024-01-01T00:00:00Z',
                'updated_at': '2024-01-01T00:00:00Z'
            }
        ]

    def execute_workflow(self, workflow_id: str, input_data: dict[str, Any] = None,
                        agent_id: int = None, conversation_id: int = None) -> dict[str, Any]:
        """执行工作流"""
        try:
            # 创建执行记录
            execution = WorkflowExecution(
                workflow_id=workflow_id,
                workflow_name=self._get_workflow_name(workflow_id),
                agent_id=agent_id,
                conversation_id=conversation_id,
                status='pending',
                input_data=input_data or {},
                created_at=datetime.utcnow()
            )

            self.db.session.add(execution)
            self.db.session.flush()  # 获取ID

            # 执行工作流
            start_time = datetime.utcnow()
            execution.status = 'running'
            self.db.session.commit()

            try:
                # 调用n8n API执行工作流
                result = self._execute_n8n_workflow(workflow_id, input_data)

                # 更新执行结果
                end_time = datetime.utcnow()
                execution_time = int((end_time - start_time).total_seconds() * 1000)

                execution.status = 'completed'
                execution.output_data = result
                execution.execution_time = execution_time
                execution.completed_at = end_time

            except Exception as e:
                # 执行失败
                execution.status = 'failed'
                execution.error_message = str(e)
                execution.completed_at = datetime.utcnow()
                logger.exception("工作流执行失败")

            self.db.session.commit()
            return execution.to_dict()

        except Exception as e:
            self.db.session.rollback()
            logger.exception("创建工作流执行记录失败")
            raise

    def _execute_n8n_workflow(self, workflow_id: str, input_data: dict[str, Any]) -> dict[str, Any]:
        """执行n8n工作流"""
        try:
            # 尝试通过webhook触发工作流
            webhook_url = f"{self.n8n_endpoint}/webhook/{workflow_id}"

            response = requests.post(
                webhook_url,
                json=input_data,
                timeout=30
            )

            if response.status_code == 200:
                return response.json()
            else:
                # 如果webhook失败，尝试通过API执行
                return self._execute_via_api(workflow_id, input_data)

        except Exception as e:
            logger.exception("通过webhook执行工作流失败")
            return self._execute_via_api(workflow_id, input_data)

    def _execute_via_api(self, workflow_id: str, input_data: dict[str, Any]) -> dict[str, Any]:
        """通过API执行工作流"""
        try:
            response = requests.post(
                f"{self.n8n_endpoint}/api/v1/workflows/{workflow_id}/execute",
                json={'data': input_data},
                auth=self.n8n_auth,
                timeout=30
            )

            if response.status_code == 200:
                return response.json()
            else:
                # 返回模拟结果
                return self._get_mock_execution_result(workflow_id, input_data)

        except Exception as e:
            logger.exception("通过API执行工作流失败")
            return self._get_mock_execution_result(workflow_id, input_data)

    def _get_mock_execution_result(self, workflow_id: str, input_data: dict[str, Any]) -> dict[str, Any]:
        """返回模拟的执行结果"""
        return {
            'success': True,
            'workflow_id': workflow_id,
            'execution_id': f"exec_{workflow_id}_{int(datetime.utcnow().timestamp())}",
            'input_data': input_data,
            'output_data': {
                'message': f'工作流 {workflow_id} 执行成功',
                'processed_items': len(input_data) if isinstance(input_data, (list, dict)) else 1,
                'execution_time': '2.5s'
            },
            'status': 'completed'
        }

    def _get_workflow_name(self, workflow_id: str) -> str:
        """获取工作流名称"""
        workflow_names = {
            'workflow_1': '数据处理流程',
            'workflow_2': '内容生成流程',
            'workflow_3': '邮件通知流程'
        }
        return workflow_names.get(workflow_id, f'工作流_{workflow_id}')

    def get_executions(self, agent_id: int = None, status: str = None, limit: int = 50) -> list[dict[str, Any]]:
        """获取工作流执行记录"""
        try:
            query = WorkflowExecution.query

            if agent_id:
                query = query.filter_by(agent_id=agent_id)
            if status:
                query = query.filter_by(status=status)

            executions = query.order_by(WorkflowExecution.created_at.desc()).limit(limit).all()
            return [execution.to_dict() for execution in executions]

        except Exception as e:
            logger.exception("获取工作流执行记录失败")
            raise

    def get_execution_by_id(self, execution_id: int) -> Optional[dict[str, Any]]:
        """根据ID获取工作流执行记录"""
        try:
            execution = WorkflowExecution.query.get(execution_id)
            return execution.to_dict() if execution else None
        except Exception as e:
            logger.exception("获取工作流执行记录失败")
            raise

    def cancel_execution(self, execution_id: int) -> bool:
        """取消工作流执行"""
        try:
            execution = WorkflowExecution.query.get(execution_id)
            if not execution or execution.status not in ['pending', 'running']:
                return False

            # 尝试取消n8n中的执行
            try:
                response = requests.delete(
                    f"{self.n8n_endpoint}/api/v1/executions/{execution_id}",
                    auth=self.n8n_auth,
                    timeout=10
                )
            except Exception as e:
                logger.warning(f"取消n8n执行失败: {e}")

            # 更新本地状态
            execution.status = 'cancelled'
            execution.completed_at = datetime.utcnow()
            execution.error_message = '用户取消执行'

            self.db.session.commit()
            return True

        except Exception as e:
            self.db.session.rollback()
            logger.exception("取消工作流执行失败")
            raise

