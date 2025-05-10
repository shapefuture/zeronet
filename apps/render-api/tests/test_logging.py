import logging

def test_logging_debug_and_error(caplog):
    logger = logging.getLogger("zeronet.render-api")
    with caplog.at_level(logging.DEBUG):
        logger.debug("This is a debug message")
        logger.error("This is an error message")
    assert "debug message" in caplog.text
    assert "error message" in caplog.text
