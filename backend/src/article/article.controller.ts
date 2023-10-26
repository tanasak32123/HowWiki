/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Patch,
  Request,
  Post,
  Response,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
// eslint-disable-next-line prettier/prettier

import { ArticleService } from './article.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { CreateArticleDto } from './dto/create-article-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

//@UseGuards(JwtAuthGuard)
@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getArticles(@Query('keyword') keyword: string) {
    return await this.articleService.getArticles(keyword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('articleid/:articleId')
  async getArticleByArticleId(@Param('articleId') id: string) {
    const articleId = Number(id);
    return await this.articleService.getArticle(articleId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('author')
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req,
  ) {
    const authorName = req.user['username'];
    return await this.articleService.createArticle(
      createArticleDto,
      authorName,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('author')
  async getArticlesByAuthorName(@Request() req) {
    console.log(req);
    const authorName = req.user['username'];
    console.log(authorName);
    return await this.articleService.getArticlesByAuthorName(authorName);
  }
}
