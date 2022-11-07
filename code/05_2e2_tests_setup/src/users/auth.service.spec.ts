import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service

    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const email = 'asdf@asdf.com';
    const password = 'asdf';
    const user = await service.signup(email, password);

    expect(user.password).not.toEqual(password);

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // Here is a test condition
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: '1@a.com', password: '1' } as User]);

    expect(async () => {
      const email = 'asdf@asdf.com';
      const password = 'asdf';
      await service.signup(email, password);
    }).rejects.toThrow(BadRequestException);
  });

  it('throws an error if user signs up with email that is in use', async () => {
    const email = 'asdf@asdf.com';
    const password = 'asdf';
    await service.signup(email, password);

    expect(async () => {
      await service.signup(email, password);
    }).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    expect(async () => {
      const email = 'asdf@asdf.com';
      const password = 'asdf';
      await service.signin(email, password);
    }).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
      ]);
    expect(async () => {
      const email = '121asdf@asdf.com';
      const password = 'password';
      await service.signin(email, password);
    }).rejects.toThrow(BadRequestException);
  });

  it('throws if an invalid password is provided', async () => {
    const email = '121asdf@asdf.com';
    let password = 'l1k2jkjl';
    await service.signup(email, password);
    expect(async () => {
      password = 'password';
      await service.signin(email, password);
    }).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    const email = 'asdf@asdf.com';
    const password = 'mypassword';
    await service.signup(email, password);

    const user = await service.signin(email, password);
    expect(user).toBeDefined();
  });
});
