import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  articleId: number;

  @Column()
  title: string;

  @Column({ default: 0 })
  views: number;

  @Column()
  authorName: string; 

  @Column()
  imageKey: string;

  @Column()
  textKey: string;

  @CreateDateColumn()
  createdAt: Date;
}
