"""
对话和消息数据模型
"""

from datetime import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Conversation(db.Model):
    """对话会话模型"""
    __tablename__ = 'alphamind_conversations'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(255), nullable=False, index=True)
    agent_id = db.Column(db.Integer, db.ForeignKey('alphamind_agents.id'))
    user_id = db.Column(db.String(255), index=True)
    title = db.Column(db.String(255))
    status = db.Column(db.String(50), nullable=False, default='active')
    metadata = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    messages = db.relationship('Message', backref='conversation', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """转换为字典格式"""
        return {
            'id': self.id,
            'session_id': self.session_id,
            'agent_id': self.agent_id,
            'user_id': self.user_id,
            'title': self.title,
            'status': self.status,
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'message_count': len(self.messages) if self.messages else 0
        }
    
    def __repr__(self):
        return f'<Conversation {self.session_id}>'


class Message(db.Model):
    """对话消息模型"""
    __tablename__ = 'alphamind_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('alphamind_conversations.id'), nullable=False, index=True)
    role = db.Column(db.String(50), nullable=False)  # 'user', 'assistant', 'system'
    content = db.Column(db.Text, nullable=False)
    metadata = db.Column(db.JSON)
    agent_used = db.Column(db.String(255))
    workflow_triggered = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """转换为字典格式"""
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'role': self.role,
            'content': self.content,
            'metadata': self.metadata,
            'agent_used': self.agent_used,
            'workflow_triggered': self.workflow_triggered,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Message {self.id} - {self.role}>'

