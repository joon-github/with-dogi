import { IsString, Matches, MinLength } from 'class-validator';

export class UpdatePasswordrDto {
  @IsString()
  beforPassword: string;

  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Matches(/(?=.*\W)/, {
    message: '비밀번호는 최소 하나의 특수문자를 포함해야 합니다.',
  })
  afterPassword: string;
}

// const isPasswordMatching = await bcrypt.compare(
//   loginDto.password,
//   findUser.password,
// );

// if (!isPasswordMatching) {
//   throw new HttpException(AuthException.LOGIN_FAIL, HttpStatus.BAD_REQUEST);
// }
