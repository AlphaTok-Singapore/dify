class Message:
    """AlphaMind 消息模型基础骨架"""
    def __init__(self, id: int, conversation_id: int, sender: str, content: str, timestamp: str):
        self.id = id
        self.conversation_id = conversation_id
        self.sender = sender
        self.content = content
        self.timestamp = timestamp
