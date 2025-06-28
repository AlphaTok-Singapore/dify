"""
数据集管理数据模型
"""

from datetime import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Dataset(db.Model):
    """数据集模型"""
    __tablename__ = 'alphamind_datasets'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text)
    dataset_type = db.Column(db.String(100), nullable=False)  # text, image, audio, video, structured
    source_info = db.Column(db.JSON)
    processing_status = db.Column(
        db.String(50),
        nullable=False,
        default='pending'  # pending, processing, completed, failed
    )
    metadata = db.Column(db.JSON)
    file_count = db.Column(db.Integer, default=0)
    total_size = db.Column(db.BigInteger, default=0)  # 总大小（字节）
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = db.Column(db.String(255))

    def to_dict(self):
        """转换为字典格式"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'dataset_type': self.dataset_type,
            'source_info': self.source_info,
            'processing_status': self.processing_status,
            'metadata': self.metadata,
            'file_count': self.file_count,
            'total_size': self.total_size,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'created_by': self.created_by
        }

    def __repr__(self):
        return f'<Dataset {self.name}>'

