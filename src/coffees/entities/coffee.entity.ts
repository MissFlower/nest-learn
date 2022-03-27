import { Flavor } from './flavor.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity() // 每一个Entity类代表一个SQL表
// 默认情况下 TypeORM将根据我们的小写类名来命名SQL表
// 所以将生成的SQL表 是“coffee”, 小写 sql table === 'coffee
// 如果你想为你的实体使用不同的表名 可以在@Entity()装饰器内部指定 将“coffees”传递给装饰器将生成一个“coffees”表
export class Coffee {
  @PrimaryGeneratedColumn() // 修饰id为主键 并且为我们自动增加值
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number; // 推荐量 默认0

  @JoinTable() // 有助于指定关系的OWNER端 在本例重视Coffee Entity
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, {
    cascade: true, // ['insert']
  }) // 设置多对多关系
  flavors: Flavor[];
}
