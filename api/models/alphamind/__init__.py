"""
AlphaMind 数据模型
文件位置: api/models/alphamind/__init__.py
"""

from datetime import datetime
from typing import Optional, Dict, Any, List
import json
import uuid

from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey, DECIMAL, BigInteger
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from extensions.ext_database import db


class AlphaMindConversation(db.Model):
    """AlphaMind 对话模型"""
    __tablename__ = 'alphamind_conversations'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String(255), nullable=False)
    agent_id = Column(UUID(as_uuid=True), nullable=True)
    status = Column(String(50), default='active')
    metadata = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 关系
    messages = relationship("AlphaMindMessage", back_populates="conversation", cascade="all, delete-orphan")
    workflow_executions = relationship("AlphaMindWorkflowExecution", back_populates="conversation")

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'title': self.title,
            'agent_id': str(self.agent_id) if self.agent_id else None,
            'status': self.status,
            'metadata': self.metadata or {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'message_count': len(self.messages) if self.messages else 0
        }


class AlphaMindMessage(db.Model):
    """AlphaMind 消息模型"""
    __tablename__ = 'alphamind_messages'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey('alphamind_conversations.id', ondelete='CASCADE'), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    message_type = Column(String(50), default='text')  # text, image, file, workflow_result
    message_metadata = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 关系
    conversation = relationship("AlphaMindConversation", back_populates="messages")

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': str(self.id),
            'conversation_id': str(self.conversation_id),
            'role': self.role,
            'content': self.content,
            'message_type': self.message_type,
            'metadata': self.message_metadata or {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class AlphaMindAgent(db.Model):
    """AlphaMind 智能体模型"""
    __tablename__ = 'alphamind_agents'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    avatar_url = Column(String(500))
    model_config = Column(JSONB, default=dict)
    prompt_template = Column(Text)
    tools = Column(JSONB, default=list)
    status = Column(String(50), default='active')
    is_public = Column(Boolean, default=False)
    usage_count = Column(Integer, default=0)
    rating = Column(DECIMAL(3, 2), default=0.0)
    metadata = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'name': self.name,
            'description': self.description,
            'avatar_url': self.avatar_url,
            'model_config': self.model_config or {},
            'prompt_template': self.prompt_template,
            'tools': self.tools or [],
            'status': self.status,
            'is_public': self.is_public,
            'usage_count': self.usage_count,
            'rating': float(self.rating) if self.rating else 0.0,
            'metadata': self.metadata or {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class AlphaMindDataset(db.Model):
    """AlphaMind 数据集模型"""
    __tablename__ = 'alphamind_datasets'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    dataset_type = Column(String(50), nullable=False)  # csv, json, text, pdf
    file_path = Column(String(500))
    file_size = Column(BigInteger)
    record_count = Column(Integer, default=0)
    status = Column(String(50), default='processing')  # processing, ready, error
    metadata = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'name': self.name,
            'description': self.description,
            'dataset_type': self.dataset_type,
            'file_path': self.file_path,
            'file_size': self.file_size,
            'record_count': self.record_count,
            'status': self.status,
            'metadata': self.metadata or {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class AlphaMindKnowledgeBase(db.Model):
    """AlphaMind 知识库模型"""
    __tablename__ = 'alphamind_knowledge_bases'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    embedding_model = Column(String(100))
    vector_dimension = Column(Integer)
    document_count = Column(Integer, default=0)
    status = Column(String(50), default='active')
    metadata = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'name': self.name,
            'description': self.description,
            'embedding_model': self.embedding_model,
            'vector_dimension': self.vector_dimension,
            'document_count': self.document_count,
            'status': self.status,
            'metadata': self.metadata or {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class AlphaMindWorkflowExecution(db.Model):
    """AlphaMind 工作流执行记录模型"""
    __tablename__ = 'alphamind_workflow_executions'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey('alphamind_conversations.id'), nullable=True)
    workflow_id = Column(String(255), nullable=False)
    execution_id = Column(String(255))
    status = Column(String(50), default='running')  # running, completed, failed
    input_data = Column(JSONB, default=dict)
    output_data = Column(JSONB, default=dict)
    error_message = Column(Text)
    execution_time = Column(Integer)  # 执行时间（秒）
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

    # 关系
    conversation = relationship("AlphaMindConversation", back_populates="workflow_executions")

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'conversation_id': str(self.conversation_id) if self.conversation_id else None,
            'workflow_id': self.workflow_id,
            'execution_id': self.execution_id,
            'status': self.status,
            'input_data': self.input_data or {},
            'output_data': self.output_data or {},
            'error_message': self.error_message,
            'execution_time': self.execution_time,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }


class AlphaMindMCPTool(db.Model):
    """AlphaMind MCP 工具模型"""
    __tablename__ = 'alphamind_mcp_tools'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text)
    tool_type = Column(String(50), nullable=False)  # search, file, math, api, language
    config = Column(JSONB, default=dict)
    is_enabled = Column(Boolean, default=True)
    usage_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description,
            'tool_type': self.tool_type,
            'config': self.config or {},
            'is_enabled': self.is_enabled,
            'usage_count': self.usage_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


# 导出所有模型
__all__ = [
    'AlphaMindConversation',
    'AlphaMindMessage',
    'AlphaMindAgent',
    'AlphaMindDataset',
    'AlphaMindKnowledgeBase',
    'AlphaMindWorkflowExecution',
    'AlphaMindMCPTool'
]

