/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';



@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private verifier : any ;
  
    constructor(private jwtService: JwtService, private configService : ConfigService) {
        super();
        
        this.verifier = CognitoJwtVerifier.create({
            userPoolId: configService.get<string>('aws_cognito.userPoolId'),
            tokenUse: "access",
            clientId: configService.get<string>('aws_cognito.clientId'),
          });
    }
      
    

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
          throw new UnauthorizedException();
        }
        try {
            const payload = await this.verifier.verify(
                token // the JWT as string
              );
              console.log("Token is valid. Payload:", payload);
          
          // 💡 We're assigning the payload to the request object here
          // so that we can access it in our route handlers
          request['user'] = payload;
        } catch {
          throw new UnauthorizedException();
        }
        return true;
    
      }

      private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
    

      
    
    //   handleRequest(err, user, info) {
    //     // You can throw an exception based on either "info" or "err" arguments
    //     if (err || !user) {
    //       throw err || new UnauthorizedException();
    //     }
    //     return user;
    //   }
}