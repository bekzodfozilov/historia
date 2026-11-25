from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

DEV_SECRET = "dev-insecure-change-me"


class Settings(BaseSettings):
    """Configuration from environment variables (or backend/.env locally)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"
    database_url: str = "sqlite:///./historia.db"
    jwt_secret: str = DEV_SECRET
    access_token_minutes: int = 30
    refresh_token_days: int = 14
    # Comma-separated list of allowed frontend origins
    cors_origins: str = "http://localhost:5173,http://localhost:4173"
    # Optional regex for extra allowed origins
    cors_origin_regex: str | None = None
    # Optional: create/upgrade this account to admin on startup
    admin_email: str | None = None
    admin_password: str | None = None

    @property
    def sqlalchemy_url(self) -> str:
        # Render/Heroku hand out postgres:// URLs; SQLAlchemy needs an explicit driver.
        url = self.database_url
        for prefix in ("postgres://", "postgresql://"):
            if url.startswith(prefix):
                return "postgresql+psycopg://" + url[len(prefix):]
        return url

    @property
    def cors_list(self) -> list[str]:
        return [o.strip().rstrip("/") for o in self.cors_origins.split(",") if o.strip()]

    @model_validator(mode="after")
    def _require_secret_in_production(self):
        if self.environment == "production" and (self.jwt_secret == DEV_SECRET or len(self.jwt_secret) < 32):
            raise ValueError("JWT_SECRET must be set to a random value of 32+ characters in production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
