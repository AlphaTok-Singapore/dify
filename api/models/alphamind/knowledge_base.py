class KnowledgeBase:
    """AlphaMind 知识库模型基础骨架"""
    def __init__(self, id: int, name: str, description: str = ""):
        self.id = id
        self.name = name
        self.description = description
