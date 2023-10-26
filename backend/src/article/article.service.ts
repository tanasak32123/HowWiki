import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/article/entities/article.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { Repository, Like } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}
  async createArticle(createArticleDto: CreateArticleDto, authorName: string) {
    console.log(createArticleDto);
    const article = await this.articleRepository.create(createArticleDto);
    article.authorName = authorName;
    console.log(article);
    return await this.articleRepository.save(article);
  }

  async getArticles(keyword: string) {
    const articles = await this.articleRepository.find({
      where: {
        title: Like('%' + keyword + '%'),
      },
    });
    return articles;
  }

  async getArticle(articleId: number) {
    const article = await this.articleRepository.findOne({
      where: {
        articleId: articleId,
      },
    });
    if (!article) {
      throw new HttpException('no article', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  async getArticlesByAuthorName(authorName: string) {
    return await this.articleRepository.find({
      where: {
        authorName: authorName,
      },
    });
  }
}
