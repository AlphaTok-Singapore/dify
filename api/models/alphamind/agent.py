"""
智能体数据模型
"""

from datetime import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Agent(db.Model):
    """智能体模型"""
    __tablename__ = 'alphamind_agents'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text)
    type = db.Column(db.String(100), nullable=False, default='general')
    status = db.Column(db.String(50), nullable=False, default='active')
    config = db.Column(db.JSON)
    mcp_tools = db.Column(db.JSON)
    n8n_workflows = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = db.Column(db.String(255))
    
    # 关系
    conversations = db.relationship('Conversation', backref='agent', lazy=True)
    workflow_executions = db.relationship('WorkflowExecution', backref='agent', lazy=True)
    
    def to_dict(self):
        """转换为字典格式"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'type': self.type,
            'status': self.status,
            'config': self.config,
            'mcp_tools': self.mcp_tools,
            'n8n_workflows': self.n8n_workflows,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'created_by': self.created_by
        }
    
    def __repr__(self):
        return f'<Agent {self.name}>'

