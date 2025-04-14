import logger from "electron-log";

logger.transports.file.level = "debug";
logger.transports.file.maxSize = 1002430; // 10M
logger.transports.console.level = false;
export default {
  logger,
  info(param) {
    logger.info(param);
  },
  warn(param) {
    logger.warn(param);
  },
  error(param) {
    logger.error(param);
  },
};
