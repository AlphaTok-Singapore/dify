"""
AlphaMind 聊天服务
文件位置: api/services/alphamind/chat_service.py
"""

import json
import requests
from typing import Dict, Any, Optional, List
from datetime import datetime

from api.models.alphamind import AlphaMindConversation, AlphaMindMessage, AlphaMindAgent, AlphaMindWorkflowExecution
from api.services.alphamind.n8n_service import AlphaMindN8nService
from api.core.alphamind.ai_engine import AlphaMindAIEngine
from extensions.ext_database import db
from core.model_runtime.entities.message_entities import PromptMessage, UserPromptMessage, AssistantPromptMessage, SystemPromptMessage


class AlphaMindChatService:
    """AlphaMind 聊天服务"""
    
    def __init__(self):
        self.ai_engine = AlphaMindAIEngine()
        self.n8n_service = AlphaMindN8nService()
    
    def generate_response(
        self, 
        conversation: AlphaMindConversation,
        user_message: AlphaMindMessage,
        agent: Optional[AlphaMindAgent] = None
    ) -> Dict[str, Any]:
        """生成AI回复"""
        try:
            # 构建对话历史
            messages = self._build_conversation_history(conversation, user_message)
            
            # 如果有智能体，使用智能体配置
            if agent:
                # 添加系统提示词
                if agent.prompt_template:
                    system_message = SystemPromptMessage(content=agent.prompt_template)
                    messages.insert(0, system_message)
                
                # 使用智能体的模型配置
                model_config = agent.model_config or {}
            else:
                model_config = {}
            
            # 调用AI引擎生成回复
            response = self.ai_engine.generate_response(
                messages=messages,
                model_config=model_config,
                tools=agent.tools if agent else []
            )
            
            # 检查是否需要调用工具或工作流
            if response.get('tool_calls'):
                response = self._handle_tool_calls(
                    conversation=conversation,
                    tool_calls=response['tool_calls'],
                    agent=agent
                )
            
            return {
                'content': response.get('content', ''),
                'message_type': response.get('message_type', 'text'),
                'metadata': response.get('metadata', {})
            }
            
        except Exception as e:
            return {
                'content': f'抱歉，生成回复时出现错误: {str(e)}',
                'message_type': 'error',
                'metadata': {'error': str(e)}
            }
    
    def _build_conversation_history(
        self, 
        conversation: AlphaMindConversation,
        current_message: AlphaMindMessage,
        max_messages: int = 20
    ) -> List[PromptMessage]:
        """构建对话历史"""
        messages = []
        
        # 获取最近的消息
        recent_messages = AlphaMindMessage.query.filter_by(
            conversation_id=conversation.id
        ).order_by(
            AlphaMindMessage.created_at.desc()
        ).limit(max_messages).all()
        
        # 反转顺序，使其按时间正序
        recent_messages.reverse()
        
        # 转换为PromptMessage格式
        for msg in recent_messages:
            if msg.role == 'user':
                messages.append(UserPromptMessage(content=msg.content))
            elif msg.role == 'assistant':
                messages.append(AssistantPromptMessage(content=msg.content))
            elif msg.role == 'system':
                messages.append(SystemPromptMessage(content=msg.content))
        
        # 添加当前用户消息
        messages.append(UserPromptMessage(content=current_message.content))
        
        return messages
    
    def _handle_tool_calls(
        self,
        conversation: AlphaMindConversation,
        tool_calls: List[Dict[str, Any]],
        agent: Optional[AlphaMindAgent] = None
    ) -> Dict[str, Any]:
        """处理工具调用"""
        results = []
        
        for tool_call in tool_calls:
            tool_name = tool_call.get('name')
            tool_args = tool_call.get('arguments', {})
            
            try:
                if tool_name == 'execute_workflow':
                    # 执行n8n工作流
                    result = self.execute_workflow(
                        conversation=conversation,
                        workflow_id=tool_args.get('workflow_id'),
                        input_data=tool_args.get('input_data', {}),
                        user_id=conversation.user_id
                    )
                    results.append(f"工作流执行结果: {result}")
                
                elif tool_name == 'search_web':
                    # 网络搜索
                    result = self._search_web(tool_args.get('query', ''))
                    results.append(f"搜索结果: {result}")
                
                elif tool_name == 'read_file':
                    # 文件读取
                    result = self._read_file(tool_args.get('file_path', ''))
                    results.append(f"文件内容: {result}")
                
                else:
                    results.append(f"未知工具: {tool_name}")
                    
            except Exception as e:
                results.append(f"工具调用失败 {tool_name}: {str(e)}")
        
        return {
            'content': '\n'.join(results),
            'message_type': 'tool_result',
            'metadata': {'tool_calls': tool_calls, 'results': results}
        }
    
    def execute_workflow(
        self,
        conversation: AlphaMindConversation,
        workflow_id: str,
        input_data: Dict[str, Any],
        user_id: str
    ) -> Dict[str, Any]:
        """执行n8n工作流"""
        try:
            # 记录工作流执行
            execution = AlphaMindWorkflowExecution(
                user_id=user_id,
                conversation_id=conversation.id,
                workflow_id=workflow_id,
                input_data=input_data,
                status='running'
            )
            db.session.add(execution)
            db.session.commit()
            
            # 调用n8n服务执行工作流
            result = self.n8n_service.execute_workflow(
                workflow_id=workflow_id,
                input_data=input_data
            )
            
            # 更新执行记录
            execution.execution_id = result.get('execution_id')
            execution.status = 'completed' if result.get('success') else 'failed'
            execution.output_data = result.get('data', {})
            execution.error_message = result.get('error')
            execution.execution_time = result.get('execution_time')
            execution.completed_at = datetime.utcnow()
            
            db.session.commit()
            
            return result
            
        except Exception as e:
            # 更新执行记录为失败状态
            if 'execution' in locals():
                execution.status = 'failed'
                execution.error_message = str(e)
                execution.completed_at = datetime.utcnow()
                db.session.commit()
            
            raise e
    
    def _search_web(self, query: str) -> str:
        """网络搜索工具"""
        # 这里可以集成实际的搜索API
        return f"搜索 '{query}' 的结果..."
    
    def _read_file(self, file_path: str) -> str:
        """文件读取工具"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return f"读取文件失败: {str(e)}"
    
    def get_conversation_summary(self, conversation_id: str) -> str:
        """获取对话摘要"""
        try:
            messages = AlphaMindMessage.query.filter_by(
                conversation_id=conversation_id
            ).order_by(
                AlphaMindMessage.created_at.asc()
            ).all()
            
            if not messages:
                return "暂无对话内容"
            
            # 构建对话文本
            conversation_text = []
            for msg in messages[-10:]:  # 只取最近10条消息
                role = "用户" if msg.role == "user" else "助手"
                conversation_text.append(f"{role}: {msg.content}")
            
            # 使用AI生成摘要
            summary_prompt = f"请为以下对话生成简洁的摘要:\n\n{''.join(conversation_text)}"
            
            messages = [UserPromptMessage(content=summary_prompt)]
            response = self.ai_engine.generate_response(messages=messages)
            
            return response.get('content', '无法生成摘要')
            
        except Exception as e:
            return f"生成摘要失败: {str(e)}"

