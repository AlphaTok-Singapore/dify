# AlphaMind聊天控制器 - 集成到Dify API系统
from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user  # 使用Dify的认证系统
from services.alphamind.chat_service import ChatService
from models.alphamind import AlphaMindConversation, AlphaMindMessage
from core.alphamind.ai_engine import AlphaMindAIEngine
from libs.exception import BaseHTTPException
from werkzeug.exceptions import NotFound, BadRequest
import logging

# 创建蓝图
alphamind_chat_bp = Blueprint('alphamind_chat', __name__, url_prefix='/console/api/alphamind/chat')

logger = logging.getLogger(__name__)

@alphamind_chat_bp.route('/conversations', methods=['GET'])
@login_required
def get_conversations():
    """获取用户的对话列表"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        status = request.args.get('status', 'active')
        
        conversations = ChatService.get_user_conversations(
            user_id=current_user.id,
            page=page,
            limit=limit,
            status=status
        )
        
        return jsonify({
            'success': True,
            'data': [conv.to_dict() for conv in conversations.items],
            'pagination': {
                'page': conversations.page,
                'pages': conversations.pages,
                'per_page': conversations.per_page,
                'total': conversations.total
            }
        })
    except Exception as e:
        logger.error(f"Failed to get conversations: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve conversations'
        }), 500

@alphamind_chat_bp.route('/conversations', methods=['POST'])
@login_required
def create_conversation():
    """创建新对话"""
    try:
        data = request.get_json()
        
        if not data or not data.get('title'):
            raise BadRequest('Title is required')
        
        conversation = ChatService.create_conversation(
            user_id=current_user.id,
            title=data['title'],
            agent_id=data.get('agent_id'),
            metadata=data.get('metadata', {})
        )
        
        return jsonify({
            'success': True,
            'data': conversation.to_dict()
        }), 201
        
    except BadRequest as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Failed to create conversation: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create conversation'
        }), 500

@alphamind_chat_bp.route('/conversations/<conversation_id>', methods=['GET'])
@login_required
def get_conversation(conversation_id):
    """获取对话详情"""
    try:
        conversation = ChatService.get_conversation(
            conversation_id=conversation_id,
            user_id=current_user.id
        )
        
        if not conversation:
            raise NotFound('Conversation not found')
        
        return jsonify({
            'success': True,
            'data': conversation.to_dict()
        })
        
    except NotFound as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        logger.error(f"Failed to get conversation: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve conversation'
        }), 500

@alphamind_chat_bp.route('/conversations/<conversation_id>', methods=['PUT'])
@login_required
def update_conversation(conversation_id):
    """更新对话"""
    try:
        data = request.get_json()
        
        conversation = ChatService.update_conversation(
            conversation_id=conversation_id,
            user_id=current_user.id,
            updates=data
        )
        
        if not conversation:
            raise NotFound('Conversation not found')
        
        return jsonify({
            'success': True,
            'data': conversation.to_dict()
        })
        
    except NotFound as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        logger.error(f"Failed to update conversation: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to update conversation'
        }), 500

@alphamind_chat_bp.route('/conversations/<conversation_id>', methods=['DELETE'])
@login_required
def delete_conversation(conversation_id):
    """删除对话"""
    try:
        success = ChatService.delete_conversation(
            conversation_id=conversation_id,
            user_id=current_user.id
        )
        
        if not success:
            raise NotFound('Conversation not found')
        
        return jsonify({
            'success': True,
            'message': 'Conversation deleted successfully'
        })
        
    except NotFound as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        logger.error(f"Failed to delete conversation: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to delete conversation'
        }), 500

@alphamind_chat_bp.route('/conversations/<conversation_id>/messages', methods=['GET'])
@login_required
def get_messages(conversation_id):
    """获取对话消息"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 50, type=int)
        
        # 验证对话所有权
        conversation = ChatService.get_conversation(conversation_id, current_user.id)
        if not conversation:
            raise NotFound('Conversation not found')
        
        messages = ChatService.get_messages(
            conversation_id=conversation_id,
            page=page,
            limit=limit
        )
        
        return jsonify({
            'success': True,
            'data': [msg.to_dict() for msg in messages.items],
            'pagination': {
                'page': messages.page,
                'pages': messages.pages,
                'per_page': messages.per_page,
                'total': messages.total
            }
        })
        
    except NotFound as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        logger.error(f"Failed to get messages: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve messages'
        }), 500

@alphamind_chat_bp.route('/conversations/<conversation_id>/messages', methods=['POST'])
@login_required
def send_message(conversation_id):
    """发送消息"""
    try:
        data = request.get_json()
        
        if not data or not data.get('content'):
            raise BadRequest('Message content is required')
        
        # 验证对话所有权
        conversation = ChatService.get_conversation(conversation_id, current_user.id)
        if not conversation:
            raise NotFound('Conversation not found')
        
        # 处理用户消息
        user_message = ChatService.create_message(
            conversation_id=conversation_id,
            role='user',
            content=data['content'],
            message_type=data.get('type', 'text'),
            attachments=data.get('attachments', []),
            metadata=data.get('metadata', {})
        )
        
        # 生成AI回复
        ai_response = ChatService.generate_ai_response(
            conversation=conversation,
            user_message=user_message
        )
        
        return jsonify({
            'success': True,
            'data': {
                'user_message': user_message.to_dict(),
                'ai_response': ai_response.to_dict() if ai_response else None
            }
        }), 201
        
    except (BadRequest, NotFound) as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), e.code
    except Exception as e:
        logger.error(f"Failed to send message: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to send message'
        }), 500

@alphamind_chat_bp.route('/conversations/<conversation_id>/messages/stream', methods=['POST'])
@login_required
def stream_message(conversation_id):
    """流式发送消息（Server-Sent Events）"""
    try:
        data = request.get_json()
        
        if not data or not data.get('content'):
            raise BadRequest('Message content is required')
        
        # 验证对话所有权
        conversation = ChatService.get_conversation(conversation_id, current_user.id)
        if not conversation:
            raise NotFound('Conversation not found')
        
        def generate_response():
            try:
                # 创建用户消息
                user_message = ChatService.create_message(
                    conversation_id=conversation_id,
                    role='user',
                    content=data['content'],
                    message_type=data.get('type', 'text'),
                    attachments=data.get('attachments', [])
                )
                
                yield f"data: {jsonify({'type': 'user_message', 'data': user_message.to_dict()}).get_data(as_text=True)}\n\n"
                
                # 流式生成AI回复
                for chunk in ChatService.stream_ai_response(conversation, user_message):
                    yield f"data: {jsonify(chunk).get_data(as_text=True)}\n\n"
                
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                logger.error(f"Stream error: {str(e)}")
                yield f"data: {jsonify({'type': 'error', 'error': str(e)}).get_data(as_text=True)}\n\n"
        
        return current_app.response_class(
            generate_response(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*'
            }
        )
        
    except (BadRequest, NotFound) as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), e.code
    except Exception as e:
        logger.error(f"Failed to stream message: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to stream message'
        }), 500

@alphamind_chat_bp.route('/system/health', methods=['GET'])
def get_system_health():
    """获取系统健康状态"""
    try:
        health_status = ChatService.get_system_health()
        return jsonify({
            'success': True,
            'data': health_status
        })
    except Exception as e:
        logger.error(f"Failed to get system health: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get system health',
            'data': {
                'api': 'down',
                'database': 'unknown',
                'ai_services': 'unknown',
                'last_check': None
            }
        }), 500

# 错误处理
@alphamind_chat_bp.errorhandler(BaseHTTPException)
def handle_http_exception(e):
    return jsonify({
        'success': False,
        'error': e.description,
        'code': e.code
    }), e.code

@alphamind_chat_bp.errorhandler(Exception)
def handle_general_exception(e):
    logger.error(f"Unhandled exception: {str(e)}")
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

