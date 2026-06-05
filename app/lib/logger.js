const LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const SERVICE = 'frontend';
const SENSITIVE_KEYS =
  /password|token|secret|authorization|cookie|session|pass|email|phone|address|ssn|birthdate|dob/i;

const getLogLevel = () => {
  const configuredLevel = String(
    process.env.NEXT_PUBLIC_LOG_LEVEL || process.env.LOG_LEVEL || 'info',
  ).toLowerCase();

  return LEVELS[configuredLevel] ? configuredLevel : 'info';
};

const shouldLog = (level) => {
  return LEVELS[level] >= LEVELS[getLogLevel()];
};

const redactValue = (value, depth = 0) => {
  if (value == null) return value;
  if (depth > 3) return '[Depth limit reached]';

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, depth + 1));
  }

  if (typeof value === 'object') {
    return Object.entries(value).reduce((accumulator, [key, nestedValue]) => {
      if (SENSITIVE_KEYS.test(key)) {
        accumulator[key] = '[REDACTED]';
      } else {
        accumulator[key] = redactValue(nestedValue, depth + 1);
      }
      return accumulator;
    }, {});
  }

  return value;
};

const buildEntry = (level, message, context = {}) => ({
  timestamp: new Date().toISOString(),
  level,
  message,
  environment: process.env.NODE_ENV || 'development',
  service: context.service || SERVICE,
  ...redactValue({ ...context, service: undefined }),
});

const emit = (level, message, context = {}) => {
  if (!shouldLog(level)) return;

  const serialized = JSON.stringify(buildEntry(level, message, context));

  if (level === 'error') {
    console.error(serialized);
  } else if (level === 'warn') {
    console.warn(serialized);
  } else {
    console.log(serialized);
  }
};

export const createLogger = (service = SERVICE) => ({
  debug: (message, context = {}) =>
    emit('debug', message, { ...context, service }),
  info: (message, context = {}) =>
    emit('info', message, { ...context, service }),
  warn: (message, context = {}) =>
    emit('warn', message, { ...context, service }),
  error: (message, context = {}) =>
    emit('error', message, { ...context, service }),
});

export const logDomainAction = (logger, action, context = {}) => {
  const level =
    context.level || (context.result === 'failure' ? 'warn' : 'info');
  logger[level](context.message || action, {
    ...context,
    action,
    result: context.result || 'success',
  });
};

export const getClientRequestId = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export { redactValue };
