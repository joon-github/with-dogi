import { HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Members } from './entities/Members.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Members)
    private memberRepository: Repository<Members>,
  ) {}

  async signUp(createMemberDto: CreateMemberDto) {
    const existingUser = await this.memberRepository.findOne({
      where: { email: createMemberDto.email },
    });
    if (existingUser) {
      throw new HttpException('이미 등록된 이메일 입니다.', 400);
    }
    const saltOrRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(
      createMemberDto.password,
      saltOrRounds,
    );

    const user = this.memberRepository.create({
      ...createMemberDto,
      password: hashedPassword,
    });

    await this.memberRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    console.log(loginDto);
    const user = await this.memberRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new HttpException('로그인 정보가 정확하지 않습니다.', 404);
    }
    console.log(user);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    console.log(updateAuthDto);
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
