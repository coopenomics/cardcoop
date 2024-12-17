import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CoopJwtAuthGuard extends AuthGuard('coop-jwt') {}
