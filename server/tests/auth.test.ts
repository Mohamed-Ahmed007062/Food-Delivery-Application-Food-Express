import { describe, it } from 'node:test';
import assert from 'node:assert';
import { registerSchema, loginSchema } from '../src/features/auth/auth.validation.js';

describe('Auth Validation Schemas', () => {
  it('should validate a valid registration payload', async () => {
    const validData = {
      body: {
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        password: 'Password123!',
        role: 'customer',
      },
    };

    const result = await registerSchema.parseAsync(validData);
    assert.strictEqual(result.body.name, 'Ahmed Hassan');
    assert.strictEqual(result.body.email, 'ahmed@example.com');
  });

  it('should fail registration validation if password is too short', async () => {
    const invalidData = {
      body: {
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        password: 'short',
        role: 'customer',
      },
    };

    await assert.rejects(async () => {
      await registerSchema.parseAsync(invalidData);
    });
  });

  it('should validate a valid login payload', async () => {
    const validData = {
      body: {
        email: 'ahmed@example.com',
        password: 'Password123!',
      },
    };

    const result = await loginSchema.parseAsync(validData);
    assert.strictEqual(result.body.email, 'ahmed@example.com');
  });
});
