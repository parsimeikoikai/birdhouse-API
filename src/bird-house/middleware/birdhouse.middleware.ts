import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BirdHouseService } from '../bird-house.service';
@Injectable()
export class BirdhouseMiddleware implements NestMiddleware {
  constructor(
    @Inject(BirdHouseService)
    private readonly birdhouseService: BirdHouseService,
  ) {}
 
  async use(req: Request, res: Response, next: NextFunction) {
    
    if (!this.requiresAuthentication(req)) {
      return next();
    }
    const ubid = Array.isArray(req.headers['x-ubid'])
      ? req.headers['x-ubid'][0]
      : req.headers['x-ubid'];

    if (!ubid) {
      throw new UnauthorizedException('X-UBID header is missing');
    }

    if (!(await this.birdhouseService.isAuthorized(ubid))) {
      throw new UnauthorizedException('Unauthorized access');
    }
    next();
  }

  private requiresAuthentication(req: Request): boolean {
    if (
      req.method === 'POST' &&
      req.path === '/' &&
      req.body.longitude &&
      req.body.latitude &&
      req.body.name
    ) {
      return false;
    }
    return true;
  }
}
