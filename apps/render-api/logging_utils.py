import logging
import sys

def setup_logging():
    logging.basicConfig(
        level=logging.DEBUG,
        format='[%(asctime)s] [%(levelname)s] %(name)s: %(message)s',
        stream=sys.stdout
    )

def log_exception(logger, msg: str, exc: Exception):
    logger.error(f"{msg}: {exc}", exc_info=True)
