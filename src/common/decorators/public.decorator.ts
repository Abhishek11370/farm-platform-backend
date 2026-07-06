import { SetMetadata } from '@nestjs/common';

/**
 * Public decorator marks a route as public (no auth required).
 */
export const Public = () => SetMetadata('isPublic', true);
