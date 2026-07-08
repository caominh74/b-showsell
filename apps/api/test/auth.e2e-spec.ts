import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, UseGuards } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { Role, UserStatus } from '@prisma/client';
import type { User } from '@prisma/client';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtAuthGuard } from './../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from './../src/auth/guards/roles.guard';
import { Roles } from './../src/auth/decorators/roles.decorator';
import { CurrentUser } from './../src/auth/decorators/current-user.decorator';

@Controller('protected-test')
class ProtectedTestController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  getAdminOnly(@CurrentUser() user: User) {
    return {
      id: user.id,
      role: user.role,
    };
  }
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const adminEmail = 'phase1-admin@example.com';
  const customerEmail = 'phase1-customer@example.com';
  const password = 'phase1-password';

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();
    const users: User[] = [
      {
        id: 'phase1-admin-id',
        email: adminEmail,
        passwordHash,
        fullName: 'Phase One Admin',
        phone: null,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        avatarUrl: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'phase1-customer-id',
        email: customerEmail,
        passwordHash,
        fullName: 'Phase One Customer',
        phone: null,
        role: Role.CUSTOMER,
        status: UserStatus.ACTIVE,
        avatarUrl: null,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [ProtectedTestController],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          findUnique: jest.fn(({ where }: { where: { email?: string; id?: string } }) =>
            Promise.resolve(users.find((user) => user.email === where.email || user.id === where.id) ?? null),
          ),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/me (GET) - should fail without token', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .expect(401);
  });

  it('allows an authenticated user through a JWT protected route', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: customerEmail, password })
      .expect(201);

    await request(app.getHttpServer())
      .get('/protected-test/me')
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.email).toBe(customerEmail);
        expect(body.role).toBe(Role.CUSTOMER);
      });
  });

  it('rejects a non-admin user from an admin-only protected route', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: customerEmail, password })
      .expect(201);

    await request(app.getHttpServer())
      .get('/protected-test/admin')
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .expect(403);
  });

  it('allows an admin user through an admin-only protected route', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password })
      .expect(201);

    await request(app.getHttpServer())
      .get('/protected-test/admin')
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.role).toBe(Role.ADMIN);
      });
  });
});
