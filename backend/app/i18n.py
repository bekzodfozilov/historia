from typing import Any

LANGS = ("en", "uz")


def _is_localized(v: Any) -> bool:
    return isinstance(v, dict) and set(v) == set(LANGS) and all(isinstance(x, str) for x in v.values())


def localize(value: Any, lang: str | None) -> Any:
    """Recursively replace {"en": ..., "uz": ...} with the chosen language (EN fallback)."""
    if lang is None:
        return value
    if _is_localized(value):
        return value.get(lang) or value["en"]
    if isinstance(value, dict):
        return {k: localize(v, lang) for k, v in value.items()}
    if isinstance(value, list):
        return [localize(v, lang) for v in value]
    return value
