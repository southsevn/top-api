import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "./../src/app.module";
import { disconnect } from "mongoose";
import { AuthDto } from "src/auth/dto/auth.dto";
import * as request from "supertest";
import { doesNotMatch } from "assert";

const loginDto: AuthDto = {
  login: "testuser@mail.com",
  password: "1q2w3e4r5t",
};

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/auth/login (POST) - success", async () => {
    return await request(app.getHttpServer())
      .post("/auth/login")
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });

  it("/auth/login (POST) - fail password", async () => {
    return await request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...loginDto, password: "12" })
      .expect(401, {
        statusCode: 401,
        message: "Wrong password",
        error: "Unauthorized",
      });
  });

  it("/auth/login (POST) - fail login", async () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...loginDto, login: "aa@mail.ru" })
      .expect(401, {
        statusCode: 401,
        message: "User not found",
        error: "Unauthorized",
      });
  });

  afterAll(() => {
    disconnect();
  });
});
