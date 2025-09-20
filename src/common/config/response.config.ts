export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum ResponseCode {
  // Success codes
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // Client error codes
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  VALIDATION_ERROR = 422,

  // Server error codes
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export const RESPONSE_MESSAGES = {
  // Success messages
  CREATED_SUCCESS: 'Resource created successfully',
  UPDATED_SUCCESS: 'Resource updated successfully',
  DELETED_SUCCESS: 'Resource deleted successfully',
  RETRIEVED_SUCCESS: 'Data retrieved successfully',
  OPERATION_SUCCESS: 'Operation completed successfully',

  // Error messages
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  FORBIDDEN_ACCESS: 'Access forbidden',
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',

  // Specific messages
  INVALID_CREDENTIALS: 'Invalid credentials provided',
  EXPIRED_TOKEN: 'Token has expired',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
} as const;
