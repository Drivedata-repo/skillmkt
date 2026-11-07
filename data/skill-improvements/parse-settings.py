"""Safe YAML frontmatter reader. No writes, shell execution, or network calls.

Requires Python 3 and PyYAML. Run: python parse-settings.py FILE
Only the documented settings schema is accepted; extend SCHEMA deliberately.
"""
import json
import pathlib
import sys

try:
    import yaml
except ImportError:
    raise SystemExit("PyYAML unavailable; use an authorized isolated environment, not regex parsing")

SCHEMA = {"enabled": bool, "strict_mode": bool, "max_value": int,
          "validation_level": str, "agent_name": str, "coordinator_session": str,
          "data_file": str, "description": str}

class UniqueSafeLoader(yaml.SafeLoader):
    pass

def construct_mapping(loader, node, deep=False):
    output = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if not isinstance(key, str) or key in output:
            raise ValueError("Duplicate or non-string settings key")
        output[key] = loader.construct_object(value_node, deep=deep)
    return output

UniqueSafeLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, construct_mapping)

def parse_settings(text):
    if len(text.encode("utf-8")) > 65536:
        raise ValueError("Settings file exceeds 64 KiB")
    lines = text.splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        raise ValueError("Missing opening frontmatter delimiter")
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        raise ValueError("Missing closing frontmatter delimiter")
    raw = "".join(lines[1:end])
    # Aliases/anchors are unnecessary for this small schema and can expand graphs.
    if any(isinstance(t, (yaml.tokens.AliasToken, yaml.tokens.AnchorToken)) for t in yaml.scan(raw)):
        raise ValueError("Aliases and anchors are not accepted in settings")
    settings = yaml.load(raw, Loader=UniqueSafeLoader) or {}
    if not isinstance(settings, dict):
        raise ValueError("Settings must be a mapping")
    for key, value in settings.items():
        if key not in SCHEMA or type(value) is not SCHEMA[key]:
            raise ValueError("Unknown setting or unexpected type: " + str(key))
    if "max_value" in settings and not 0 <= settings["max_value"] <= 1000000:
        raise ValueError("max_value outside allowed range")
    return {"settings": settings, "body": "".join(lines[end+1:])}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python parse-settings.py FILE")
    file = pathlib.Path(sys.argv[1])
    if file.stat().st_size > 65536:
        raise SystemExit("Settings file exceeds 64 KiB")
    print(json.dumps(parse_settings(file.read_text(encoding="utf-8")), ensure_ascii=False))
