"""
智能体管理服务
"""

import logging
from datetime import datetime
from typing import Any, Optional

from models.agent import Agent

logger = logging.getLogger(__name__)

class AgentService:
    """智能体管理服务类"""

    def __init__(self, db):
        self.db = db

    def get_all_agents(self) -> list[dict[str, Any]]:
        """获取所有智能体"""
        try:
            agents = Agent.query.all()
            return [agent.to_dict() for agent in agents]
        except Exception as e:
            logger.exception("获取智能体列表失败")
            raise

    def get_agent_by_id(self, agent_id: int) -> Optional[dict[str, Any]]:
        """根据ID获取智能体"""
        try:
            agent = Agent.query.get(agent_id)
            return agent.to_dict() if agent else None
        except Exception as e:
            logger.exception("获取智能体失败")
            raise

    def get_agent_by_name(self, name: str) -> Optional[dict[str, Any]]:
        """根据名称获取智能体"""
        try:
            agent = Agent.query.filter_by(name=name).first()
            return agent.to_dict() if agent else None
        except Exception as e:
            logger.exception("获取智能体失败")
            raise

    def create_agent(self, data: dict[str, Any]) -> dict[str, Any]:
        """创建新智能体"""
        try:
            # 验证必需字段
            if not data.get('name'):
                raise ValueError("智能体名称不能为空")

            # 检查名称是否已存在
            existing_agent = Agent.query.filter_by(name=data['name']).first()
            if existing_agent:
                raise ValueError(f"智能体名称 '{data['name']}' 已存在")

            # 创建智能体
            agent = Agent(
                name=data['name'],
                description=data.get('description', ''),
                type=data.get('type', 'general'),
                status=data.get('status', 'active'),
                config=data.get('config', {}),
                mcp_tools=data.get('mcp_tools', []),
                n8n_workflows=data.get('n8n_workflows', []),
                created_by=data.get('created_by', 'system')
            )

            self.db.session.add(agent)
            self.db.session.commit()

            logger.info(f"智能体创建成功: {agent.name}")
            return agent.to_dict()

        except Exception as e:
            self.db.session.rollback()
            logger.exception("创建智能体失败")
            raise

    def update_agent(self, agent_id: int, data: dict[str, Any]) -> Optional[dict[str, Any]]:
        """更新智能体"""
        try:
            agent = Agent.query.get(agent_id)
            if not agent:
                return None

            # 更新字段
            if 'name' in data:
                # 检查新名称是否与其他智能体冲突
                existing_agent = Agent.query.filter(
                    Agent.name == data['name'],
                    Agent.id != agent_id
                ).first()
                if existing_agent:
                    raise ValueError(f"智能体名称 '{data['name']}' 已存在")
                agent.name = data['name']

            if 'description' in data:
                agent.description = data['description']
            if 'type' in data:
                agent.type = data['type']
            if 'status' in data:
                agent.status = data['status']
            if 'config' in data:
                agent.config = data['config']
            if 'mcp_tools' in data:
                agent.mcp_tools = data['mcp_tools']
            if 'n8n_workflows' in data:
                agent.n8n_workflows = data['n8n_workflows']

            agent.updated_at = datetime.utcnow()

            self.db.session.commit()

            logger.info(f"智能体更新成功: {agent.name}")
            return agent.to_dict()

        except Exception as e:
            self.db.session.rollback()
            logger.exception("更新智能体失败")
            raise

    def delete_agent(self, agent_id: int) -> bool:
        """删除智能体"""
        try:
            agent = Agent.query.get(agent_id)
            if not agent:
                return False

            # 检查是否有关联的对话或工作流执行
            if agent.conversations or agent.workflow_executions:
                # 软删除：将状态设置为 inactive
                agent.status = 'inactive'
                agent.updated_at = datetime.utcnow()
                self.db.session.commit()
                logger.info(f"智能体软删除成功: {agent.name}")
            else:
                # 硬删除：直接删除记录
                self.db.session.delete(agent)
                self.db.session.commit()
                logger.info(f"智能体硬删除成功: {agent.name}")

            return True

        except Exception as e:
            self.db.session.rollback()
            logger.exception("删除智能体失败")
            raise

    def get_agents_by_type(self, agent_type: str) -> list[dict[str, Any]]:
        """根据类型获取智能体"""
        try:
            agents = Agent.query.filter_by(type=agent_type, status='active').all()
            return [agent.to_dict() for agent in agents]
        except Exception as e:
            logger.exception("获取智能体列表失败")
            raise

    def get_active_agents(self) -> list[dict[str, Any]]:
        """获取活跃的智能体"""
        try:
            agents = Agent.query.filter_by(status='active').all()
            return [agent.to_dict() for agent in agents]
        except Exception as e:
            logger.exception("获取活跃智能体列表失败")
            raise

    def search_agents(self, keyword: str) -> list[dict[str, Any]]:
        """搜索智能体"""
        try:
            agents = Agent.query.filter(
                Agent.name.contains(keyword) |
                Agent.description.contains(keyword)
            ).all()
            return [agent.to_dict() for agent in agents]
        except Exception as e:
            logger.exception("搜索智能体失败")
            raise

