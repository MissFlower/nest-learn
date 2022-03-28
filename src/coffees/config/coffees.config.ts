import { registerAs } from '@nestjs/config';

// registerAs函数让我们在第一个参数key下 注册一个命名空间配置对象
export default registerAs('coffees', () => ({
  foo: 'bar',
}));
