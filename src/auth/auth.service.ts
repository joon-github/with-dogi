import { HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Members } from './entities/Members.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Members)
    private memberRepository: Repository<Members>,
  ) {}

  async signUp(createMemberDto: CreateMemberDto) {
    const existingUser = await this.memberRepository.findOne({
      where: { email: createMemberDto.email }, // Fix: Provide a value for the 'email' property
    });
    if (existingUser) {
      throw new HttpException('User with this email already exists', 400);
    }
    const saltOrRounds = 8;
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
