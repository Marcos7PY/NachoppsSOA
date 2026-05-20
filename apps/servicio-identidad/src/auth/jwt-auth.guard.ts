import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Guard que exige un JWT Bearer válido en la petición. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
