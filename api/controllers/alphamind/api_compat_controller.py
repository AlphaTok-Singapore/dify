import logging
import os

from flask import Blueprint, jsonify

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

api_bp = Blueprint('api_compat', __name__, url_prefix='/api')

@api_bp.route('/v1/features', methods=['GET'])
def api_features():
    logger.info("--- api_features in api_compat_controller.py called ---")
    enable_email_password_login = os.getenv('ENABLE_EMAIL_PASSWORD_LOGIN', 'false').lower() == 'true'
    enable_email_code_login = os.getenv('ENABLE_EMAIL_CODE_LOGIN', 'false').lower() == 'true'

    response_data = {
        "enable_email_password_login": enable_email_password_login,
        "enable_email_code_login": enable_email_code_login,
        "enable_social_oauth_login": False,
        "sso_enforced_for_signin": False,
        "allow_register": True,
        "allow_create_workspace": True,
        "license_status": "active",
        "webapp_auth": {"enabled": False},
    }
    logger.info(f"--- Returning feature flags: {response_data} ---")
    return jsonify(response_data)

@api_bp.route('/v1/console/features', methods=['GET'])
def api_console_features():
    return api_features()

@api_bp.route('/v1/console/account/init', methods=['GET'])
def api_account_init():
    return jsonify({
        "is_initialized": True,
        "email": "admin@example.com",
        "name": "admin"
    })
