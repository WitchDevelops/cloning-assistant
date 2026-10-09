import os

# Space is intentional here, it allows tests to check if it still passes if we mistyped it
# with a space (there's a .split() and .trim() for this)
os.environ["ALLOWED_ORIGINS"] = "http://localhost:5173, http://example.com"
