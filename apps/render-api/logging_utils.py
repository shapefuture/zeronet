import logging
import sys
import traceback

def setup_logging():
    logging.basicConfig(
        level=logging.DEBUG,
        format='[%(asctime)s] [%(levelname)s] %(name)s: %(message)s',
        stream=sys.stdout
    )

def log_exception(logger, msg: str, exc: Exception):
    logger.error(f"{msg}: {exc}", exc_info=True)
    logger.debug("Stack trace:\n%s", ''.join(traceback.format_exception(None, exc, exc.__traceback__)))
