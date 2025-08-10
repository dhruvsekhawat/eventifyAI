#!/usr/bin/env python3
"""
Production configuration for Bland AI Voice Service
"""

import os
from typing import Optional


class ProductionConfig:
    """Production configuration class"""
    
    # Bland AI Configuration
    BLAND_AI_API_KEY: str = os.getenv("BLAND_AI_API_KEY", "org_984e2aaad1993874b7806883c0d68e46ad3b717df99f90ede19b4f52b32bafbf03f6fae42cf12c024df569")
    BLAND_AI_BASE_URL: str = os.getenv("BLAND_AI_BASE_URL", "https://api.bland.ai/v1")
    
    # Service Configuration
    MAX_CONCURRENT_CALLS: int = int(os.getenv("MAX_CONCURRENT_CALLS", "10"))
    CALL_TIMEOUT_SECONDS: int = int(os.getenv("CALL_TIMEOUT_SECONDS", "300"))
    CALL_CHECK_INTERVAL: int = int(os.getenv("CALL_CHECK_INTERVAL", "5"))
    
    # Logging Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = os.getenv("LOG_FORMAT", "%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    
    # Cleanup Configuration
    INQUIRY_CLEANUP_HOURS: int = int(os.getenv("INQUIRY_CLEANUP_HOURS", "24"))
    
    # Error Handling
    MAX_RETRY_ATTEMPTS: int = int(os.getenv("MAX_RETRY_ATTEMPTS", "3"))
    RETRY_DELAY_SECONDS: int = int(os.getenv("RETRY_DELAY_SECONDS", "5"))
    
    @classmethod
    def validate(cls) -> bool:
        """Validate that required configuration is present"""
        if not cls.BLAND_AI_API_KEY:
            raise ValueError("BLAND_AI_API_KEY environment variable is required")
        
        if cls.MAX_CONCURRENT_CALLS < 1:
            raise ValueError("MAX_CONCURRENT_CALLS must be at least 1")
        
        if cls.CALL_TIMEOUT_SECONDS < 60:
            raise ValueError("CALL_TIMEOUT_SECONDS must be at least 60 seconds")
        
        return True
    
    @classmethod
    def get_api_key(cls) -> str:
        """Get the Bland AI API key"""
        if not cls.BLAND_AI_API_KEY:
            raise ValueError("BLAND_AI_API_KEY not configured")
        return cls.BLAND_AI_API_KEY


# Environment-specific configurations
class DevelopmentConfig(ProductionConfig):
    """Development configuration"""
    LOG_LEVEL = "DEBUG"
    MAX_CONCURRENT_CALLS = 5
    CALL_TIMEOUT_SECONDS = 180


class StagingConfig(ProductionConfig):
    """Staging configuration"""
    LOG_LEVEL = "INFO"
    MAX_CONCURRENT_CALLS = 8


class ProductionConfig(ProductionConfig):
    """Production configuration"""
    LOG_LEVEL = "WARNING"
    MAX_CONCURRENT_CALLS = 20
    CALL_TIMEOUT_SECONDS = 600  # 10 minutes for production


def get_config(environment: str = None) -> ProductionConfig:
    """
    Get configuration based on environment
    
    Args:
        environment: Environment name (dev, staging, prod)
        
    Returns:
        Configuration class instance
    """
    if not environment:
        environment = os.getenv("ENVIRONMENT", "development").lower()
    
    config_map = {
        "development": DevelopmentConfig,
        "dev": DevelopmentConfig,
        "staging": StagingConfig,
        "production": ProductionConfig,
        "prod": ProductionConfig
    }
    
    config_class = config_map.get(environment, DevelopmentConfig)
    config = config_class()
    config.validate()
    
    return config


# Default configuration instance
config = get_config() 